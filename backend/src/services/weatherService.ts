import axios from "axios";
import { WeatherData } from "../models/WeatherData";
import { DailySummary } from "../models/DailySummary";
import { City } from "../models/City";
import { User } from "../models/User";
import { Schema } from "mongoose";
import convertTemperature from "../convertTemp";
import { TemperatureNotifier } from "./notificationService";

interface WeatherResponse {
  city: any;
  temperature: number;
  feelsLike: number;
  weatherCondition: any;
  timestamp: Date;
}

export class WeatherService {
  private apiKey: string;
  private baseUrl: string;
  private tempretureNotifier: TemperatureNotifier;

  constructor() {
    this.apiKey = process.env.OPENWEATHERMAP_API_KEY!;
    this.baseUrl = "http://api.openweathermap.org/data/2.5/weather";
    this.tempretureNotifier = new TemperatureNotifier();
    this.fetchWeatherData = this.fetchWeatherData.bind(this);
  }

  async getCurrentWeatherByUserId(
    userId: Schema.Types.ObjectId
  ): Promise<WeatherResponse> {
    const user = await User.findById(userId).populate("location");
    if (!user) {
      throw new Error("User not found");
    }

    const weatherData = await WeatherData.findOne({
      city: user.location,
    }).sort({ timestamp: -1 });

    if (!weatherData) {
      throw new Error("Weather data not found");
    }

    const tempConverted = convertTemperature(
      user.preferredTemperatureUnit,
      weatherData.temperature
    );
    const feelsLikeConverted = convertTemperature(
      user.preferredTemperatureUnit,
      weatherData.feelsLike
    );
    return {
      city: user.location,
      temperature: tempConverted,
      feelsLike: feelsLikeConverted,
      weatherCondition: weatherData.weatherCondition,
      timestamp: new Date(weatherData.createdAt),
    };
  }

  async getCityWeather(
    cityId: string,
    userId: Schema.Types.ObjectId
  ): Promise<WeatherResponse> {
    const user = await User.findById(userId).populate("location");
    if (!user) {
      throw new Error("User not found");
    }
    const weatherData = await WeatherData.findOne({
      city: cityId,
    })
      .sort({ timestamp: -1 })
      .populate("city");

    if (!weatherData) {
      throw new Error("Weather data not found");
    }

    const tempConverted = convertTemperature(
      user.preferredTemperatureUnit,
      weatherData.temperature
    );
    const feelsLikeConverted = convertTemperature(
      user.preferredTemperatureUnit,
      weatherData.feelsLike
    );
    return {
      city: weatherData.city,
      temperature: tempConverted,
      feelsLike: feelsLikeConverted,
      weatherCondition: weatherData.weatherCondition,
      timestamp: new Date(weatherData.createdAt),
    };
  }

  async getDailySummary(cityId: string, userId: Schema.Types.ObjectId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const summary = await DailySummary.findOne({
      city: cityId,
      date: today,
    }).populate("city");

    if (!summary) {
      throw new Error("Daily summary not found");
    }
    const user = await User.findById(userId).populate("location");
    if (!user) {
      throw new Error("User not found");
    }

    const maxtempConverted = convertTemperature(
      user.preferredTemperatureUnit,
      summary.maxTemperature
    );
    const mintempConverted = convertTemperature(
      user.preferredTemperatureUnit,
      summary.minTemperature
    );
    const avgTempConverted = convertTemperature(
      user.preferredTemperatureUnit,
      summary.averageTemperature
    );
    return {
      city: summary.city,
      date: summary.date,
      averageTemperature: avgTempConverted,
      maxTemperature: maxtempConverted,
      minTemperature: mintempConverted,
      dominantWeatherCondition: summary.dominantWeatherCondition,
      weatherConditionCount: summary.weatherConditionCount,
    };
  }

  async getAllCities() {
    const cities = await City.find();
    return cities;
  }

  async fetchWeatherData(cityId: Schema.Types.ObjectId) {
    try {
      const city = await City.findById({ _id: cityId });
      if (!city) {
        throw new Error("City not found");
      }
      const response = await axios.get(
        `${this.baseUrl}?lat=${city.lat}&lon=${city.lon}&appid=${this.apiKey}`
      );
      const weatherData = new WeatherData({
        city: cityId,
        temperature: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        pressure: response.data.main.pressure,
        humidity: response.data.main.humidity,
        weatherCondition: response.data.weather,
        timestamp: new Date(),
      });

      await weatherData.save();
      await this.updateDailySummary(cityId);
      await this.tempretureNotifier.notifyUsers(weatherData.temperature,cityId);
      return weatherData;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching weather data from OpenWeatherMap");
    }
  }

  private async updateDailySummary(cityId: Schema.Types.ObjectId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weatherData = await WeatherData.find({
      city: cityId,
      createdAt: {
        $gte: today,
      },
    });

    if (weatherData.length === 0) return;

    const temperatures = weatherData.map((data) => data.temperature);

    const conditionCount = weatherData.reduce(
      (acc: { [key: string]: number }, data) => {
        data.weatherCondition.forEach((condition) => {
          const key = condition.main;
          acc[key] = (acc[key] || 0) + 1;
        });
        return acc;
      },
      {}
    );

    const dominantCondition = Object.entries(conditionCount).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    await DailySummary.findOneAndUpdate(
      {
        city: cityId,
        date: today,
      },
      {
        averageTemperature:
          temperatures.reduce((a, b) => a + b) / temperatures.length,
        maxTemperature: Math.max(...temperatures),
        minTemperature: Math.min(...temperatures),
        dominantWeatherCondition: dominantCondition,
        weatherConditionCount: conditionCount,
      },
      { upsert: true }
    );
  }
}

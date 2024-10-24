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
  pressure: number;
  humidity: number;
  weatherCondition: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  windSpeed: number;
  visibility: number;
  createdAt: Date;
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
      windSpeed: weatherData.windSpeed,
      visibility: weatherData.visibility,
      pressure: weatherData.pressure,
      humidity: weatherData.humidity,
      createdAt: new Date(weatherData.createdAt),
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
      windSpeed: weatherData.windSpeed,
      visibility: weatherData.visibility,
      pressure: weatherData.pressure,
      humidity: weatherData.humidity,
      createdAt: new Date(weatherData.createdAt),
    };
  }

  // async getDailySummary(cityId: string, userId: Schema.Types.ObjectId) {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const summary = await DailySummary.findOne({
  //     city: cityId,
  //     date: today,
  //   }).populate("city");

  //   if (!summary) {
  //     throw new Error("Daily summary not found");
  //   }
  //   const user = await User.findById(userId).populate("location");
  //   if (!user) {
  //     throw new Error("User not found");
  //   }

  //   const maxtempConverted = convertTemperature(
  //     user.preferredTemperatureUnit,
  //     summary.maxTemperature
  //   );
  //   const mintempConverted = convertTemperature(
  //     user.preferredTemperatureUnit,
  //     summary.minTemperature
  //   );
  //   const avgTempConverted = convertTemperature(
  //     user.preferredTemperatureUnit,
  //     summary.averageTemperature
  //   );
  //   return {
  //     city: summary.city,
  //     date: summary.date,
  //     averageTemperature: avgTempConverted,
  //     maxTemperature: maxtempConverted,
  //     minTemperature: mintempConverted,
  //     dominantWeatherCondition: summary.dominantWeatherCondition,
  //     weatherConditionCount: summary.weatherConditionCount,
  //   };
  // }

  async getDailySummary(cityId: string, userId: Schema.Types.ObjectId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create an array of the last 7 dates
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date;
    });

    // Get user preferences first to avoid repeated queries
    const user = await User.findById(userId).populate("location");
    if (!user) {
      throw new Error("User not found");
    }

    // Fetch all summaries for the last 7 days
    const summaries = await DailySummary.find({
      city: cityId,
    })
      .populate("city")
      .sort({ date: -1 })
      .limit(7); // Sort by date descending

    // If no summaries found, throw error
    if (!summaries.length) {
      throw new Error("No daily summaries found");
    }
    // Convert and map the summaries
    const weeklySummary = summaries.map((summary) => ({
      city: summary.city,
      date: summary.date,
      averageTemperature: convertTemperature(
        user.preferredTemperatureUnit,
        summary.averageTemperature
      ),
      maxTemperature: convertTemperature(
        user.preferredTemperatureUnit,
        summary.maxTemperature
      ),
      minTemperature: convertTemperature(
        user.preferredTemperatureUnit,
        summary.minTemperature
      ),
      dominantWeatherCondition: summary.dominantWeatherCondition,
      weatherConditionCount: summary.weatherConditionCount,
    }));

    return weeklySummary;
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
        windSpeed: response.data.wind.speed,
        visibility: response.data.visibility,
        timestamp: new Date(),
      });

      await weatherData.save();
      await this.updateDailySummary(cityId);
      await this.tempretureNotifier.notifyUsers(
        weatherData.temperature,
        cityId
      );
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

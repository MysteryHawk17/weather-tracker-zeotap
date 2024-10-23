import { Request, Response } from "express";
import { WeatherService } from "../services/weatherService";
import { Schema } from "mongoose";

export class WeatherController {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
    this.getCurrentWeather = this.getCurrentWeather.bind(this);
    this.getCityWeather = this.getCityWeather.bind(this);
    this.getDailySummary = this.getDailySummary.bind(this);
    this.getAllCities = this.getAllCities.bind(this);
  }

  async getCurrentWeather(req: Request, res: Response) {
    try {
      if (!req.user || !req.user._id) {
        throw new Error("User not found");
      }
      const userId = req.user._id as Schema.Types.ObjectId;
      const weatherData = await this.weatherService.getCurrentWeatherByUserId(
        userId
      );
      res.json(weatherData);
    } catch (error: any) {
      if (
        error.message === "User not found" ||
        error.message === "Weather data not found"
      ) {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Error fetching current weather", error });
      }
    }
  }

  async getCityWeather(req: Request, res: Response) {
    try {
      const { cityId } = req.params;
      if (!req.user || !req.user._id) {
        throw new Error("User not found");
      }
      const userId = req.user._id as Schema.Types.ObjectId;
      const weatherData = await this.weatherService.getCityWeather(
        cityId,
        userId
      );
      res.json(weatherData);
    } catch (error: any) {
      if (error.message === "Weather data not found") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error fetching city weather", error });
      }
    }
  }

  async getDailySummary(req: Request, res: Response) {
    try {
      const { cityId } = req.params;
      if (!req.user || !req.user._id) {
        throw new Error("User not found");
      }
      const userId = req.user._id as Schema.Types.ObjectId;
      const summary = await this.weatherService.getDailySummary(cityId, userId);
      res.json(summary);
    } catch (error: any) {
      if (error.message === "Daily summary not found") {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Error fetching daily summary", error });
      }
    }
  }

  async getAllCities(req: Request, res: Response) {
    try {
      const allCities = await this.weatherService.getAllCities();

      res.status(200).json(allCities);
    } catch (error: any) {
      if (error.message === "Daily summary not found") {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Error fetching daily summary", error });
      }
    }
  }
}

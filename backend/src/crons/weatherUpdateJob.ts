import cron from "node-cron";
import { WeatherService } from "../services/weatherService";
import { City } from "../models/City";
import { ObjectId } from "mongoose";

export class WeatherUpdateJob {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
  }

  start() {
    // Run every 5 minutes
    cron.schedule("*/1 * * * *", async () => {
      try {
        const cities = await City.find();

        for (const city of cities) {
          if (!city._id) {
            throw new Error("City not found");
          }
          const cityId = city._id as ObjectId;
          await this.weatherService.fetchWeatherData(cityId);
        }
      } catch (error) {
        console.error("Error updating weather data:", error);
      }
    });
  }
}

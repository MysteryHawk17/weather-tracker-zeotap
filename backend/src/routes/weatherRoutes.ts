import express from "express";
import { WeatherController } from "../controllers/weatherController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
const weatherController = new WeatherController();

router.get("/current", authMiddleware, weatherController.getCurrentWeather);
router.get("/city/:cityId", authMiddleware, weatherController.getCityWeather);
router.get(
  "/daily-summary/:cityId",
  authMiddleware,
  weatherController.getDailySummary
);
router.get("/cities", weatherController.getAllCities);

export default router;

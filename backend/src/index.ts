import express from "express";
import cors from "cors";
import { connectDB } from "./db/connectDB";
import userRoutes from "./routes/userRoutes";
import weatherRoutes from "./routes/weatherRoutes";
import { WeatherUpdateJob } from "./crons/weatherUpdateJob";
import dotenv from "dotenv";
import { QueueWorker } from "./services/redisQueueWorker";

const app = express();
dotenv.config();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/weather", weatherRoutes);

// Start cron job
const weatherUpdateJob = new WeatherUpdateJob();
weatherUpdateJob.start();
const redisWorker = new QueueWorker();
redisWorker.processEmailQueue();
// Connect to database and start server
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

start();

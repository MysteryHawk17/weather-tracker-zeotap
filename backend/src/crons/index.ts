import { WeatherUpdateJob } from "./weatherUpdateJob";

export const initializeCronJobs = () => {
  const weatherUpdateJob = new WeatherUpdateJob();

  weatherUpdateJob.start();
};

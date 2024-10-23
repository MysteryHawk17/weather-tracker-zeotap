import { createClient, RedisClientType } from "redis";
import { IUser, User } from "../models/User";
import convertTemperature from "../convertTemp";
import dotenv from "dotenv";
import { Schema } from "mongoose";
import { Notification } from "../models/Notification";
dotenv.config();
interface EmailNotification {
  userId: string;
  email: string;
  message: string;
}

export class TemperatureNotifier {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD,
    });

    this.client.connect();
  }

  public async notifyUsers(
    currentTemperature: number,
    cityId: Schema.Types.ObjectId
  ): Promise<void> {
    try {
      const users: IUser[] = await User.find();

      users.forEach(async (user) => {
        currentTemperature = convertTemperature(
          user.preferredTemperatureUnit,
          currentTemperature
        );
        if (
          (currentTemperature > user.thresholds.maxTemperature ||
            currentTemperature < user.thresholds.minTemperature) &&
          user.notificationSettings.email &&
          user.notificationContact.email &&
          user.location.toString() === cityId.toString()
        ) {
          const notification: EmailNotification = {
            userId: user.id,
            email: user.notificationContact.email,
            message: `The current temperature is ${currentTemperature}°C, which triggers the threshold.`,
          };
          this.pushNotification(notification);
          const newNotification = new Notification({
            userId: user.id,
            message: notification.message,
            type: "Email",
          });
          await newNotification.save();
        }
      });
    } catch (error) {
      console.error("Error notifying users:", error);
    }
  }

  private async pushNotification(
    notification: EmailNotification
  ): Promise<void> {
    try {
      await this.client.lPush(
        "emailNotification",
        JSON.stringify(notification)
      );
    } catch (error) {
      console.error("Error pushing notification to Redis:", error);
    }
  }

  public async closeConnection(): Promise<void> {
    await this.client.disconnect();
  }
}

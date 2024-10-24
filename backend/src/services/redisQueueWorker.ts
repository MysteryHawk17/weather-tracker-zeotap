import { createClient, RedisClientType } from "redis";

import dotenv from "dotenv";
import { EmailNotifier } from "./emailService";
dotenv.config();

interface EmailNotification {
  email: string;
  message: string;
}

export class QueueWorker {
  private client: RedisClientType;
  private emailService: EmailNotifier;
  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on("connect", () => {
      console.log("Successfully connected to Redis in QueueWorker");
    });

    this.emailService = new EmailNotifier();
    this.processEmailQueue = this.processEmailQueue.bind(this);
    this.client.connect();
  }

  public async processEmailQueue(): Promise<void> {
    try {
      while (true) {
        const emailNotification = await this.client.brPop(
          "emailNotification",
          0
        );

        if (emailNotification) {
          const notificationData = emailNotification.element;

          const notification: EmailNotification = JSON.parse(notificationData);
          console.log(notification);
          await this.emailService.sendEmail({
            message: notification.message,
            email: notification.email,
          });

          console.log(`Email notification sent to ${notification.email}`);
        }
      }
    } catch (error) {
      console.error("Error processing email queue:", error);
    }
  }
}

export default EmailNotifier;

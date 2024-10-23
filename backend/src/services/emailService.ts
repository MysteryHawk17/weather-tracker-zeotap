import { createClient, RedisClientType } from "redis";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
dotenv.config();

interface EmailNotification {
  email: string;
  message: string;
}

export class EmailNotifier {
  private client: RedisClientType;

  private readonly toEmail: string;
  private ses_region: string;
  private ses: SESClient;
  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD, // If authentication is required
    });

    this.client.connect();
    this.toEmail = process.env.EMAIL as string;
    this.ses_region = process.env.SES_REGION as string;
    this.ses = new SESClient({
      region: this.ses_region,
      credentials: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY as string,
        secretAccessKey: process.env.AMAZON_SECRET_KEY as string,
      },
    });
  }

  public async sendEmail(options: EmailNotification) {
    const sendEmailCommand = this.createSendEmailCommand(
      options.email,
      this.toEmail,
      options.message
    );

    try {
      await this.ses.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        const messageRejectedError = caught;
        messageRejectedError;
        return "Message rejected";
      }
      throw caught;
    }
  }
  private createSendEmailCommand = (
    toAddress: string,
    fromAddress: string,
    message: string
  ) => {
    return new SendEmailCommand({
      Destination: {
        /* required */
        ToAddresses: [toAddress],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Text: {
            Charset: "UTF-8",
            Data: message,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "WEATHER UPDATE",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        fromAddress,
        /* more items */
      ],
    });
  };

  // public async processEmailQueue(): Promise<void> {
  //   try {
  //     while (true) {
  //       const emailNotification = await this.client.brPop(
  //         "emailNotification",
  //         0
  //       );

  //       if (emailNotification) {
  //         const notificationData = emailNotification.element;

  //         const notification: EmailNotification = JSON.parse(notificationData);

  //         await this.sendEmail({
  //           message: notification.message,
  //           email: notification.email,
  //         });

  //         console.log(`Email notification sent to ${notification.email}`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error processing email queue:", error);
  //   }
  // }
}

import { Schema, model, Document } from "mongoose";


export interface INotification extends Document {
  userId: Schema.Types.ObjectId;
  alertId: Schema.Types.ObjectId;
  type: "Email" | "SMS";
  message: string;
  sentAt: Date;
}


const NotificationSchema: Schema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    alertId: { type: Schema.Types.ObjectId, ref: "Alert", required: true },
    type: { type: String, enum: ["Email", "SMS"], required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Notification = model<INotification>(
  "Notification",
  NotificationSchema
);

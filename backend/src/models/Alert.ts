import { Schema, model, Document } from "mongoose";


export interface IAlert extends Document {
  userId: Schema.Types.ObjectId;
  city: Schema.Types.ObjectId;
  temperature: number;
  weatherCondition: string;
  alertType: "Temperature" | "WeatherCondition";
  triggeredAt: Date;
  isDismissed: boolean;
}

const AlertSchema: Schema = new Schema<IAlert>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
    temperature: { type: Number },
    weatherCondition: { type: String },
    alertType: {
      type: String,
      enum: ["Temperature", "WeatherCondition"],
      required: true,
    },
    triggeredAt: { type: Date, default: Date.now },
    isDismissed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Alert = model<IAlert>("Alert", AlertSchema);

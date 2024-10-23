import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  location: Schema.Types.ObjectId;
  preferredTemperatureUnit: "Celsius" | "Fahrenheit";
  thresholds: {
    maxTemperature: number;
    minTemperature: number;
    condition: string;
  };
  notificationSettings: {
    email: boolean;
  };
  notificationContact: {
    email: string;
  };
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: Schema.Types.ObjectId, required: true, ref: "City" },
    preferredTemperatureUnit: {
      type: String,
      enum: ["Celsius", "Fahrenheit"],
      default: "Celsius",
    },
    thresholds: {
      maxTemperature: { type: Number, required: true },
      minTemperature: { type: Number, required: true },
      condition: { type: String, required: true },
    },
    notificationSettings: {
      email: { type: Boolean, default: true },
    },
    notificationContact: {
      email: { type: String, required: false },
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);

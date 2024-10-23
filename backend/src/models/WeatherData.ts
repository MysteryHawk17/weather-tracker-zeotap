import { Schema, model, Document } from "mongoose";

export interface IWeatherData extends Document {
  city: Schema.Types.ObjectId;
  temperature: number;
  feelsLike: number;
  pressure: number;
  humidity: number;
  weatherCondition: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  createdAt: Date;
}

const WeatherDataSchema: Schema = new Schema<IWeatherData>({
  city: { type: Schema.Types.ObjectId, ref: "City", required: true },
  temperature: { type: Number, required: true },
  feelsLike: { type: Number, required: true },
  pressure: { type: Number, required: true },
  humidity: { type: Number, required: true },
  weatherCondition: [
    {
      id: { type: Number, required: true },
      main: { type: String, required: true },
      description: { type: String, required: true },
      icon: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const WeatherData = model<IWeatherData>(
  "WeatherData",
  WeatherDataSchema
);

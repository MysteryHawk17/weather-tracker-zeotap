import { Schema, model, Document } from "mongoose";


export interface IDailySummary extends Document {
  city: Schema.Types.ObjectId;
  date: string; 
  averageTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  dominantWeatherCondition: string;
  weatherConditionCount: {
    [condition: string]: number;
  };
}


const DailySummarySchema: Schema = new Schema<IDailySummary>(
  {
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
    date: { type: String, required: true }, 
    averageTemperature: { type: Number, required: true },
    maxTemperature: { type: Number, required: true },
    minTemperature: { type: Number, required: true },
    dominantWeatherCondition: { type: String, required: true },
    weatherConditionCount: { type: Map, of: Number, required: true }, 
  },
  { timestamps: true }
);

export const DailySummary = model<IDailySummary>(
  "DailySummary",
  DailySummarySchema
);

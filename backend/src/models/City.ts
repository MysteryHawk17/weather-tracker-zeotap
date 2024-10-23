import { Schema, model, Document } from "mongoose";

export interface ICity extends Document {
  name: string;
  countryCode: string;
  lat: number;
  lon: number;
}
const CitySchema: Schema = new Schema<ICity>(
  {
    name: { type: String, required: true },
    countryCode: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  { timestamps: true }
);

export const City = model<ICity>("City", CitySchema);

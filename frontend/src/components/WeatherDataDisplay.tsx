import React from "react";
import { Thermometer, Wind, Eye, Droplet, BarChart2 } from "lucide-react";
import { IWeatherData } from "../types/types";
import { useWeather } from "../context/WeatherContext";

const colorScheme = {
  background: "#1E1E2E",
  card: "#2A2A3C",
  accent: "#6E56CF",
  text: "#E0E0E0",
  textSecondary: "#A0A0A0",
  highlight: "#F1C40F",
  error: "#E74C3C",
};

interface WeatherDataDisplayProps {
  cityData: IWeatherData;
}

export default function WeatherDataDisplay({
  cityData,
}: WeatherDataDisplayProps) {
  const { temperatureUnit } = useWeather();
  return cityData ? (
    <div
      className="mb-8 p-6 rounded-lg"
      style={{ backgroundColor: colorScheme.card }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-3xl font-semibold"
          style={{ color: colorScheme.highlight }}
        >
          {`${cityData?.city?.name} (${cityData?.city?.countryCode})`}
        </h2>
        <div
          className="text-6xl font-bold"
          style={{ color: colorScheme.highlight }}
        >
          {`${Math.round(cityData?.temperature ?? 0)}°${temperatureUnit}`}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <WeatherDetail
          icon={<Thermometer className="h-5 w-5" />}
          label="Feels like"
          value={`${Math.round(cityData?.feelsLike ?? 0)}°${temperatureUnit}`}
        />
        <WeatherDetail
          icon={<Thermometer className="h-5 w-5" />}
          label="Condition"
          value={cityData?.weatherCondition?.[0]?.main ?? "N/A"}
        />
        <WeatherDetail
          icon={<Thermometer className="h-5 w-5" />}
          label="Description"
          value={cityData?.weatherCondition?.[0]?.description ?? "N/A"}
        />
        <WeatherDetail
          icon={<Wind className="h-5 w-5" />}
          label="Wind Speed"
          value={`${cityData?.windSpeed ?? 0} m/s`}
        />
        <WeatherDetail
          icon={<Eye className="h-5 w-5" />}
          label="Visibility"
          value={`${cityData?.visibility ?? 0} meters`}
        />
        <WeatherDetail
          icon={<Droplet className="h-5 w-5" />}
          label="Humidity"
          value={`${cityData?.humidity ?? 0}%`}
        />
        <WeatherDetail
          icon={<BarChart2 className="h-5 w-5" />}
          label="Pressure"
          value={`${cityData?.pressure ?? 0} hPa`}
        />
      </div>

      <p className="mt-4 text-sm" style={{ color: colorScheme.textSecondary }}>
        Last updated: {cityData?.createdAt ? new Date(cityData?.createdAt).toLocaleString() : "N/A"}
      </p>
    </div>
  ) : null;
}

function WeatherDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center space-x-2">
      <div style={{ color: colorScheme.accent }}>{icon}</div>
      <div>
        <p className="text-sm" style={{ color: colorScheme.textSecondary }}>
          {label}
        </p>
        <p className="font-semibold" style={{ color: colorScheme.text }}>
          {value}
        </p>
      </div>
    </div>
  );
}

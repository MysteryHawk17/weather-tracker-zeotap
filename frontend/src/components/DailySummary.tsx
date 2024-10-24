import { useWeather } from "../context/WeatherContext";
import { IDailySummary } from "../types/types";

const colorScheme = {
  background: "#1E1E2E",
  card: "#2A2A3C",
  accent: "#6E56CF",
  text: "#E0E0E0",
  textSecondary: "#A0A0A0",
  highlight: "#F1C40F",
  error: "#E74C3C",
};

interface DailySummaryProps {
  dailySummary: IDailySummary[];
}

export default function DailySummary({ dailySummary }: DailySummaryProps) {
  const {temperatureUnit} = useWeather();
  return (
    <div
      className="mb-8 p-6 rounded-lg"
      style={{ backgroundColor: colorScheme.card }}
    >
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: colorScheme.highlight }}
      >
        Daily Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dailySummary.map((data, index) => (
          <div
            key={index}
            className="p-4 rounded-lg"
            style={{ backgroundColor: colorScheme.background }}
          >
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: colorScheme.accent }}
            >
              {data.city.name}
            </h3>
            <p>Avg Temp: {data.averageTemperature.toFixed(1)}°{temperatureUnit}</p>
            <p>Max Temp: {data.maxTemperature.toFixed(1)}°{temperatureUnit}</p>
            <p>Min Temp: {data.minTemperature.toFixed(1)}°{temperatureUnit}</p>
            <p>Dominant Condition: {data.dominantWeatherCondition}</p>
            <div>
              <h4 className="text-lg font-semibold mt-2">
                Weather Conditions:
              </h4>
              <ul>
                {Object.entries(data.weatherConditionCount).map(
                  ([condition]) => (
                    <li key={condition}>{condition}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

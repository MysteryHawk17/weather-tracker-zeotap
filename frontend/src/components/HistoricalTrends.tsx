import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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

interface HistoricalTrendsProps {
  historicalData: IDailySummary[];
  temperatureUnit: string;
}

export default function HistoricalTrends({
  historicalData,
  temperatureUnit,
}: HistoricalTrendsProps) {
  const data = historicalData.map((day) => ({
    ...day,
    avgTemp: day.averageTemperature,
    maxTemp: day.maxTemperature,
    minTemp: day.minTemperature,
  }));

  return (
    <div
      className="mb-8 p-6 rounded-lg"
      style={{ backgroundColor: colorScheme.card }}
    >
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: colorScheme.highlight }}
      >
        Historical Trends
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="avgTemp"
            stroke="#8884d8"
            name={`Avg Temp (°${temperatureUnit})`}
          />
          <Line
            type="monotone"
            dataKey="maxTemp"
            stroke="#82ca9d"
            name={`Max Temp (°${temperatureUnit})`}
          />
          <Line
            type="monotone"
            dataKey="minTemp"
            stroke="#ffc658"
            name={`Min Temp (°${temperatureUnit})`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

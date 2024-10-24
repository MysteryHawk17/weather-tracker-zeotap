import { Mail } from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import LoadingSpinner from "./LoadingSpinner";

const colorScheme = {
  background: "#1E1E2E",
  card: "#2A2A3C",
  accent: "#6E56CF",
  text: "#E0E0E0",
  textSecondary: "#A0A0A0",
  highlight: "#F1C40F",
  error: "#E74C3C",
};

// Define the threshold type to make it reusable
type AlertThreshold = {
  min: number;
  max: number;
};

type NotificationPreferences = {
  email: boolean;
  sms: boolean;
};

interface UserSettingsProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  temperatureUnit: "C" | "F";
  setTemperatureUnit: (unit: "C" | "F") => void;
  alertThreshold: AlertThreshold;
  notificationPreferences: NotificationPreferences;
  setAlertThreshold: (threshold: { min: number; max: number }) => void;
  setNotificationPreferences: (prefs: { email: boolean; sms: boolean }) => void;
}

export default function UserSettings({
  selectedCity,
  setSelectedCity,
  temperatureUnit,
  setTemperatureUnit,
  alertThreshold,
  setAlertThreshold,
  notificationPreferences,
  setNotificationPreferences,
}: UserSettingsProps) {
  const { cities, loading, saveUserSettings } = useWeather();
  if (loading) {
    return <LoadingSpinner />;
  }
  const handleSave = () => {
    saveUserSettings(
      selectedCity,
      temperatureUnit,
      alertThreshold,
      notificationPreferences
    );
  };
  return (
    <div
      className="mb-8 p-6 rounded-lg"
      style={{ backgroundColor: colorScheme.card }}
    >
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: colorScheme.highlight }}
      >
        User Settings
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city-select" className="block mb-2">
            City
          </label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value as string)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            {cities?.map((city) => (
              <option key={city._id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="temp-unit-select" className="block mb-2">
            Temperature Unit
          </label>
          <select
            id="temp-unit-select"
            value={temperatureUnit}
            onChange={(e) => setTemperatureUnit(e.target.value as "C" | "F")}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="C">Celsius</option>
            <option value="F">Fahrenheit</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Alert Thresholds</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={alertThreshold.min}
              onChange={(e) =>
                setAlertThreshold({
                  ...alertThreshold,
                  min: Number(e.target.value),
                })
              }
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
              placeholder="Min"
              aria-label="Minimum temperature threshold"
            />
            <input
              type="number"
              value={alertThreshold.max}
              onChange={(e) =>
                setAlertThreshold({
                  ...alertThreshold,
                  max: Number(e.target.value),
                })
              }
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
              placeholder="Max"
              aria-label="Maximum temperature threshold"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2">Notification Preferences</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationPreferences.email}
                onChange={(e) =>
                  setNotificationPreferences({
                    ...notificationPreferences,
                    email: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <Mail className="h-5 w-5 mr-1" /> Email
            </label>
          </div>
        </div>
      </div>
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 rounded font-semibold text-white"
        style={{ backgroundColor: colorScheme.accent }}
      >
        Save Settings
      </button>
    </div>
  );
}

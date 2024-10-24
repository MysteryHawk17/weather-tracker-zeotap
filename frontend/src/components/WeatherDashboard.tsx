import { LogOut } from "lucide-react";
import UserSettings from "./UserSettings";
import WeatherDataDisplay from "./WeatherDataDisplay";
import DailySummary from "./DailySummary";
import HistoricalTrends from "./HistoricalTrends";


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

export default function Dashboard() {
  const {
    selectedCity,
    setSelectedCity,
    temperatureUnit,
    setTemperatureUnit,
    alertThreshold,
    setAlertThreshold,
    notificationPreferences,
    setNotificationPreferences,
    weatherData,
    dailySummary,
  } = useWeather();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundColor: colorScheme.background,
        color: colorScheme.text,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-4xl font-bold"
            style={{ color: colorScheme.highlight }}
          >
            Weather Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 rounded font-semibold text-white"
            style={{ backgroundColor: colorScheme.accent }}
          >
            <LogOut className="mr-2" size={18} />
            Logout
          </button>
        </div>
        <UserSettings
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          temperatureUnit={temperatureUnit}
          setTemperatureUnit={setTemperatureUnit}
          alertThreshold={alertThreshold}
          setAlertThreshold={setAlertThreshold}
          notificationPreferences={notificationPreferences}
          setNotificationPreferences={setNotificationPreferences}
        />

        <WeatherDataDisplay cityData={weatherData} />

        <DailySummary dailySummary={dailySummary} />

        <HistoricalTrends
          historicalData={dailySummary}
          temperatureUnit={temperatureUnit}
        />
      </div>
    </div>
  );
}

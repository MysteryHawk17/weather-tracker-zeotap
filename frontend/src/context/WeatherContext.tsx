import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

import {
  ICity,
  IDailySummary,
  IWeatherData,
  IRegistrationData,
} from "../types/types";
import axios, { AxiosError } from "axios";
interface WeatherContextType {
  // States
  loading: boolean;
  cities: ICity[];
  weatherData: IWeatherData;
  selectedCity: string;
  temperatureUnit: "C" | "F";
  alertThreshold: { min: number; max: number };
  notificationPreferences: { email: boolean; sms: boolean };
  alerts: string[];
  dailySummary: IDailySummary[];
  historicalData: IDailySummary[];
  isLoading: boolean;
  error: string | null;

  // Functions to update states
  setCities: (cities: ICity[]) => void;
  setLoading: (loading: boolean) => void;
  setWeatherData: (data: IWeatherData) => void;
  setSelectedCity: (city: string) => void;
  setTemperatureUnit: (unit: "C" | "F") => void;
  setAlertThreshold: (threshold: { min: number; max: number }) => void;
  setNotificationPreferences: (prefs: { email: boolean; sms: boolean }) => void;
  addAlert: (alert: string) => void;
  setHistoricalData: (data: IDailySummary[]) => void;
  setDailySummary: (data: IDailySummary[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Additional functions
  fetchWeatherData: () => Promise<void>;
  fetchUserSettings: () => Promise<void>;
  fetchCities: () => Promise<void>;
  saveUserSettings: (
    selectedCity: string,
    temperatureUnit: "C" | "F",
    alertThreshold: { min: number; max: number },
    notificationPreferences: { email: boolean; sms: boolean }
  ) => Promise<void>;

  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (data: IRegistrationData) => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<IWeatherData>(
    {} as IWeatherData
  );

  const [selectedCity, setSelectedCity] = useState<string>("");
  const [temperatureUnit, setTemperatureUnit] = useState<"C" | "F">("C");
  const [alertThreshold, setAlertThreshold] = useState({ min: 10, max: 35 });
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    sms: false,
  });
  const [dailySummary, setDailySummary] = useState<IDailySummary[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [historicalData, setHistoricalData] = useState<IDailySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<ICity[]>([]);

  const addAlert = (alert: string) => {
    setAlerts((prevAlerts) => [...prevAlerts, alert]);
  };

  const saveUserSettings = async (
    selectedCity: string,
    temperatureUnit: "C" | "F",
    alertThreshold: { min: number; max: number },
    notificationPreferences: { email: boolean; sms: boolean }
  ) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const cityId = cities.find((city) => city.name === selectedCity)?._id;
      const updateObject = {
        location: cityId,
        preferredTemperatureUnit:
          temperatureUnit === "C" ? "Celsius" : "Fahrenheit",
        thresholds: {
          maxTemperature: alertThreshold.max,
          minTemperature: alertThreshold.min,
        },
        notificationSettings: notificationPreferences,
      };
      await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/users/preferences`,
        updateObject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUserSettings();
      setIsLoading(false);
      window.location.reload();
    } catch {
      setError("Failed to save user settings. Please try again later.");
    }
  };

  const fetchUserSettings = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setSelectedCity(data.location.name);
      setTemperatureUnit(
        data.preferredTemperatureUnit === "Celsius" ? "C" : "F"
      );
      setAlertThreshold({
        min: data.thresholds.minTemperature,
        max: data.thresholds.maxTemperature,
      });
      setNotificationPreferences(data.notificationSettings);
    } catch {
      setError("Failed to fetch user settings. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCities = async () => {
    setIsLoading(true); // Only set loading if necessary
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/weather/cities`
      );
      setCities(response.data); // Set cities in state
    } catch {
      setError("Failed to fetch cities. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherData = async () => {
    // Ensure cities are loaded before calling this function
    if (cities.length === 0 || !selectedCity) return;

    setIsLoading(true);
    setError(null);

    const cityId = cities.find((city) => city.name === selectedCity)?._id;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/weather/city/${cityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWeatherData(response.data);
    } catch {
      setError("Failed to fetch weather data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDailySummary = async () => {
    // Ensure cities are loaded before calling this function
    if (cities.length === 0 || !selectedCity) return;

    setIsLoading(true);
    setError(null);

    const cityId = cities.find((city) => city.name === selectedCity)?._id;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/weather/daily-summary/${cityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDailySummary(response.data);
    } catch {
      setError("Failed to fetch weather data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/users/login`,
        {
          email,
          password,
        }
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      fetchUserSettings();
      window.history.pushState({}, "", "/dashboard");
      window.location.reload();
    } catch {
      setError("Failed to login. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // const registerUser = async (data: IRegistrationData) => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_BACKEND_API}/users/register`,
  //       data
  //     );
  //     localStorage.setItem("token", response.data.token);
  //     fetchUserSettings();
  //     window.history.pushState({}, "", "/dashboard");
  //     window.location.reload();
  //   } catch (error: { error: { response: { data: string } } }) {
  //     console.error("Error registering user:", error.response.data);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const registerUser = async (data: IRegistrationData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/users/register`,
        data
      );
      localStorage.setItem("token", response.data.token);
      fetchUserSettings();
      window.history.pushState({}, "", "/dashboard");
      window.location.reload();
    } catch (error) {
      // Type assertion to narrow down the error type
      const axiosError = error as AxiosError;

      if (axios.isAxiosError(axiosError) && axiosError.response) {
        console.error("Error registering user:", axiosError.response.data);
      } else {
        console.error("Unknown error occurred:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch cities and user settings on mount
    fetchCities();
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserSettings();
    }
  }, []);

  useEffect(() => {
    // Fetch weather data only after cities have loaded and a city is selected
    if (cities.length > 0 && selectedCity) {
      fetchWeatherData();
      fetchDailySummary();
    }
  }, [selectedCity, temperatureUnit]);

  const value: WeatherContextType = {
    cities,
    loading,
    weatherData,
    dailySummary,
    selectedCity,
    temperatureUnit,
    alertThreshold,
    notificationPreferences,
    alerts,
    historicalData,
    isLoading,
    error,
    setCities,
    setLoading,
    setWeatherData,
    setSelectedCity,
    setDailySummary,
    setTemperatureUnit,
    setAlertThreshold,
    setNotificationPreferences,
    addAlert,
    setHistoricalData,
    setIsLoading,
    setError,
    fetchWeatherData,
    saveUserSettings,
    fetchUserSettings,
    fetchCities,
    loginUser,
    registerUser,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

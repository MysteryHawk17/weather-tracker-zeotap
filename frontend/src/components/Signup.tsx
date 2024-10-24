import React, { useState } from "react";
import { Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWeather } from "../context/WeatherContext";


interface FormData {
  name: string;
  email: string;
  password: string;
  location: string;
  preferredTemperatureUnit: string;
  thresholds: {
    maxTemperature: number;
    minTemperature: number;
    condition: string;
  };
  notificationSettings: {
    email: boolean;
  };
}

// Define the color scheme
const colorScheme = {
  background: "#1E1E2E",
  card: "#2A2A3C",
  accent: "#6E56CF",
  text: "#E0E0E0",
  textSecondary: "#A0A0A0",
  highlight: "#F1C40F",
  error: "#E74C3C",
};

export default function Component() {
  const navigate = useNavigate();
  const { registerUser, cities } = useWeather();
  
  // Individual state variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [preferredTemperatureUnit, setPreferredTemperatureUnit] = useState("Celsius");
  const [maxTemperature, setMaxTemperature] = useState(35);
  const [minTemperature, setMinTemperature] = useState(15);
  const [condition, setCondition] = useState("Sunny");
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the formData object from individual states
    const formData: FormData = {
      name,
      email,
      password,
      location,
      preferredTemperatureUnit,
      thresholds: {
        maxTemperature,
        minTemperature,
        condition,
      },
      notificationSettings: {
        email: emailNotifications,
      },
    };

    registerUser(formData);

    // Reset all states after submission
    setName("");
    setEmail("");
    setPassword("");
    setLocation("");
    setPreferredTemperatureUnit("Celsius");
    setMaxTemperature(35);
    setMinTemperature(15);
    setCondition("Sunny");
    setEmailNotifications(true);
  };

  const toLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: colorScheme.background }}
    >
      <div
        className="w-full max-w-md p-8 rounded-lg"
        style={{ backgroundColor: colorScheme.card }}
      >
        <div className="flex justify-center mb-8">
          <Sun size={48} style={{ color: colorScheme.highlight }} />
        </div>
        <h2
          className="text-3xl font-bold text-center mb-8"
          style={{ color: colorScheme.highlight }}
        >
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
          <select
            value={preferredTemperatureUnit}
            onChange={(e) => setPreferredTemperatureUnit(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white"
          >
            <option value="Celsius">Celsius</option>
            <option value="Fahrenheit">Fahrenheit</option>
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={maxTemperature}
              onChange={(e) => setMaxTemperature(Number(e.target.value))}
              placeholder="Max Temperature"
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
            <input
              type="number"
              value={minTemperature}
              onChange={(e) => setMinTemperature(Number(e.target.value))}
              placeholder="Min Temperature"
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
          </div>
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="Weather Condition"
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              id="emailNotification"
            />
            <label
              htmlFor="emailNotification"
              style={{ color: colorScheme.text }}
            >
              Email Notifications
            </label>
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded font-semibold text-white"
            style={{ backgroundColor: colorScheme.accent }}
          >
            Sign Up
          </button>
        </form>
        <div
          className="flex justify-center gap-3 mt-6"
          style={{ color: colorScheme.textSecondary }}
        >
          <span>Already have an account?</span>
          <button
            onClick={toLogin}
            className="font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            style={{ color: colorScheme.highlight }}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
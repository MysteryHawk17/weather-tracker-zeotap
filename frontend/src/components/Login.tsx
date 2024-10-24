import React, { useState } from "react";
import { Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toSignup = () => {
    navigate("/signup");
  };
  const { loginUser } = useWeather();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser(email, password);
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
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          />
          <button
            type="submit"
            className="w-full p-3 rounded font-semibold text-white"
            style={{ backgroundColor: colorScheme.accent }}
          >
            Log In
          </button>
        </form>
        <div
          className="flex justify-center gap-3 mt-6"
          style={{ color: colorScheme.textSecondary }}
        >
          <span>Don't have an account?</span>
          <button
            onClick={toSignup}
            className="font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            style={{ color: colorScheme.highlight }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import WeatherDashboard from "./components/WeatherDashboard";
import Signup from "./components/Signup";
import LoadingSpinner from "./components/LoadingSpinner";
import { useEffect, useState } from "react";

const colorScheme = {
  background: "#1E1E2E",
  card: "#2A2A3C",
  accent: "#6E56CF",
  text: "#E0E0E0",
  textSecondary: "#A0A0A0",
  highlight: "#F1C40F",
  error: "#E74C3C",
};

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div
        style={{
          backgroundColor: colorScheme.background,
          color: colorScheme.text,
          minHeight: "100vh",
        }}
      >
        <Routes>
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/signup"
            element={token ? <Navigate to="/dashboard" /> : <Signup />}
          />
          <Route
            path="/dashboard"
            element={token ? <WeatherDashboard /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

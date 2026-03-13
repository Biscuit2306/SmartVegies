import React from "react";
import WeatherAlertDashboard from "../../components/weather-alerts/WeatherAlertDashboard";
import "../../styles/farmer-css/weatheralerts.css";

export default function WeatherAlertsPage() {
  return (
    <div className="weather-alerts-page">
      <WeatherAlertDashboard />
    </div>
  );
}
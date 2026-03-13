// ============================================================
// WeatherMetrics.jsx
// Displays current weather metrics and 5-day forecast
// Place at: frontend/src/components/WeatherAlerts/WeatherMetrics.jsx
// ============================================================

import React from "react";

function MetricCard({ icon, label, value, unit, sub }) {
  return (
    <div className="weather-metric-card">
      <div className="metric-icon">{icon}</div>
      <div className="metric-body">
        <span className="metric-label">{label}</span>
        <span className="metric-value">
          {value}
          <span className="metric-unit">{unit}</span>
        </span>
        {sub && <span className="metric-sub">{sub}</span>}
      </div>
    </div>
  );
}

function ForecastDay({ day }) {
  const conditionEmoji = {
    Rain: "🌧️", Drizzle: "🌦️", Thunderstorm: "⛈️",
    Snow: "❄️", Clear: "☀️", Clouds: "☁️", Mist: "🌫️",
  };
  const emoji = conditionEmoji[day.condition] || "🌤️";

  return (
    <div className="forecast-day-card">
      <span className="forecast-date">{day.date}</span>
      <span className="forecast-emoji">{emoji}</span>
      <span className="forecast-condition">{day.condition}</span>
      <div className="forecast-temps">
        <span className="forecast-max">{day.maxTemp}°</span>
        <span className="forecast-min">{day.minTemp}°</span>
      </div>
      {day.rain > 0 && (
        <span className="forecast-rain">💧 {day.rain}mm</span>
      )}
    </div>
  );
}

export default function WeatherMetrics({ weatherData }) {
  const { current, forecast } = weatherData;

  return (
    <div className="weather-metrics-wrapper">
      {/* ── Current Weather Hero ── */}
      <div className="current-weather-hero">
        <div className="current-weather-left">
          <img
            src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
            alt={current.description}
            className="weather-icon-large"
          />
          <div className="current-temp-block">
            <span className="current-temp">{current.temp}°C</span>
            <span className="current-feels">Feels like {current.feelsLike}°C</span>
            <span className="current-desc">{current.description}</span>
          </div>
        </div>
        <div className="current-weather-right">
          <div className="city-name">{current.city}, {current.country}</div>
          <div className="sun-times">
            <span>🌅 {current.sunrise}</span>
            <span>🌇 {current.sunset}</span>
          </div>
        </div>
      </div>

      {/* ── Metrics Grid ── */}
      <div className="metrics-grid">
        <MetricCard icon="💧" label="Humidity" value={current.humidity} unit="%" sub={current.humidity > 85 ? "High — fungal risk" : "Normal"} />
        <MetricCard icon="💨" label="Wind Speed" value={current.wind} unit=" km/h" sub={current.wind > 40 ? "Strong winds" : "Calm"} />
        <MetricCard icon="🌧️" label="Rainfall" value={current.rain} unit="mm/h" sub="Current hour" />
        <MetricCard icon="🌡️" label="Temperature" value={current.temp} unit="°C" sub={current.temp > 38 ? "Heat stress zone" : "Comfortable"} />
      </div>

      {/* ── 5-Day Forecast ── */}
      <div className="forecast-section">
        <h3 className="section-heading">5-Day Forecast</h3>
        <div className="forecast-row">
          {forecast.map((day) => (
            <ForecastDay key={day.date} day={day} />
          ))}
        </div>
      </div>
    </div>
  );
}
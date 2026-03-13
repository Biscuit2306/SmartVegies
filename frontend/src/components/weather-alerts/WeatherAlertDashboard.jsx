// ============================================================
// WeatherAlertDashboard.jsx
// Main weather crop alert dashboard
// Place at: frontend/src/components/WeatherAlerts/WeatherAlertDashboard.jsx
// ============================================================

import React, { useState, useCallback } from "react";
import WeatherMetrics from "./weatherMetrics";
import AlertCard from "./AlertCard";
import CropRiskPanel from "./CropRiskPanel";
import { fetchApproxLocationByIp } from "./locationService";
import {
  CROPS,
  fetchWeatherData,
  fetchWeatherDataByCoords,
  parseWeatherData,
  generateAlerts,
  calculateRiskScore,
  getRiskLabel,
} from "./WeatherAlertLogic";

// ── Paste your OpenWeatherMap API key here ───────────────────
// Get free key at: https://openweathermap.org/api
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "YOUR_API_KEY_HERE";

export default function WeatherAlertDashboard() {
  const [city, setCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [selectedCrops, setSelectedCrops] = useState(["tomato", "wheat"]);
  const [weatherData, setWeatherData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [riskScore, setRiskScore] = useState(0);
  const [activeTab, setActiveTab] = useState("alerts"); // "alerts" | "weather" | "crops"
  const [locating, setLocating] = useState(false);
  const [locationMode, setLocationMode] = useState("none"); // none | gps | ip | city

  const toggleCrop = (cropId) => {
    setSelectedCrops((prev) =>
      prev.includes(cropId) ? prev.filter((c) => c !== cropId) : [...prev, cropId]
    );
  };

  const ensureApiKey = () => {
    if (API_KEY === "YOUR_API_KEY_HERE") {
      setError("⚠️ Please add your OpenWeatherMap API key in frontend/.env as VITE_WEATHER_API_KEY and restart the dev server.");
      return false;
    }
    return true;
  };

  const resetResults = () => {
    setError("");
    setWeatherData(null);
    setAlerts([]);
    setRiskScore(0);
  };

  const loadByCoords = async ({ lat, lon }, sourceLabel) => {
    const { current, forecast } = await fetchWeatherDataByCoords({ lat, lon }, API_KEY);
    const parsed = parseWeatherData(current, forecast);
    const generatedAlerts = generateAlerts(parsed, selectedCrops);
    const score = calculateRiskScore(generatedAlerts);

    setCity(parsed.current.city);
    setCityInput(parsed.current.city);
    setWeatherData(parsed);
    setAlerts(generatedAlerts);
    setRiskScore(score);
    setActiveTab("alerts");
    setLocationMode(sourceLabel);
  };

  const handleSearch = useCallback(async () => {
    const trimmed = cityInput.trim();
    if (!trimmed) return;
    if (selectedCrops.length === 0) {
      setError("Please select at least one crop.");
      return;
    }
    if (!ensureApiKey()) return;

    setLoading(true);
    resetResults();

    try {
      const { current, forecast } = await fetchWeatherData(trimmed, API_KEY);
      const parsed = parseWeatherData(current, forecast);
      const generatedAlerts = generateAlerts(parsed, selectedCrops);
      const score = calculateRiskScore(generatedAlerts);

      setCity(trimmed);
      setWeatherData(parsed);
      setAlerts(generatedAlerts);
      setRiskScore(score);
      setActiveTab("alerts");
      setLocationMode("city");
    } catch (err) {
      setError(err.message || "Failed to fetch weather data. Check city name.");
    } finally {
      setLoading(false);
    }
  }, [cityInput, selectedCrops]);

  const handleUseApproxLocation = useCallback(async () => {
    if (selectedCrops.length === 0) {
      setError("Please select at least one crop.");
      return;
    }
    if (!ensureApiKey()) return;

    setLocating(true);
    setLoading(true);
    resetResults();

    try {
      const approx = await fetchApproxLocationByIp();
      await loadByCoords({ lat: approx.lat, lon: approx.lon }, "ip");
    } catch (err) {
      setError(err?.message || "Failed to detect approximate location.");
    } finally {
      setLocating(false);
      setLoading(false);
    }
  }, [selectedCrops]);

  const handleUseCurrentLocation = useCallback(async () => {
    if (selectedCrops.length === 0) {
      setError("Please select at least one crop.");
      return;
    }
    if (!ensureApiKey()) return;
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setLocating(true);
    setLoading(true);
    resetResults();

    try {
      const getPosition = (options) =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });

      let position;
      try {
        position = await getPosition({
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 300000,
        });
      } catch (firstErr) {
        // Retry once with longer timeout (some devices take longer to resolve)
        position = await getPosition({
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
        });
      }

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      await loadByCoords({ lat, lon }, "gps");
    } catch (err) {
      const code = err?.code;
      if (code === 1) {
        setError("Location permission denied. You can allow access in browser settings or use approximate location / city search.");
      } else if (code === 2 || code === 3) {
        try {   
          // GPS failed or timed out: auto-fallback to approximate IP location
          const approx = await fetchApproxLocationByIp();
          await loadByCoords({ lat: approx.lat, lon: approx.lon }, "ip");
          setError("GPS not available, using approximate location based on network.");
        } catch (ipErr) {
          setError(
            "Location unavailable. Please ensure Windows Location and browser permissions are ON, or search by city."
          );
        }
      } else {
        setError(err?.message || "Failed to use current location.");
      }
    } finally {
      setLocating(false);
      setLoading(false);
    }
  }, [selectedCrops]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const riskInfo = getRiskLabel(riskScore);
  const riskLevelClass = `risk-score-badge--${riskInfo.level}`;
  const locationBadge =
    locationMode === "gps"
      ? { label: "Live GPS", className: "location-mode-badge--gps" }
      : locationMode === "ip"
      ? { label: "Approximate", className: "location-mode-badge--ip" }
      : locationMode === "city"
      ? { label: "City Search", className: "location-mode-badge--city" }
      : null;

  return (
    <div className="weather-dashboard-wrapper">
      {/* ── Page Header ── */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="header-title-row">
            <span className="header-icon">🌦️</span>
            <div>
              <h1 className="dashboard-title">Weather Crop Alerts</h1>
              <p className="dashboard-subtitle">
                Real-time weather intelligence to protect your farm
              </p>
            </div>
          </div>
          {locationBadge && (
            <div className={`location-mode-badge ${locationBadge.className}`}>
              {locationBadge.label}
            </div>
          )}
          {weatherData && (
            <div
              className={`risk-score-badge ${riskLevelClass}`}
            >
              <span className="risk-score-value">{riskScore}</span>
              <span className="risk-score-label">{riskInfo.label}</span>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-body">
        {/* ── Left Panel: Controls ── */}
        <aside className="dashboard-sidebar">
          {/* City Search */}
          <div className="sidebar-section">
            <label className="sidebar-label">Farm Location</label>
            <button
              className="geo-btn"
              onClick={handleUseCurrentLocation}
              disabled={loading || locating}
              type="button"
            >
              {locating ? "Detecting location..." : "Use my current location"}
            </button>
            <p className="geo-hint">
              Location is used only to fetch weather for your farm area.
            </p>

            <button
              className="geo-btn geo-btn--secondary"
              onClick={handleUseApproxLocation}
              disabled={loading || locating}
              type="button"
            >
              Use approximate location (IP)
            </button>

            <div className="search-input-row">
              <input
                type="text"
                className="city-input"
                placeholder="Or search by city (e.g. Pune, Mumbai, Delhi)"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  "Search"
                )}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>

          {/* Crop Selector */}
          <div className="sidebar-section">
            <label className="sidebar-label">
              Your Crops
              <span className="crop-count-badge">{selectedCrops.length} selected</span>
            </label>
            <div className="crop-selector-grid">
              {CROPS.map((crop) => {
                const isSelected = selectedCrops.includes(crop.id);
                return (
                  <button
                    key={crop.id}
                    className={`crop-chip ${isSelected ? "crop-chip-active" : ""}`}
                    onClick={() => toggleCrop(crop.id)}
                  >
                    <span>{crop.emoji}</span>
                    <span>{crop.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Refresh button */}
          {weatherData && (
            <button
              className="refresh-btn"
              onClick={handleSearch}
              disabled={loading}
            >
              🔄 Refresh Data
            </button>
          )}

          {/* Info box */}
          <div className="info-box">
            <p className="info-box-title">💡 How it works</p>
            <ul className="info-box-list">
              <li>Enter your city name</li>
              <li>Select crops you grow</li>
              <li>Get smart alerts & actions</li>
              <li>Data updates every 10 min</li>
            </ul>
          </div>
        </aside>

        {/* ── Right Panel: Results ── */}
        <main className="dashboard-main">
          {!weatherData && !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">🌱</div>
              <h2 className="empty-state-title">Enter your location to get started</h2>
              <p className="empty-state-sub">
                Weather-based crop alerts will appear here — protecting your harvest
                before damage occurs.
              </p>
              <div className="empty-state-features">
                <div className="feature-chip">🌧️ Rain Alerts</div>
                <div className="feature-chip">🌡️ Heat Stress</div>
                <div className="feature-chip">🍄 Fungal Risk</div>
                <div className="feature-chip">💧 Irrigation</div>
                <div className="feature-chip">💨 Wind Warnings</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="loading-animation">
                <div className="loading-circle"></div>
                <div className="loading-circle"></div>
                <div className="loading-circle"></div>
              </div>
              <p className="loading-text">Fetching weather data for {cityInput}…</p>
            </div>
          )}

          {weatherData && (
            <>
              {/* Tabs */}
              <div className="results-tabs">
                <button
                  className={`tab-btn ${activeTab === "alerts" ? "tab-btn-active" : ""}`}
                  onClick={() => setActiveTab("alerts")}
                >
                  🚨 Alerts
                  {alerts.length > 0 && (
                    <span className="tab-count">{alerts.length}</span>
                  )}
                </button>
                <button
                  className={`tab-btn ${activeTab === "weather" ? "tab-btn-active" : ""}`}
                  onClick={() => setActiveTab("weather")}
                >
                  🌤️ Weather
                </button>
                <button
                  className={`tab-btn ${activeTab === "crops" ? "tab-btn-active" : ""}`}
                  onClick={() => setActiveTab("crops")}
                >
                  🌿 Crop Risk
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "alerts" && (
                <div className="alerts-panel">
                  {alerts.length === 0 ? (
                    <div className="no-alerts-state">
                      <div className="no-alerts-icon">✅</div>
                      <h3>All Clear!</h3>
                      <p>
                        No crop alerts for your selected crops in {city}. Weather
                        conditions are currently favorable.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="alerts-summary-bar">
                        <span>{alerts.length} alert{alerts.length > 1 ? "s" : ""} found for {city}</span>
                        <span
                          className={`risk-label-inline risk-label-inline--${riskInfo.level}`}
                        >
                          Farm Risk: {riskInfo.label}
                        </span>
                      </div>
                      <div className="alerts-list">
                        {alerts.map((alert, i) => (
                          <AlertCard key={alert.id} alert={alert} index={i} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "weather" && (
                <WeatherMetrics weatherData={weatherData} />
              )}

              {activeTab === "crops" && (
                <CropRiskPanel alerts={alerts} selectedCrops={selectedCrops} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
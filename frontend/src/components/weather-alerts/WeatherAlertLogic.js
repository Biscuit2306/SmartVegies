// ============================================================
// weatherAlertLogic.js
// Smart crop alert prediction engine
// Place at: frontend/src/components/WeatherAlerts/weatherAlertLogic.js
// ============================================================

export const CROPS = [
  { id: "tomato", name: "Tomato", emoji: "🍅" },
  { id: "wheat", name: "Wheat", emoji: "🌾" },
  { id: "rice", name: "Rice", emoji: "🌾" },
  { id: "potato", name: "Potato", emoji: "🥔" },
  { id: "onion", name: "Onion", emoji: "🧅" },
  { id: "chilli", name: "Chilli", emoji: "🌶️" },
  { id: "corn", name: "Corn", emoji: "🌽" },
  { id: "cabbage", name: "Cabbage", emoji: "🥬" },
];

// Thresholds based on agricultural research
const THRESHOLDS = {
  HEAVY_RAIN_MM: 20,       // mm/day — triggers harvest alert
  MODERATE_RAIN_MM: 10,    // mm/day — triggers drainage alert
  HIGH_TEMP_C: 38,         // °C — triggers heat stress alert
  LOW_TEMP_C: 10,          // °C — triggers frost/cold alert
  HIGH_HUMIDITY: 85,       // % — triggers fungal disease alert
  LOW_HUMIDITY: 30,        // % — triggers irrigation alert
  HIGH_WIND_KPH: 40,       // km/h — triggers structural alert
  HIGH_UV: 8,              // UV index — triggers sunburn alert
};

// Severity levels with colors
export const SEVERITY = {
  CRITICAL: { label: "Critical", color: "#ef4444", bg: "#fef2f2", border: "#fca5a5" },
  HIGH:     { label: "High",     color: "#f97316", bg: "#fff7ed", border: "#fdba74" },
  MEDIUM:   { label: "Medium",   color: "#eab308", bg: "#fefce8", border: "#fde047" },
  LOW:      { label: "Low",      color: "#22c55e", bg: "#f0fdf4", border: "#86efac" },
};

// Per-crop vulnerability config
const CROP_VULNERABILITIES = {
  tomato:  { rainSensitive: true,  heatSensitive: true,  coldSensitive: true,  fungalRisk: true  },
  wheat:   { rainSensitive: false, heatSensitive: false, coldSensitive: false, fungalRisk: true  },
  rice:    { rainSensitive: false, heatSensitive: true,  coldSensitive: true,  fungalRisk: false },
  potato:  { rainSensitive: true,  heatSensitive: false, coldSensitive: true,  fungalRisk: true  },
  onion:   { rainSensitive: true,  heatSensitive: false, coldSensitive: false, fungalRisk: false },
  chilli:  { rainSensitive: false, heatSensitive: true,  coldSensitive: true,  fungalRisk: true  },
  corn:    { rainSensitive: false, heatSensitive: true,  coldSensitive: true,  fungalRisk: false },
  cabbage: { rainSensitive: true,  heatSensitive: false, coldSensitive: false, fungalRisk: true  },
};

// ─── Fetch current weather + 5-day forecast ──────────────────────────────────
export async function fetchWeatherData(city, apiKey) {
  const BASE = "https://api.openweathermap.org/data/2.5";
  const params = `q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  const [currentRes, forecastRes] = await Promise.all([
    fetch(`${BASE}/weather?${params}`),
    fetch(`${BASE}/forecast?${params}`),
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    throw new Error("City not found or invalid API key");
  }

  const current = await currentRes.json();
  const forecast = await forecastRes.json();

  return { current, forecast };
}

export async function fetchWeatherDataByCoords({ lat, lon }, apiKey) {
  const BASE = "https://api.openweathermap.org/data/2.5";
  const params = `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${apiKey}&units=metric`;

  const [currentRes, forecastRes] = await Promise.all([
    fetch(`${BASE}/weather?${params}`),
    fetch(`${BASE}/forecast?${params}`),
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    throw new Error("Unable to fetch weather for current location");
  }

  const current = await currentRes.json();
  const forecast = await forecastRes.json();

  return { current, forecast };
}

// ─── Parse raw API data into clean shape ─────────────────────────────────────
export function parseWeatherData(current, forecast) {
  // Group forecast by day (next 5 days)
  const dailyMap = {};
  forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const key = date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
    if (!dailyMap[key]) {
      dailyMap[key] = {
        date: key,
        timestamp: item.dt,
        temps: [],
        rain: 0,
        humidity: [],
        wind: [],
        conditions: [],
        icons: [],
      };
    }
    dailyMap[key].temps.push(item.main.temp);
    dailyMap[key].rain += (item.rain?.["3h"] || 0);
    dailyMap[key].humidity.push(item.main.humidity);
    dailyMap[key].wind.push(item.wind.speed * 3.6); // m/s → km/h
    dailyMap[key].conditions.push(item.weather[0].main);
    dailyMap[key].icons.push(item.weather[0].icon);
  });

  const days = Object.values(dailyMap).slice(0, 5).map((d) => ({
    date: d.date,
    timestamp: d.timestamp,
    maxTemp: Math.round(Math.max(...d.temps)),
    minTemp: Math.round(Math.min(...d.temps)),
    rain: Math.round(d.rain * 10) / 10,
    humidity: Math.round(d.humidity.reduce((a, b) => a + b, 0) / d.humidity.length),
    wind: Math.round(Math.max(...d.wind)),
    condition: d.conditions[0],
    icon: d.icons[Math.floor(d.icons.length / 2)],
  }));

  return {
    current: {
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      wind: Math.round(current.wind.speed * 3.6),
      rain: current.rain?.["1h"] || 0,
      condition: current.weather[0].main,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      city: current.name,
      country: current.sys.country,
      sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    },
    forecast: days,
  };
}

// ─── Generate smart crop alerts from weather data ────────────────────────────
export function generateAlerts(weatherData, selectedCrops) {
  const alerts = [];
  const { current, forecast } = weatherData;

  // Look at tomorrow's forecast
  const tomorrow = forecast[0] || null;
  const dayAfter = forecast[1] || null;

  selectedCrops.forEach((cropId) => {
    const crop = CROPS.find((c) => c.id === cropId);
    const vuln = CROP_VULNERABILITIES[cropId];
    if (!crop || !vuln) return;

    // ── HEAVY RAIN ALERT ──────────────────────────────────
    if (tomorrow && tomorrow.rain >= THRESHOLDS.HEAVY_RAIN_MM && vuln.rainSensitive) {
      const severityLevel = tomorrow.rain >= 40 ? "CRITICAL" : "HIGH";
      alerts.push({
        id: `${cropId}-heavy-rain`,
        crop,
        severityLevel,
        type: "Heavy Rain",
        icon: "🌧️",
        severity: SEVERITY[severityLevel],
        title: `Heavy Rain Expected — Harvest ${crop.name} Today`,
        description: `${tomorrow.rain}mm of rain forecast for tomorrow. Mature ${crop.name} will suffer cracking, rotting, and fungal infections if left in field.`,
        actions: [
          `Harvest all mature ${crop.name} immediately`,
          "Cover stored produce with waterproof sheets",
          "Clear field drainage channels",
          "Apply copper-based fungicide as preventive measure",
        ],
        timing: "Action required: Today before sunset",
        preventedLoss: "Prevents 40–60% crop loss",
      });
    }

    // ── MODERATE RAIN ALERT ───────────────────────────────
    if (tomorrow && tomorrow.rain >= THRESHOLDS.MODERATE_RAIN_MM && tomorrow.rain < THRESHOLDS.HEAVY_RAIN_MM && vuln.rainSensitive) {
      alerts.push({
        id: `${cropId}-moderate-rain`,
        crop,
        severityLevel: "MEDIUM",
        type: "Moderate Rain",
        icon: "🌦️",
        severity: SEVERITY.MEDIUM,
        title: `Moderate Rain — Check ${crop.name} Drainage`,
        description: `${tomorrow.rain}mm of rain expected. Ensure field drainage is functioning to prevent waterlogging.`,
        actions: [
          "Inspect and clear drainage channels",
          "Reduce irrigation for next 3 days",
          `Check ${crop.name} roots for early rot signs`,
        ],
        timing: "Action required: Tomorrow morning",
        preventedLoss: "Prevents 15–25% crop loss",
      });
    }

    // ── HIGH TEMPERATURE ALERT ────────────────────────────
    if (current.temp >= THRESHOLDS.HIGH_TEMP_C && vuln.heatSensitive) {
      const severityLevel = current.temp >= 42 ? "CRITICAL" : "HIGH";
      alerts.push({
        id: `${cropId}-heat`,
        crop,
        severityLevel,
        type: "Heat Stress",
        icon: "🌡️",
        severity: SEVERITY[severityLevel],
        title: `Heat Stress Alert for ${crop.name}`,
        description: `Current temperature ${current.temp}°C exceeds optimal range. Prolonged heat causes flower drop and yield reduction.`,
        actions: [
          "Irrigate in early morning (5–7 AM) and evening (6–8 PM)",
          "Apply mulch around plant base to retain soil moisture",
          "Use shade nets (30–50%) during peak afternoon hours",
          "Spray potassium nitrate solution to boost heat tolerance",
        ],
        timing: "Action required: Start today",
        preventedLoss: "Prevents 20–35% yield loss",
      });
    }

    // ── COLD / FROST ALERT ────────────────────────────────
    if (tomorrow && tomorrow.minTemp <= THRESHOLDS.LOW_TEMP_C && vuln.coldSensitive) {
      const severityLevel = tomorrow.minTemp <= 5 ? "CRITICAL" : "MEDIUM";
      alerts.push({
        id: `${cropId}-cold`,
        crop,
        severityLevel,
        type: "Cold Stress",
        icon: "🥶",
        severity: SEVERITY[severityLevel],
        title: `Cold Stress Warning for ${crop.name}`,
        description: `Temperature dropping to ${tomorrow.minTemp}°C tomorrow night. Cold damages ${crop.name} cell walls and halts growth.`,
        actions: [
          "Cover young plants with polythene or jute bags overnight",
          "Apply light evening irrigation (acts as frost protection)",
          "Avoid nitrogen fertilizers during cold spell",
          "Remove covers by 8 AM as temperature rises",
        ],
        timing: "Action required: Evening before sunset",
        preventedLoss: "Prevents 25–50% plant damage",
      });
    }

    // ── HIGH HUMIDITY / FUNGAL ALERT ──────────────────────
    if (current.humidity >= THRESHOLDS.HIGH_HUMIDITY && vuln.fungalRisk) {
      const severityLevel = current.humidity >= 92 ? "HIGH" : "MEDIUM";
      alerts.push({
        id: `${cropId}-fungal`,
        crop,
        severityLevel,
        type: "Fungal Risk",
        icon: "🍄",
        severity: SEVERITY[severityLevel],
        title: `Fungal Disease Risk for ${crop.name}`,
        description: `Humidity at ${current.humidity}% creates perfect conditions for blight, mildew, and mold on ${crop.name}.`,
        actions: [
          "Apply Mancozeb (2g/litre) or Copper oxychloride spray",
          "Improve air circulation by pruning dense foliage",
          "Avoid overhead irrigation — switch to drip",
          "Scout field daily for early disease symptoms",
        ],
        timing: "Apply spray within 24 hours",
        preventedLoss: "Prevents 30–70% quality loss",
      });
    }

    // ── LOW HUMIDITY / IRRIGATION ALERT ───────────────────
    if (current.humidity <= THRESHOLDS.LOW_HUMIDITY && vuln.heatSensitive) {
      alerts.push({
        id: `${cropId}-irrigation`,
        crop,
        severityLevel: "MEDIUM",
        type: "Irrigation Needed",
        icon: "💧",
        severity: SEVERITY.MEDIUM,
        title: `Irrigation Required for ${crop.name}`,
        description: `Low humidity (${current.humidity}%) combined with heat causes rapid soil moisture evaporation.`,
        actions: [
          "Irrigate immediately — check soil moisture at 6 inch depth",
          "Switch to drip irrigation to conserve water",
          "Irrigate in short cycles to prevent runoff",
          "Apply mulch layer (3–4 inches) to reduce evaporation",
        ],
        timing: "Irrigate today — early morning preferred",
        preventedLoss: "Prevents wilting and yield drop",
      });
    }

    // ── HIGH WIND ALERT ───────────────────────────────────
    if (tomorrow && tomorrow.wind >= THRESHOLDS.HIGH_WIND_KPH) {
      const severityLevel = tomorrow.wind >= 60 ? "HIGH" : "MEDIUM";
      alerts.push({
        id: `${cropId}-wind`,
        crop,
        severityLevel,
        type: "High Wind",
        icon: "💨",
        severity: SEVERITY[severityLevel],
        title: `High Wind Warning — Secure ${crop.name}`,
        description: `Wind speeds of ${tomorrow.wind} km/h expected. Tall or flowering crops risk physical damage and lodging.`,
        actions: [
          "Install or reinforce bamboo support stakes",
          "Tie climbing varieties firmly",
          "Avoid spraying pesticides tomorrow",
          "Harvest any fully mature produce before wind arrives",
        ],
        timing: "Preparations needed today",
        preventedLoss: "Prevents physical crop damage",
      });
    }
  });

  // Sort: CRITICAL → HIGH → MEDIUM → LOW
  const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  alerts.sort((a, b) => {
    const aKey = Object.keys(SEVERITY).find((k) => SEVERITY[k] === a.severity);
    const bKey = Object.keys(SEVERITY).find((k) => SEVERITY[k] === b.severity);
    return (order[aKey] ?? 4) - (order[bKey] ?? 4);
  });

  return alerts;
}

// ─── Overall farm risk score (0–100) ─────────────────────────────────────────
export function calculateRiskScore(alerts) {
  if (alerts.length === 0) return 0;
  const weights = { CRITICAL: 40, HIGH: 25, MEDIUM: 15, LOW: 5 };
  let score = 0;
  alerts.forEach((alert) => {
    const key = Object.keys(SEVERITY).find((k) => SEVERITY[k] === alert.severity);
    score += weights[key] || 0;
  });
  return Math.min(100, score);
}

export function getRiskLabel(score) {
  if (score >= 70) return { label: "High Risk", level: "high" };
  if (score >= 40) return { label: "Moderate Risk", level: "moderate" };
  if (score >= 15) return { label: "Low Risk", level: "low" };
  return { label: "Safe", level: "safe" };
}
// ============================================================
// CropRiskPanel.jsx
// Shows risk summary table per selected crop
// Place at: frontend/src/components/WeatherAlerts/CropRiskPanel.jsx
// ============================================================

import React from "react";
import { CROPS, SEVERITY } from "./WeatherAlertLogic";

export default function CropRiskPanel({ alerts, selectedCrops }) {
  // Build per-crop summary
  const cropSummaries = selectedCrops.map((cropId) => {
    const crop = CROPS.find((c) => c.id === cropId);
    const cropAlerts = alerts.filter((a) => a.crop.id === cropId);

    let worstSeverity = null;
    let worstSeverityLevel = null;
    const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
    for (const level of severityOrder) {
      if (cropAlerts.some((a) => a.severity === SEVERITY[level])) {
        worstSeverity = SEVERITY[level];
        worstSeverityLevel = level;
        break;
      }
    }

    return {
      crop,
      alertCount: cropAlerts.length,
      worstSeverity,
      worstSeverityLevel,
      types: cropAlerts.map((a) => a.type),
    };
  });

  return (
    <div className="crop-risk-panel">
      <h3 className="section-heading">Crop Risk Summary</h3>
      <div className="crop-risk-grid">
        {cropSummaries.map(({ crop, alertCount, worstSeverity, worstSeverityLevel, types }) => {
          const levelClass = (worstSeverityLevel || "LOW").toLowerCase();
          const cardClass = `crop-risk-card crop-risk-card--${levelClass}`;

          return (
          <div
            key={crop.id}
            className={cardClass}
          >
            <div className="crop-risk-header">
              <span className="crop-emoji-large">{crop.emoji}</span>
              <span className="crop-risk-name">{crop.name}</span>
            </div>

            {alertCount === 0 ? (
              <div className="crop-risk-safe">
                <span className="safe-dot"></span>
                Safe — No alerts
              </div>
            ) : (
              <>
                <div
                  className="crop-risk-level"
                >
                  {worstSeverity?.label}
                </div>
                <div className="crop-risk-count">{alertCount} alert{alertCount > 1 ? "s" : ""}</div>
                <div className="crop-risk-types">
                  {types.map((t, i) => (
                    <span key={i} className="crop-risk-type-tag">{t}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        );
        })}
      </div>
    </div>
  );
}
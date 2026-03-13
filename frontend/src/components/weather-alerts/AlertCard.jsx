// ============================================================
// AlertCard.jsx
// Individual crop alert card with expand/collapse
// Place at: frontend/src/components/WeatherAlerts/AlertCard.jsx
// ============================================================

import React, { useState } from "react";

export default function AlertCard({ alert, index }) {
  const [expanded, setExpanded] = useState(index === 0); // first card open by default

  const severityLevel = (alert.severityLevel || "LOW").toLowerCase();
  const cardClassName = `alert-card alert-card--${severityLevel}`;
  const badgeClassName = `alert-severity-badge alert-severity-badge--${severityLevel}`;
  const lossClassName = `alert-prevented-loss alert-prevented-loss--${severityLevel}`;

  return (
    <div className={cardClassName}>
      {/* ── Card Header ── */}
      <button
        className="alert-card-header"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <div className="alert-header-left">
          <span className="alert-type-icon">{alert.icon}</span>
          <div className="alert-title-block">
            <div className="alert-title-row">
              <span className="alert-crop-badge">
                {alert.crop.emoji} {alert.crop.name}
              </span>
              <span className={badgeClassName}>
                {alert.severity.label}
              </span>
            </div>
            <p className="alert-title">{alert.title}</p>
          </div>
        </div>
        <span className="alert-chevron">{expanded ? "▲" : "▼"}</span>
      </button>

      {/* ── Expanded Details ── */}
      {expanded && (
        <div className="alert-card-body">
          <p className="alert-description">{alert.description}</p>

          <div className="alert-actions-block">
            <h4 className="alert-actions-heading">Recommended Actions</h4>
            <ul className="alert-actions-list">
              {alert.actions.map((action, i) => (
                <li key={i} className="alert-action-item">
                  <span className="action-bullet">✓</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="alert-footer-row">
            <span className="alert-timing">
              ⏰ {alert.timing}
            </span>
            <span className={lossClassName}>
              📈 {alert.preventedLoss}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
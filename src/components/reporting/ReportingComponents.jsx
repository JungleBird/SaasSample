import React from "react";
import "../../styles/Reporting.css";

export const MetricCard = ({ title, value, subtext, trend }) => (
  <div className="metric-card">
    <div className="metric-header">
      <span className="metric-title">{title}</span>
    </div>
    <div className="metric-value">{value}</div>
    {subtext && (
      <div className={`metric-subtext ${trend}`}>
        {trend === "up" ? "▲" : trend === "down" ? "▼" : ""} {subtext}
      </div>
    )}
  </div>
);

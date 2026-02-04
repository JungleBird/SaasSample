import React from "react";
import "../../styles/Dashboard.css";

const DashboardControlsTabMenu = ({
  tabs,
  activeTab,
  setActiveTab,
  children,
}) => {
  return (
    <div className="dashboard-controls">
      <div className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`dash-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
};

export default DashboardControlsTabMenu;

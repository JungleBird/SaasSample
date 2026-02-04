import React, { useState } from "react";
import "../styles/Dashboard.css";

const ContentBlock = ({ title, children, actions, className }) => {
  return (
    <div className={`content-block ${className || ""}`}>
      <div className="block-header">
        <h3>{title}</h3>
        {actions && <div className="block-actions">{actions}</div>}
      </div>
      <div className="block-content">{children}</div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Primary Information");

  const primaryTabs = [
    "Primary Information",
    "Legal Team",
    "Document Management",
    "Firms & Vendors",
    "Transaction Records",
    "Routing Slips",
  ];

  const EditIcon = () => <button className="icon-action-btn">📝</button>;
  const RefreshIcon = () => <button className="icon-action-btn">↻</button>;

  return (
    <main className="dashboard-container">
      <div className="matter-header">
        <div className="matter-id">ADR-000011</div>
        <div className="matter-title">
          <h2>Nupur V. Shah</h2>
          <button className="refresh-btn">↻</button>
        </div>
      </div>

      <div className="dashboard-controls">
        <div className="dashboard-tabs">
          {primaryTabs.map((tab) => (
            <button
              key={tab}
              className={`dash-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <button className="bookmark-btn">🔖</button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === "Primary Information" && (
          <div className="primary-info-grid">
            {/* Main Classification */}
            <ContentBlock
              title="MAIN CLASSIFICATION"
              actions={<RefreshIcon />}
              className="main-classification"
            >
              <div className="info-row">
                <span className="label">TYPE/CATEGORY:</span>
                <span className="value">Administration</span>
              </div>
              <div className="info-row">
                <span className="label">SUB-CATEGORY:</span>
                <span className="value">Documentation</span>
              </div>
              <div className="info-message">No Second Sub-category Found</div>
            </ContentBlock>

            {/* Vitals */}
            <ContentBlock
              title="VITALS"
              actions={<RefreshIcon />}
              className="vitals"
            >
              <div className="vitals-row">
                <span className="label">STATUS:</span>
                <span className="indicator">C</span>
              </div>
              <div className="vitals-row">
                <span className="label">PRIORITY:</span>
                <span className="indicator">C</span>
              </div>
              <div className="vitals-row">
                <span className="label">AREA OF LAW:</span>
                <span className="indicator">C</span>
              </div>
              <div className="vitals-row">
                <span className="label">AMOUNT:</span>
                <span className="indicator">C</span>
              </div>
            </ContentBlock>

            {/* Key Dates (Spans vertical height potentially, but here it's a block) */}
            <ContentBlock
              title="KEY DATES"
              actions={<RefreshIcon />}
              className="key-dates"
            >
              <div className="date-row">
                <span className="label light">DAYS ACTIVE</span>
                <span className="value">125</span>
              </div>
              <div className="date-row highlight">
                <span className="label">Date Opened</span>
                <span className="value">09/01/2016</span>
              </div>
              <div className="date-row">
                <span className="label light">LAST UPDATE</span>
                <span className="value">01/05/2017</span>
              </div>
              <div className="date-row light-text">
                <span className="label">DATE CLOSED</span>
              </div>
              <div className="date-row highlight-blue">
                <span className="label">Duration</span>
              </div>
              <div className="date-row highlight-blue">
                <span className="label">Loss Date</span>
              </div>
              <div className="date-row highlight-blue">
                <span className="label">Date C</span>
              </div>
              <div className="date-row highlight-blue">
                <span className="label">Term Start Date</span>
              </div>
              <div className="date-row highlight-blue">
                <span className="label">Term End Date</span>
              </div>
              <div className="date-row highlight-blue">
                <span className="label">Court Date</span>
              </div>
              <div className="date-row highlight-blue">
                <span className="label">Review Date</span>
              </div>
            </ContentBlock>

            <div className="action-buttons-row">
              <button className="action-btn">Upload Document</button>
              <button className="action-btn">Short-Term Reminders</button>
              <button className="action-btn">Long-Term Reminders</button>
            </div>

            {/* Related Info */}
            <ContentBlock
              title="RELATED INFO"
              actions={<RefreshIcon />}
              className="related-info full-width"
            >
              <div className="related-grid">
                <div className="related-col">
                  <div className="info-row">
                    <span className="label">FED/STATE</span>
                  </div>
                  <div className="info-row">
                    <span className="label">INDEX NO</span>
                  </div>
                </div>
                <div className="related-col">
                  <div className="info-row">
                    <span className="label">REFERENCE NO</span>
                  </div>
                  <div className="info-row">
                    <span className="label">CLAIM NO</span>
                  </div>
                </div>
              </div>
            </ContentBlock>

            {/* Text Records */}
            <ContentBlock
              title="TEXT RECORDS"
              actions={<RefreshIcon />}
              className="text-records full-width"
            >
              <div className="records-header">
                <span>10 MOST RECENT SHOWN</span>
              </div>
              <div className="record-item">
                <div className="record-title blue-text">▼ Description</div>
                <div className="record-date">01/05/2017</div>
              </div>
              <div className="record-details">
                <span className="loading-spinner">C</span>
                <div className="last-update">
                  LAST UPDATE: <br />
                  <strong>01/05/2017</strong> IN-HOUSE:
                </div>
              </div>
            </ContentBlock>
          </div>
        )}

        {activeTab !== "Primary Information" && (
          <div className="placeholder-tab-content">
            <h3>{activeTab}</h3>
            <p>Functionality coming soon...</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;

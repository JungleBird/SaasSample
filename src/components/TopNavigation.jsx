import React from "react";
import "../styles/TopNavigation.css";
import DropDownMenu from "./menuInteractions/DropDownMenu";

const TopNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    "My Doctrac",
    "Matters",
    "Finance",
    "People",
    "Messages",
    "Reporting",
  ];

  return (
    <div className="top-nav-container">
      <div className="app-header">
        <div className="logo-section">
          <h1>Doctrack</h1>
          <span className="subtitle">
            Content Management Solutions for In-House Legal Departments
          </span>
        </div>
        <div className="header-actions">
          {/* Placeholders for icons */}
          <div className="icon-group">
            <button className="icon-btn">i</button>
            <button className="icon-btn orange">✉</button>
            <button className="icon-btn orange">⬇</button>
            <button className="icon-btn orange">☰</button>
          </div>
          <div className="user-actions">
            <span>Last Matter</span>
            <span>Recent Results</span>
            <span>Help & Support</span>
          </div>
        </div>
      </div>
      <nav className="folder-tabs">
        <ul>
          {tabs.map((tab) => {
            const isMatters = tab === "Matters";
            const isPeople = tab === "People";
            const isFinance = tab === "Finance";
            const isMessages = tab === "Messages";

            return (
              <li
                key={tab}
                className={
                  activeTab === tab ||
                  (activeTab && activeTab.startsWith(tab + " - "))
                    ? "active"
                    : ""
                }
              >
                <div className="nav-item-container">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (tab === "People") {
                        setActiveTab("People");
                      } else {
                        setActiveTab(tab);
                      }
                    }}
                  >
                    {tab}
                  </a>
                  {isMatters && (
                    <DropDownMenu
                      items={[
                        {
                          label: "All Matters",
                          onClick: () => setActiveTab("Matters - All"),
                        },
                        {
                          label: "Open Matters",
                          onClick: () => setActiveTab("Matters - Open"),
                        },
                        {
                          label: "Closed Matters",
                          onClick: () => setActiveTab("Matters - Closed"),
                        },
                      ]}
                    />
                  )}
                  {isFinance && (
                    <DropDownMenu
                      items={[
                        {
                          label: "Invoices",
                          onClick: () => setActiveTab("Finance - Invoices"),
                        },
                        {
                          label: "Pending Invoices",
                          onClick: () => setActiveTab("Finance - Pending"),
                        },
                        {
                          label: "Approved Invoices",
                          onClick: () => setActiveTab("Finance - Approved"),
                        },
                        {
                          label: "Rejected Invoices",
                          onClick: () => setActiveTab("Finance - Rejected"),
                        },
                      ]}
                    />
                  )}
                  {isMessages && (
                    <DropDownMenu
                      items={[
                        {
                          label: "All Messages",
                          onClick: () => setActiveTab("Messages - All"),
                        },
                        {
                          label: "Team Messages",
                          onClick: () => setActiveTab("Messages - Team"),
                        },
                        {
                          label: "Invoice Messages",
                          onClick: () => setActiveTab("Messages - Invoice"),
                        },
                        {
                          label: "Matter Messages",
                          onClick: () => setActiveTab("Messages - Matter"),
                        },
                      ]}
                    />
                  )}
                  {isPeople && (
                    <DropDownMenu
                      items={[
                        {
                          label: "In-House",
                          onClick: () => setActiveTab("People - In-House"),
                        },
                        {
                          label: "Firms",
                          onClick: () => setActiveTab("People - Firms"),
                        },
                        {
                          label: "Vendors",
                          onClick: () => setActiveTab("People - Vendors"),
                        },
                        {
                          label: "Individuals",
                          onClick: () => setActiveTab("People - Individuals"),
                        },
                      ]}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="logout-section">
          <div className="search-bar">
            Quick Find: <input type="text" /> <button>FIND</button>
          </div>
          <a href="#" className="logout-link">
            Log-Out
          </a>
        </div>
      </nav>
    </div>
  );
};

export default TopNavigation;

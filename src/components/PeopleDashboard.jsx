import React, { useState, useEffect } from "react";
import PeopleVendors from "./PeopleVendors";
import PeopleFirms from "./PeopleFirms";
import PeopleIndividuals from "./PeopleIndividuals";
import PeopleInHouse from "./PeopleInHouse";
import AccordionMenu from "./MenuInteractions/AccordionMenu";
import DashboardControlsTabMenu from "./menuInteractions/DashboardControlsTabMenu";
import "../styles/Dashboard.css";

const PeopleDashboard = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState("All Parties");

  useEffect(() => {
    if (initialTab) {
      // Map Layout/Nav tab names to internal tabs if necessary
      if (initialTab === "People - Vendors") {
        setActiveTab("Vendors");
      } else if (initialTab === "People - Firms") {
        setActiveTab("Firms");
      } else if (initialTab === "People - Individuals") {
        setActiveTab("Individuals");
      } else if (initialTab === "People - In-House") {
        setActiveTab("In-House");
      } else {
        setActiveTab("All Parties");
      }
    }
  }, [initialTab]);

  const tabs = ["All Parties", "In-House", "Firms", "Vendors", "Individuals"];

  const allPartiesItems = [
    {
      id: "In-House",
      title: "In-House Legal Team",
      content: <PeopleInHouse />,
    },
    {
      id: "Firms",
      title: "Law Firms",
      content: <PeopleFirms />,
    },
    {
      id: "Vendors",
      title: "Vendors",
      content: <PeopleVendors />,
    },
    {
      id: "Individuals",
      title: "Individuals",
      content: <PeopleIndividuals />,
    },
  ];

  return (
    <main className="dashboard-container">
      <div className="section-header">
        <h2>PEOPLE</h2>
      </div>
      <DashboardControlsTabMenu
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="dashboard-content">
        <div style={{ width: "100%" }}>
          {activeTab === "All Parties" && (
            <div className="dashboard-content-container">
              <div className="dashboard-content-section">
                <div className="section-header">
                  <h3>All Parties</h3>
                </div>
                <AccordionMenu
                  items={allPartiesItems}
                  defaultOpen="Firms"
                  className="dashboard-accordion"
                />
              </div>
            </div>
          )}

          {activeTab === "In-House" && (
            <div className="in-house-view">
              <PeopleInHouse />
            </div>
          )}

          {activeTab === "Firms" && (
            <div className="firms-view">
              <PeopleFirms />
            </div>
          )}

          {activeTab === "Vendors" && (
            <div className="vendors-view">
              <PeopleVendors />
            </div>
          )}

          {activeTab === "Individuals" && (
            <div className="individuals-view">
              <PeopleIndividuals />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PeopleDashboard;

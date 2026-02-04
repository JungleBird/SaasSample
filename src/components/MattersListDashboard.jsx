import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import DashboardControlsTabMenu from "./menuInteractions/DashboardControlsTabMenu";
import { matters } from "../data/matters/matters";
import ContentTable from "./displayElements/ContentTable";
import useMatterAmounts from "./dataWarehouse/useMatterAmounts";

const MattersListDashboard = ({ onSelectMatter, initialTab }) => {
  const [activeTab, setActiveTab] = useState("All Matters");

  useEffect(() => {
    if (initialTab) {
      if (initialTab === "Matters - Closed") {
        setActiveTab("Closed Matters");
      } else if (initialTab === "Matters - Open") {
        setActiveTab("Open Matters");
      } else {
        setActiveTab("All Matters");
      }
    }
  }, [initialTab]);

  const tabs = ["All Matters", "Open Matters", "Closed Matters"];

  const filteredMatters = matters.filter((matter) => {
    if (activeTab === "Open Matters") return matter.status === "Open";
    if (activeTab === "Closed Matters") return matter.status === "Closed";
    return true; // All Matters
  });

  // Calculate amounts for all matters
  const matterAmounts = useMatterAmounts(filteredMatters);

  // Format currency helper
  const formatCurrency = (amount) => {
    const val = Number(amount || 0);
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " USD";
  };

  // Enhance matters data with calculated amounts
  const mattersWithAmounts = filteredMatters.map((matter) => ({
    ...matter,
    amount: formatCurrency(matterAmounts[matter.id] || 0),
  }));

  const columns = [
    {
      key: "name",
      header: "MATTER NAME",
      type: "matter-link",
      onClick: (matter) => onSelectMatter(matter),
    },
    { key: "id", header: "MATTER ID" },
    { key: "client", header: "CLIENT" },
    { key: "areaOfLaw", header: "AREA OF LAW" },
    { key: "amount", header: "AMOUNT", align: "right", className: "amount-column" },
    { key: "status", header: "STATUS", type: "status" },
  ];

  return (
    <main className="dashboard-container">
      <div className="section-header">
        <h2>MATTERS</h2>
      </div>
      <DashboardControlsTabMenu
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="dashboard-content-container">
        <div className="dashboard-content-section">
          <div style={{ width: "100%" }}>
            <div className="invoice-list-container">
              <div className="section-header">
                <h3>{activeTab}</h3>
              </div>
              <ContentTable
                columns={columns}
                data={mattersWithAmounts}
                emptyMessage="No matters found."
                striped
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MattersListDashboard;

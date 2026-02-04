import React, { useState } from "react";
import TopNavigation from "./TopNavigation";
import HomeDashboard from "./HomeDashboard";
import MattersDashboard from "./MattersDashboard";
import MattersListDashboard from "./MattersListDashboard";
import FinanceDashboard from "./FinanceDashboard";
import MessagesDashboard from "./MessagesDashboard";
import PeopleDashboard from "./PeopleDashboard";
import ReportingDashboard from "./reporting/ReportingDashboard";
import "../styles/Layout.css";

const Layout = () => {
  const [activeTab, setActiveTab] = useState("Matters");
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedInvoice(null);
    setSelectedMatter(null);
  };

  const onSelectMatter = (matter) => {
    setSelectedMatter(matter);
    setSelectedInvoice(null);
    setActiveTab("Matters");
  };

  const onSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setSelectedMatter(null);
    setActiveTab("Finance");
  };

  const handleClearInvoice = () => {
    setSelectedInvoice(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "My Lawtrac":
        return <HomeDashboard />;
      case "Matters":
      case "Matters - All":
      case "Matters - Open":
      case "Matters - Closed":
        if (selectedMatter) {
          return (
            <MattersDashboard
              matter={selectedMatter}
              onSelectInvoice={onSelectInvoice}
              selectedInvoice={selectedInvoice}
              onBack={handleClearInvoice}
            />
          );
        }
        return (
          <MattersListDashboard
            onSelectMatter={onSelectMatter}
            initialTab={activeTab}
          />
        );
      case "Finance":
      case "Finance - Invoices":
      case "Finance - Pending":
      case "Finance - Approved":
      case "Finance - Rejected":
        return (
          <FinanceDashboard
            initialTab={activeTab}
            onSelectInvoice={onSelectInvoice}
            selectedInvoice={selectedInvoice}
            onSelectMatter={onSelectMatter}
            selectedMatter={selectedMatter}
            onBack={handleClearInvoice}
          />
        );
      case "Matters - Metrics":
        return (
          <div
            className="dashboard-container"
            style={{ padding: "50px", textAlign: "center" }}
          >
            <h2>Matter Metrics</h2>
            <p>This module is planning to be built later.</p>
          </div>
        );
      case "Messages":
      case "Messages - All":
      case "Messages - Team":
      case "Messages - Invoice":
      case "Messages - Matter":
        return (
          <MessagesDashboard
            initialTab={activeTab}
            onSelectMatter={onSelectMatter}
            selectedMatter={selectedMatter}
            onSelectInvoice={onSelectInvoice}
            selectedInvoice={selectedInvoice}
            onBack={handleClearInvoice}
          />
        );
      case "People":
      case "People - Vendors":
      case "People - Firms":
      case "People - Individuals":
      case "People - In-House":
        return <PeopleDashboard initialTab={activeTab} />;
      case "Reporting":
        return <ReportingDashboard />;
      default:
        return (
          <div
            className="dashboard-container"
            style={{ padding: "50px", textAlign: "center" }}
          >
            <h2>{activeTab}</h2>
            <p>This module is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="layout-container">
      <TopNavigation activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="main-body">{renderContent()}</div>
    </div>
  );
};

export default Layout;

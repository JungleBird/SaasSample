import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import DashboardControlsTabMenu from "./menuInteractions/DashboardControlsTabMenu";
import { invoices } from "../data/invoices/invoices";
import { entities } from "../data/people/entities";
import { matters } from "../data/matters/matters";
import MattersDashboard from "./MattersDashboard";
import InvoiceDetail from "./InvoiceDetail";
import ContentTable from "./displayElements/ContentTable";

const FinanceDashboard = ({
  initialTab,
  onSelectInvoice,
  selectedInvoice,
  onSelectMatter,
  selectedMatter,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState("Invoice List");

  useEffect(() => {
    if (initialTab) {
      if (initialTab === "Finance - Invoices") {
        setActiveTab("Invoice List");
      } else if (initialTab === "Finance - Pending") {
        setActiveTab("Pending Invoices");
      } else if (initialTab === "Finance - Approved") {
        setActiveTab("Approved Invoices");
      } else if (initialTab === "Finance - Rejected") {
        setActiveTab("Rejected Invoices");
      } else {
        setActiveTab("Invoice List");
      }
    }
  }, [initialTab]);

  const tabs = [
    "Invoice List",
    "Pending Invoices",
    "Approved Invoices",
    "Rejected Invoices",
  ];

  // Helper to extract matter ID from matter string (e.g., "CON-000793 Paperworks Inc. v. Ashworthy" -> "CON-000793")
  const getMatterIdFromString = (matterString) => {
    if (!matterString || matterString === "N/A") return null;
    const match = matterString.match(/^([A-Z]+-\d+)/);
    return match ? match[1] : null;
  };

  const handleMatterClick = (invoice) => {
    const matterId = getMatterIdFromString(invoice.matterDisplay);
    if (matterId && onSelectMatter) {
      const matterObj = matters.find((m) => m.id === matterId);
      if (matterObj) {
        onSelectMatter(matterObj);
      }
    }
  };

  const filteredInvoices = invoices
    .filter((inv) => {
      if (activeTab === "Invoice List") return true;
      if (activeTab === "Pending Invoices") return inv.status === "Pending";
      if (activeTab === "Approved Invoices") return inv.status === "Approved";
      if (activeTab === "Rejected Invoices") return inv.status === "Rejected";
      return true;
    })
    .map((inv) => ({
      ...inv,
      firmName: entities.find((e) => e.id === inv.entityId)?.name || inv.firm,
      matterDisplay: inv.matters && inv.matters[0] ? inv.matters[0] : "N/A",
    }));

  const columns = [
    {
      key: "id",
      header: "INVOICE NO.",
      type: "invoice-link",
      onClick: (inv) => onSelectInvoice && onSelectInvoice(inv),
      width: "15%",
      canSort: true 
    },
    { key: "firmName", header: "FIRM / COMPANY", width: "25%", canSort: true },
    { key: "date", header: "INVOICE DATE", width: "12%" },
    { key: "matterDisplay", header: "MATTER", type: "matter-link", onClick: handleMatterClick, width: "28%", canSort: true },
    { key: "amount", header: "AMOUNT", align: "left", className: "amount-column", width: "12%" },
    { key: "status", header: "STATUS", type: "status", width: "8%" },
  ];

  // If an invoice is selected, render the detail view
  if (selectedMatter) {
    return <MattersDashboard matter={selectedMatter} />;
  }

  if (selectedInvoice) {
    return (
      <InvoiceDetail
        invoice={selectedInvoice}
        onSelectMatter={onSelectMatter}
        onBack={onBack}
      />
    );
  }

  return (
    <main className="dashboard-container">
      <div className="section-header">
        <h2>FINANCE</h2>
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
                data={filteredInvoices}
                emptyMessage="No invoices found."
                striped
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FinanceDashboard;

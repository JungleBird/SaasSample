import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import DashboardControlsTabMenu from "./menuInteractions/DashboardControlsTabMenu";
import { textRecords } from "../data/messages/textRecords";
import { employees } from "../data/people/employees";
import { matters } from "../data/matters/matters";
import { invoices } from "../data/invoices/invoices";
import ContentTable from "./displayElements/ContentTable";
import ExpandedRowMessageBody from "./displayElements/ExpandedRowMessageBody";
import MattersDashboard from "./MattersDashboard";
import InvoiceDetail from "./InvoiceDetail";

const MessagesDashboard = ({ initialTab, onSelectMatter, selectedMatter, onSelectInvoice, selectedInvoice, onBack }) => {
  const [activeTab, setActiveTab] = useState("All Messages");

  useEffect(() => {
    if (initialTab) {
      if (initialTab === "Messages - All") {
        setActiveTab("All Messages");
      } else if (initialTab === "Messages - Team") {
        setActiveTab("Team Messages");
      } else if (initialTab === "Messages - Invoice") {
        setActiveTab("Invoice Messages");
      } else if (initialTab === "Messages - Matter") {
        setActiveTab("Matter Messages");
      } else {
        setActiveTab("All Messages");
      }
    }
  }, [initialTab]);

  const tabs = [
    "All Messages",
    "Team Messages",
    "Invoice Messages",
    "Matter Messages",
  ];

  // Helper to get recipient name from employeeId
  const getRecipientName = (recipientId) => {
    if (!recipientId) return "-";
    const employee = employees.find((e) => e.id === recipientId);
    return employee ? employee.name : "-";
  };

  // Handle matter link click
  const handleMatterClick = (record) => {
    if (record.matterId && onSelectMatter) {
      const matterObj = matters.find((m) => m.id === record.matterId);
      if (matterObj) {
        onSelectMatter(matterObj);
      }
    }
  };

  // Handle invoice link click
  const handleInvoiceClick = (record) => {
    if (record.invoiceId && onSelectInvoice) {
      const invoiceObj = invoices.find((inv) => inv.id === record.invoiceId);
      if (invoiceObj) {
        onSelectInvoice(invoiceObj);
      }
    }
  };

  const filteredMessages = textRecords
    .filter((record) => {
      switch (activeTab) {
        case "All Messages":
          return true;
        case "Team Messages":
          return record.matterId === null && record.invoiceId === null;
        case "Invoice Messages":
          return record.invoiceId !== null;
        case "Matter Messages":
          return record.matterId !== null;
        default:
          return true;
      }
    })
    .map((record) => ({
      ...record,
      recipientName: getRecipientName(record.recipientId),
    }));

  const columns = [
    { key: "date", header: "DATE", width: "12%", canSort: true },
    { key: "subject", header: "SUBJECT", width: "22%", expandable: true, className: "expandable-link", canSort: true },
    { key: "employeeName", header: "FROM", width: "18%", canSort: true },
    { key: "employeeType", header: "TYPE", width: "12%", canSort: true },
    { key: "matterId", header: "MATTER", width: "18%", type: "matter-link", onClick: handleMatterClick, color: "#008fa1", fontWeight: "bold" },
    { key: "invoiceId", header: "INVOICE", width: "18%", type: "invoice-link", onClick: handleInvoiceClick },
  ];

  // Render the expanded content for a message row
  const renderExpandedContent = (item) => (
    <ExpandedRowMessageBody item={item} />
  );

  // If a matter is selected, render the MattersDashboard
  if (selectedMatter) {
    return <MattersDashboard matter={selectedMatter} onBack={onBack} />;
  }

  // If an invoice is selected, render the InvoiceDetail
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
        <h2>MESSAGES</h2>
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
                data={filteredMessages}
                emptyMessage="No messages found."
                striped
                renderExpandedContent={renderExpandedContent}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MessagesDashboard;

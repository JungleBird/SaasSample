import React, { useState } from "react";
import "../styles/Dashboard.css";
import "../styles/Invoices.css";
import { matters } from "../data/matters/matters";
import { entities } from "../data/people/entities";
import { lineItemsData } from "../data/invoices/lineItems";
import { textRecords } from "../data/messages/textRecords";
import useInvoiceAmounts from "./dataWarehouse/useInvoiceAmounts";
import ContentTable from "./displayElements/ContentTable";

const InvoiceDetail = ({ invoice, onSelectMatter, onBack }) => {
  const [activeBottomTab, setActiveBottomTab] = useState("Line Items");
  const [activeMiddleTab, setActiveMiddleTab] = useState("Current Totals");
  const [activeTopTab, setActiveTopTab] = useState("Contact");

  if (!invoice) return null;

  const entity = entities.find((e) => e.id === invoice.entityId);

  const {
    fullLineItems,
    calculatedFees,
    calculatedDisbursements,
    totalCalculatedAmount,
    adjustmentAmount,
  } = useInvoiceAmounts(invoice, lineItemsData);

  // Formatting helper
  const formatCurrency = (amount) => {
    const val = Number(amount || 0);
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Extract matter ID from matter string (e.g., "CON-000793 Paperworks Inc. v. Ashworthy" -> "CON-000793")
  const getMatterIdFromString = (matterString) => {
    const match = matterString.match(/^([A-Z]+-\d+)/);
    return match ? match[1] : null;
  };

  const handleMatterClick = (matterString) => (e) => {
    e.preventDefault();
    const matterId = getMatterIdFromString(matterString);
    if (matterId && onSelectMatter) {
      // Find the actual matter object
      const matterObj = matters.find((m) => m.id === matterId);
      if (matterObj) {
        onSelectMatter(matterObj);
      }
    }
  };

  return (
    <main className="dashboard-container">
      <div className="section-header">
        <h2>FINANCE</h2>
      </div>
      <div className="dashboard-content-container">
        <div className="dashboard-content-section">
          <div className="invoice-detail-section">
            {/* Header Bar */}
            <div>
              <div className="invoice-header-info">
                <div className="section-header" style={{ padding: 0 }}>
                  <h3>DETAILED INVOICE: {invoice.id}</h3>
                </div>
                <span
                  style={{ color: "#008fa1", cursor: "pointer" }}
                  onClick={onBack}
                >
                  ↩ BACK TO LIST
                </span>
              </div>
              <div 
                className="invoice-header-bar"
                style={{
                  backgroundColor: 
                    invoice.status === "Pending" ? "#ff9800" :
                    invoice.status === "Rejected" ? "#db0f00" :
                    invoice.status === "Approved" ? "#4caf50" :
                    "#ff9800"
                }}
              >
                <span>{invoice.status}</span>
              </div>
            </div>

            {/* Top Section */}
            <div className="invoice-section-grid">
              {/* Received From */}
              <div className="detail-box box-received">
                <div className="detail-box-header">RECEIVED FROM</div>
                <div className="detail-box-content">
                  <strong>{entity ? entity.name : invoice.firm}</strong>
                  <div className="address-block">
                    <span className="address-line">
                      {entity ? entity.location : "521 Profit Dr"}
                    </span>
                    {!entity && (
                      <>
                        <span className="address-line">Suite 223</span>
                        <span className="address-line">Masherly 78766</span>
                      </>
                    )}
                    <span className="address-line">United States</span>
                  </div>
                </div>
              </div>

              {/* Contact / Tools Tabs */}
              <div className="detail-box box-contact">
                <div className="tabbed-box-header">
                  <button
                    className={`detail-tab ${activeTopTab === "Contact" ? "active" : ""}`}
                    onClick={() => setActiveTopTab("Contact")}
                  >
                    Contact
                  </button>
                  <button
                    className={`detail-tab ${activeTopTab === "Tools" ? "active" : ""}`}
                    onClick={() => setActiveTopTab("Tools")}
                  >
                    Tools
                  </button>
                </div>
                <div className="detail-box-content">
                  {activeTopTab === "Contact" ? (
                    <>
                      <div className="summary-row">
                        <span className="summary-label">PHONE:</span>
                        <span className="summary-value">
                          {entity ? entity.phone : "455-966-6652"}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">FEDERAL ID:</span>
                        <span className="summary-value">123456789</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">GL NO:</span>
                        <span className="summary-value">321</span>
                      </div>
                    </>
                  ) : (
                    <p>Tools content...</p>
                  )}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="detail-box box-summary">
                <div className="detail-box-header">Transaction Amounts</div>

                <div className="detail-box-content">
                  <div className="summary-row">
                    <span className="summary-label">TOTAL AMOUNT:</span>
                    <span
                      className="summary-value"
                      style={{ fontSize: "16px" }}
                    >
                      {invoice.amount}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">
                      TOTAL LINE ITEM AMOUNT:
                    </span>
                    <span
                      className="summary-value"
                      style={{ fontSize: "16px" }}
                    >
                      {formatCurrency(totalCalculatedAmount)}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">
                      TOTAL ADJUSTMENT AMOUNT:
                    </span>
                    <span
                      className="summary-value"
                      style={{ fontSize: "16px" }}
                    >
                      {formatCurrency(adjustmentAmount)}
                    </span>
                  </div>

                  <div
                    style={{ margin: "15px 0", borderTop: "1px solid #ddd" }}
                  ></div>

                  <div className="summary-row">
                    <span className="summary-label">INVOICE DATE:</span>
                    <span className="summary-value">{invoice.date}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">DATE RECEIVED:</span>
                    <span className="summary-value">{invoice.date}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">APPROVED:</span>
                    <span className="summary-value">
                      {invoice.status === "Approved" ? invoice.approvedDate || "-" : "-"}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">REJECTED:</span>
                    <span className="summary-value">
                      {invoice.status === "Rejected" ? invoice.rejectedDate || "-" : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section */}
            <div className="invoice-section-grid middle">
              {/* Matter Records */}
              <div className="detail-box box-matters">
                <div className="detail-box-header">
                  MATTER RECORDS ON INVOICE
                </div>
                <div className="detail-box-content" style={{ padding: "0" }}>
                  {invoice.matters &&
                    invoice.matters.map((matter, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "10px",
                          borderBottom:
                            idx < invoice.matters.length - 1
                              ? "1px solid #eee"
                              : "none",
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#008fa1",
                          fontWeight: "bold",
                        }}
                      >
                        <a
                          href="#"
                          className="invoice-link"
                          onClick={handleMatterClick(matter)}
                        >
                          {matter.length > 35
                            ? `${matter.substring(0, 35)}...`
                            : matter}
                        </a>
                      </div>
                    ))}
                </div>
              </div>

              {/* Approval Chain */}
              <div className="detail-box box-approval">
                <div className="detail-box-header">APPROVAL CHAIN</div>
                <div className="detail-box-content">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                    }}
                  >
                    <span>1. DocTrack Training</span>
                    <span style={{ color: "red" }}>
                      {invoice.status === "Rejected" ? "Rejected" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Totals Tabs */}
              <div className="detail-box box-totals">
                <div className="tabbed-box-header">
                  <button
                    className={`detail-tab ${activeMiddleTab === "Current Totals" ? "active" : ""}`}
                    onClick={() => setActiveMiddleTab("Current Totals")}
                  >
                    Current Totals
                  </button>
                  <button
                    className={`detail-tab ${activeMiddleTab === "Original Amts" ? "active" : ""}`}
                    onClick={() => setActiveMiddleTab("Original Amts")}
                  >
                    Original Amts
                  </button>
                </div>
                <div className="detail-box-content">
                  {activeMiddleTab === "Current Totals" ? (
                    <>
                      <div className="summary-row">
                        <span
                          className="summary-label"
                          style={{ color: "#666" }}
                        >
                          FEES
                        </span>
                        <span className="summary-value">
                          {formatCurrency(calculatedFees)}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span
                          className="summary-label"
                          style={{ color: "#666" }}
                        >
                          DISBURSEMENTS
                        </span>
                        <span className="summary-value">
                          {formatCurrency(calculatedDisbursements)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="summary-row">
                        <span
                          className="summary-label"
                          style={{ color: "#666" }}
                        >
                          ORIGINAL TOTAL
                        </span>
                        <span className="summary-value">
                          {invoice.originalAmount
                            ? invoice.originalAmount
                            : invoice.amount}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section - Line Items */}
            <div className="line-items-section">
              <div
                className="tabbed-box-header"
              >
                <button
                  className={`detail-tab ${activeBottomTab === "Line Items" ? "active" : ""}`}
                  onClick={() => setActiveBottomTab("Line Items")}
                >
                  Line Items
                </button>
                <button
                  className={`detail-tab ${activeBottomTab === "Documents" ? "active" : ""}`}
                  onClick={() => setActiveBottomTab("Documents")}
                >
                  Documents
                </button>
              </div>

              <div style={{ padding: "0" }}>
                {activeBottomTab === "Line Items" && (() => {
                  const lineItemsForTable = fullLineItems.map((item, idx) => ({
                    ...item,
                    displayDate: invoice.date,
                    unit: "1.00",
                    unitCost: formatCurrency(item.rate),
                    amount: formatCurrency(item.rate),
                    _idx: idx,
                  }));

                  const lineItemColumns = [
                    { key: "displayDate", header: "DATE" },
                    { key: "name", header: "NAME", color: "#008fa1", fontWeight: "bold" },
                    { key: "unit", header: "UNIT" },
                    { key: "unitCost", header: "UNIT COST" },
                    { key: "type", header: "TYPE" },
                    { key: "amount", header: "AMOUNT", align: "right", fontWeight: "bold" },
                  ];

                  return (
                    <ContentTable
                      columns={lineItemColumns}
                      data={lineItemsForTable}
                      keyField="_idx"
                      striped
                      emptyMessage="No line items found."
                      tableStyle={{ marginTop: "0", borderTop: "none" }}
                      headerStyle={{ backgroundColor: "#ddd" }}
                    />
                  );
                })()}
                {activeBottomTab === "Documents" && (() => {
                  const invoiceTextRecords = textRecords.filter(
                    (record) => record.invoiceId === invoice.id
                  );

                  const documentsColumns = [
                    { key: "subject", header: "SUBJECT", width: "40%" },
                    { key: "employeeName", header: "FROM", width: "25%" },
                    { key: "employeeType", header: "TYPE", width: "20%" },
                    { key: "date", header: "DATE", width: "15%" },
                  ];

                  return (
                    <ContentTable
                      columns={documentsColumns}
                      data={invoiceTextRecords}
                      keyField="id"
                      striped
                      emptyMessage="No text records found for this invoice."
                      tableStyle={{ marginTop: "0", borderTop: "none" }}
                      headerStyle={{ backgroundColor: "#ddd" }}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InvoiceDetail;

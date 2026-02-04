import React, { useState } from "react";
import InvoiceDetail from "./InvoiceDetail";
import RightSidebar from "./RightSidebar";
import MattersLegalTeam from "./MattersLegalTeam";
import MattersFirmsVendors from "./MattersFirmsVendors";
import MattersInvoiceRecords from "./MattersInvoiceRecords";
import useMatterAmounts from "./dataWarehouse/useMatterAmounts";
import ContentTable from "./displayElements/ContentTable";
import { textRecords } from "../data/messages/textRecords";
import EventCalendar from "./menuInteractions/EventCalendar";
import "../styles/Dashboard.css";
import "../styles/MattersDashboard.css";

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

const MattersDashboard = ({
  matter,
  onSelectInvoice,
  selectedInvoice,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState("Primary Information");
  const [hoveredDateName, setHoveredDateName] = useState(null);

  // If an invoice is selected, render the detail view
  if (selectedInvoice) {
    return <InvoiceDetail invoice={selectedInvoice} onBack={onBack} />;
  }

  const primaryTabs = [
    "Primary Information",
    "Legal Team",
    "Firms & Vendors",
    "Invoice Records",
  ];

  const EditIcon = () => <button className="icon-action-btn">📝</button>;
  const RefreshIcon = () => <button className="icon-action-btn">↻</button>;

  // Fallback to default if no matter is selected (e.g. direct access or dev mode)
  const displayMatter = matter || {
    id: "ADR-000011",
    name: "Nupur V. Shah",
    client: "Nupur V. Shah",
    status: "Open",
    areaOfLaw: "Administration",
    priority: "C",
  };

  // Calculate the amount for this matter based on invoices
  const matterAmounts = useMatterAmounts([displayMatter]);
  const matterAmount = matterAmounts[displayMatter.id] || 0;

  // Helper function to format dates from YYYY-MM-DD to MM/DD/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Calculate days active
  const calculateDaysActive = () => {
    if (!displayMatter.dateOpened) return null;
    const openDate = new Date(displayMatter.dateOpened);
    const today = new Date('2026-02-03'); // Current date
    const diffTime = Math.abs(today - openDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate duration (days between open and close)
  const calculateDuration = () => {
    if (!displayMatter.dateOpened || !displayMatter.dateClosed) return null;
    const openDate = new Date(displayMatter.dateOpened);
    const closeDate = new Date(displayMatter.dateClosed);
    const diffTime = Math.abs(closeDate - openDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const textRecordColumns = [
    { key: "date", header: "DATE", width: "16%" },
    { key: "subject", header: "SUBJECT", width: "34%" },
    { key: "employeeType", header: "TYPE", width: "16%" },
    { key: "employeeName", header: "NAME", width: "26%" },
    {
      key: "icon",
      header: "ICON",
      width: "8%",
      align: "center",
      render: (item) => (
        <span className="feature-icon blue" aria-hidden="true">
          {item.icon}
        </span>
      ),
    },
  ];

  const matterTextRecords = textRecords
    .filter((record) => record.matterId === displayMatter.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  // Collect all key dates for the calendar
  const keyDates = [
    displayMatter.dateOpened && { date: displayMatter.dateOpened, name: 'Date Opened' },
    displayMatter.dateClosed && { date: displayMatter.dateClosed, name: 'Date Closed' },
    displayMatter.lastUpdateDate && { date: displayMatter.lastUpdateDate, name: 'Last Update' },
    displayMatter.lossDate && { date: displayMatter.lossDate, name: 'Loss Date' },
    displayMatter.termStartDate && { date: displayMatter.termStartDate, name: 'Term Start Date' },
    displayMatter.termEndDate && { date: displayMatter.termEndDate, name: 'Term End Date' },
    displayMatter.courtDate && { date: displayMatter.courtDate, name: 'Court Date' },
    displayMatter.reviewDate && { date: displayMatter.reviewDate, name: 'Review Date' },
  ].filter(Boolean); // Remove null/undefined entries

  return (
    <main className="dashboard-container">
      <div className="section-header">
        <h2>MATTERS</h2>
      </div>
      <div className="matter-header">
        <div className="matter-title">
          <h2>{displayMatter.name}</h2>
        </div>
        <div className="matter-id">{displayMatter.id}</div>
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
        </div>
      </div>

      <div className="dashboard-content-container">
        <div className="dashboard-content-section">
          <div className="dashboard-split-content">
            <div className="matters-content-area">
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
                      <span className="value">{displayMatter.areaOfLaw}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">SUB-CATEGORY:</span>
                      <span className="value">Documentation</span>
                    </div>
                    <div className="info-message">
                      No Second Sub-category Found
                    </div>
                  </ContentBlock>

                  {/* Vitals */}
                  <ContentBlock
                    title="VITALS"
                    actions={<RefreshIcon />}
                    className="vitals"
                  >
                    <div className="vitals-row">
                      <span className="label">STATUS:</span>
                      <span className="indicator">
                        {displayMatter.status === "Open" ? "O" : "C"}
                      </span>
                    </div>
                    <div className="vitals-row">
                      <span className="label">PRIORITY:</span>
                      <span className="indicator">
                        {displayMatter.priority}
                      </span>
                    </div>
                    <div className="vitals-row">
                      <span className="label">AREA OF LAW:</span>
                      <span className="indicator">
                        {displayMatter.areaOfLaw.charAt(0)}
                      </span>
                    </div>
                    <div className="vitals-row">
                      <span className="label">AMOUNT:</span>
                      <span className="indicator">
                        {matterAmount === 0 ? "N" : "Y"}
                      </span>
                    </div>
                  </ContentBlock>


                  {/* Related Info */}
                  <ContentBlock
                    title="RELATED INFO"
                    actions={<RefreshIcon />}
                    className="related-info full-width"
                  >
                    <div className="related-grid">
                      <div className="related-col">
                        <div className="info-row">
                          <span className="label">FED/STATE:</span>
                          <span className="value">{displayMatter.fedState || "-"}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">INDEX NO:</span>
                          <span className="value">{displayMatter.indexNumber || "-"}</span>
                        </div>
                      </div>
                      <div className="related-col">
                        <div className="info-row">
                          <span className="label">REFERENCE NO:</span>
                          <span className="value">{displayMatter.referenceNumber || "-"}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">CLAIM NO:</span>
                          <span className="value">{displayMatter.claimNumber || "-"}</span>
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
                    <ContentTable
                      columns={textRecordColumns}
                      data={matterTextRecords}
                      emptyMessage="No text records found."
                      striped
                    />
                  </ContentBlock>
                </div>
              )}

              {activeTab === "Legal Team" && (
                <MattersLegalTeam matter={displayMatter} />
              )}
              {activeTab === "Firms & Vendors" && (
                <MattersFirmsVendors matter={displayMatter} />
              )}
              {activeTab === "Invoice Records" && (
                <MattersInvoiceRecords
                  matter={displayMatter}
                  onSelectInvoice={onSelectInvoice}
                />
              )}

              {activeTab !== "Primary Information" &&
                activeTab !== "Legal Team" &&
                activeTab !== "Firms & Vendors" &&
                activeTab !== "Invoice Records" && (
                  <div className="placeholder-tab-content">
                    <h3>{activeTab}</h3>
                    <p>Functionality coming soon...</p>
                  </div>
                )}
            </div>

            <div className="right-sidebar-column">
              
              <div className="content-block">
                <div className="block-header">
                  <h3>KEY DATES CALENDAR</h3>
                </div>
                  <EventCalendar 
                    events={keyDates} 
                    dateField="date" 
                    nameField="name"
                    onEventHover={setHoveredDateName}
                  />
              </div>
              
                  <ContentBlock
                    title="KEY DATES"
                    actions={<RefreshIcon />}
                    className="key-dates"
                  >
                    <div className={`date-row ${hoveredDateName === 'Days Active' ? 'highlighted' : ''}`}>
                      <span className="label light">DAYS ACTIVE</span>
                      <span className="value">{calculateDaysActive() || ''}</span>
                    </div>
                    <div className={`date-row highlight ${hoveredDateName === 'Date Opened' ? 'highlighted' : ''}`}>
                      <span className="label">Date Opened</span>
                      <span className="value">{formatDate(displayMatter.dateOpened) || ''}</span>
                    </div>
                    <div className={`date-row ${hoveredDateName === 'Last Update' ? 'highlighted' : ''}`}>
                      <span className="label light">LAST UPDATE</span>
                      <span className="value">{formatDate(displayMatter.lastUpdateDate) || ''}</span>
                    </div>
                    <div className={`date-row light-text ${hoveredDateName === 'Date Closed' ? 'highlighted' : ''}`}>
                      <span className="label">DATE CLOSED</span>
                      <span className="value">{formatDate(displayMatter.dateClosed) || ''}</span>
                    </div>
                    <div className={`date-row ${hoveredDateName === 'Duration' ? 'highlighted' : ''}`}>
                      <span className="label">Duration</span>
                      <span className="value">{calculateDuration() ? `${calculateDuration()} days` : ''}</span>
                    </div>
                    <div className={`date-row highlight-blue ${hoveredDateName === 'Loss Date' ? 'highlighted' : ''}`}>
                      <span className="label">Loss Date</span>
                      <span className="value">{formatDate(displayMatter.lossDate) || ''}</span>
                    </div>
                    <div className={`date-row highlight-blue ${hoveredDateName === 'Term Start Date' ? 'highlighted' : ''}`}>
                      <span className="label">Term Start Date</span>
                      <span className="value">{formatDate(displayMatter.termStartDate) || ''}</span>
                    </div>
                    <div className={`date-row highlight-blue ${hoveredDateName === 'Term End Date' ? 'highlighted' : ''}`}>
                      <span className="label">Term End Date</span>
                      <span className="value">{formatDate(displayMatter.termEndDate) || ''}</span>
                    </div>
                    <div className={`date-row highlight-blue ${hoveredDateName === 'Court Date' ? 'highlighted' : ''}`}>
                      <span className="label">Court Date</span>
                      <span className="value">{formatDate(displayMatter.courtDate) || ''}</span>
                    </div>
                    <div className={`date-row highlight-blue ${hoveredDateName === 'Review Date' ? 'highlighted' : ''}`}>
                      <span className="label">Review Date</span>
                      <span className="value">{formatDate(displayMatter.reviewDate) || ''}</span>
                    </div>
                  </ContentBlock>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MattersDashboard;

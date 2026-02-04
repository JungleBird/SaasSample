import React, { useState } from "react";
import EventCalendar from "./menuInteractions/EventCalendar";
import { matters } from "../data/matters/matters";
import "../styles/HomeDashboard.css";

const HomeDashboard = () => {
  const [activeTab, setActiveTab] = useState("Announcements");
  const [hoveredEventName, setHoveredEventName] = useState(null);

  // Helper function to format date from YYYY-MM-DD to MM/DD
  function formatDateToMMDD(dateString) {
    if (!dateString) return "";
    // Handle both "YYYY-MM-DD" and "MM/DD/YYYY" formats
    if (dateString.includes("-")) {
      const [, month, day] = dateString.split("-");
      return `${month}/${day}`;
    } else if (dateString.includes("/")) {
      const parts = dateString.split("/");
      return `${parts[0]}/${parts[1]}`;
    }
    return dateString;
  }

  const tabs = ["Announcements", "Action Report"];

  // Get matters with review dates
  const mattersWithReviewDates = matters
    .filter((matter) => matter.reviewDate)
    .sort((a, b) => new Date(a.reviewDate) - new Date(b.reviewDate));

  function ListMattersWithReviewDates({ calendarEvents }) {
    return calendarEvents.length > 0 ? (
      <div className="message-list">
        {calendarEvents.map((matter, i) => (
          <div 
            key={i} 
            className={`message-item ${hoveredEventName === matter.name ? "highlighted" : ""}`}
          >
            <span className="message-date">
              {formatDateToMMDD(matter.reviewDate)}
            </span>
            <span className="message-subject">{matter.name}</span>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ fontSize: "14px", color: "#666", fontStyle: "italic" }}>
        No matter events scheduled.
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="section-header">
        <h2>MY LAWTRAC</h2>
      </div>

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
      </div>
      <div className="dashboard-content">
        <div className="main-content-area">
          {activeTab === "Announcements" && (
            <div className="announcements-list">
              <div className="announcement-item">
                <div className="announcement-header">
                  <h3>GENERAL ANNOUNCEMENTS</h3>
                  <span className="date">Thursday, December 8, 2016</span>
                </div>
                <h4 className="title orange">Happy Holidays</h4>
                <p>
                  Happy Holidays to everyone in the organization. The offices
                  will be closed from December to January. Everyone please enjoy
                  the holidays and be safe.
                </p>
              </div>

              <div className="announcement-item">
                <div className="announcement-header">
                  <h3>INSTRUCTIONS</h3>
                  <span className="date">Tuesday, September 24, 2013</span>
                </div>
                <h4 className="title orange">Term: Reminders</h4>
                <p>Some terms you may see in Doctrac:</p>
                <p>
                  <strong>Short Term Reminder:</strong> Sends an email shortly
                  before the event to all individuals assigned to the matter.
                  These are generally used to remind individuals of an upcoming
                  meeting or other event.
                </p>
                <p>
                  <strong>Long Term Reminder:</strong> Sends an email in the
                  distant future to individuals identified in the reminder
                  module for a specific matter. These are intended to remind
                  individuals of items that are coming up that require a
                  proactive measure such as contract renewal notice or other
                  event which has finan
                </p>
                <div className="read-more">
                  <a href="#">Read All</a>
                </div>
              </div>

              <div className="announcement-item">
                <div className="announcement-header">
                  <h3>GENERAL ANNOUNCEMENT</h3>
                  <span className="date">Friday, July 22, 2011</span>
                </div>
                <h4 className="title orange">Blood Drive</h4>
                <p>
                  <strong>Tuesday</strong>
                </p>
                <p>
                  This year's Blood Drive will be kicking off on this Tuesday.
                  All employees are encouraged to help out in this most
                  worthwhile cause.
                </p>
              </div>
            </div>
          )}
          {activeTab !== "Announcements" && (
            <div className="placeholder-content">Content for {activeTab}</div>
          )}
        </div>

        <div className="right-content-column">
          <div className="section-header-bar">NEXT THIRTY DAYS:</div>
          <div className="events-section">
            <EventCalendar
              events={mattersWithReviewDates}
              dateField="reviewDate"
              nameField="name"
              onEventHover={setHoveredEventName}
            />

            <div className="section-header-bar" style={{ marginTop: "20px" }}>
              Upcoming events:
            </div>
            <ListMattersWithReviewDates calendarEvents={mattersWithReviewDates} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;

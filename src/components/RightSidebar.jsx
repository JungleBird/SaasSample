import React, { useState } from "react";
import AccordionMenu from "./MenuInteractions/AccordionMenu";
import "../styles/RightSidebar.css";

const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState("MATTER");

  const sidebarTitles = [
    "Calendar & Events",
    "Categories",
    "Linked Records",
    "Open / Close Matter",
  ];

  const items = sidebarTitles.map((title) => ({
    id: title,
    title: title,
    content: <div className="empty-message">No content for {title}</div>,
  }));

  return (
    <aside className="right-sidebar">
      <div className="sidebar-tabs">
        {["MATTER", "FINANCE"].map((tab) => (
          <button
            key={tab}
            className={`sidebar-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <AccordionMenu
        items={items}
        defaultOpen="Calendar & Events"
        className="accordion-container" /* Reusing existing class or rename to right-sidebar-accordion and update CSS */
        headerClass="teal-blue"
      />
    </aside>
  );
};

export default RightSidebar;

import React, { useState } from "react";
import "../styles/PeopleDashboard.css";
import { employees } from "../data/people/employees";
import PeopleFilterSidebar from "./PeopleFilterSidebar";
import ContentTable from "./displayElements/ContentTable";
import ExpandedRowPeopleBody from "./displayElements/ExpandedRowPeopleBody";

const PeopleInHouse = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);

  const inHouse = employees
    .filter((e) => e.entityId === null)
    .filter((person) => {
      if (!selectedLetter) return true;
      return person.name.charAt(0).toUpperCase() === selectedLetter;
    });

  const columns = [
    {
      key: "name",
      header: "NAME",
      expandable: true,
    },
    {
      key: "title",
      header: "JOB TITLE",
      color: "#666",
      fontWeight: "bold",
    },
    { key: "location", header: "LOCATION" },
    { key: "phone", header: "PHONE" },
    { key: "badges", header: "BADGES", type: "badges", width: "150px" },
  ];

  // Render the expanded content for an in-house person row
  const renderExpandedContent = (item) => (
    <ExpandedRowPeopleBody item={item} />
  );

  return (
    <div className="dashboard-content-container">
      <div className="dashboard-content-section">
        <ContentTable
          columns={columns}
          data={inHouse}
          striped
          renderExpandedContent={renderExpandedContent}
        />
      </div>

      <PeopleFilterSidebar
        onLetterSelect={setSelectedLetter}
        selectedLetter={selectedLetter}
      >
        <div className="filter-group">
          <div className="filter-group-header"></div>
        </div>
      </PeopleFilterSidebar>
    </div>
  );
};

export default PeopleInHouse;

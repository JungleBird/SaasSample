import React, { useState } from "react";
import "../styles/PeopleDashboard.css";
import { entities } from "../data/people/entities";
import PeopleFilterSidebar from "./PeopleFilterSidebar";
import ContentTable from "./displayElements/ContentTable";
import ExpandedRowEntitiesBody from "./displayElements/ExpandedRowEntitiesBody";

const PeopleFirms = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);

  const firms = entities
    .filter((e) => e.type === "Firm")
    .filter((firm) => {
      if (!selectedLetter) return true;
      return firm.name.charAt(0).toUpperCase() === selectedLetter;
    });

  const columns = [
    {
      key: "name",
      header: "FIRM NAME",
      expandable: true,
    },
    { key: "location", header: "LOCATION" },
    { key: "phone", header: "PHONE" },
    { key: "badges", header: "BADGES", type: "badges", width: "150px" },
  ];

  // Render the expanded content for a firm row
  const renderExpandedContent = (item) => (
    <ExpandedRowEntitiesBody item={item} />
  );

  return (
    <div className="dashboard-content-container">
      <div className="dashboard-content-section">
        <ContentTable
          columns={columns}
          data={firms}
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

export default PeopleFirms;

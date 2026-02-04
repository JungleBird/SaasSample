import React, { useState } from "react";
import "../styles/PeopleDashboard.css";
import { employees } from "../data/people/employees";
import { entities } from "../data/people/entities";
import PeopleFilterSidebar from "./PeopleFilterSidebar";
import ContentTable from "./displayElements/ContentTable";
import ExpandedRowPeopleBody from "./displayElements/ExpandedRowPeopleBody";

const PeopleIndividuals = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);

  const individuals = employees
    .filter((e) => e.entityId !== null)
    .filter((person) => {
      if (!selectedLetter) return true;
      return person.name.charAt(0).toUpperCase() === selectedLetter;
    })
    .map((ind) => {
      const entity = entities.find((e) => e.id === ind.entityId);
      return {
        ...ind,
        entityName: entity ? entity.name : "-",
        entityType: entity ? entity.type : "-",
      };
    });

  const columns = [
    {
      key: "name",
      header: "NAME",
      expandable: true,
    },
    { key: "location", header: "LOCATION" },
    { key: "phone", header: "PHONE" },
    { key: "entityName", header: "ENTITY" },
    { key: "entityType", header: "TYPE" },
    { key: "badges", header: "BADGES", type: "badges", width: "150px" },
  ];

  // Render the expanded content for an individual row
  const renderExpandedContent = (item) => (
    <ExpandedRowPeopleBody item={item} />
  );

  return (
    <div className="dashboard-content-container">
      <div className="dashboard-content-section">
        <ContentTable
          columns={columns}
          data={individuals}
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

export default PeopleIndividuals;

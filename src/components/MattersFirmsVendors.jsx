import React from "react";
import "../styles/Dashboard.css";
import { entities } from "../data/people/entities";
import ContentTable from "./displayElements/ContentTable";
import ExpandedRowEntitiesBody from "./displayElements/ExpandedRowEntitiesBody";

const MattersFirmsVendors = ({ matter }) => {
  const filteredItems = entities.filter(
    (item) => matter && item.matters && item.matters.includes(matter.name),
  );

  const columns = [
    { key: "type", header: "TYPE" },
    { 
      key: "name", 
      header: "NAME", 
      color: "#008fa1", 
      fontWeight: "bold",
      expandable: true,
    },
    { key: "location", header: "LOCATION" },
    { key: "phone", header: "PHONE" },
    {
      key: "actions",
      header: "",
      width: "80px",
      type: "actions",
      actions: [
        { icon: "📝", title: "Edit" },
        { icon: "✉", title: "Email" },
      ],
    },
  ];

  const renderExpandedContent = (item) => (
    <ExpandedRowEntitiesBody item={item} />
  );

  return (
    <div className="content-block">
      <div className="block-header">
        <h3>ASSIGNED FIRMS & VENDORS</h3>
      </div>
      <div className="block-content">
        {filteredItems.length > 0 ? (
          <ContentTable
            columns={columns}
            data={filteredItems}
            keyField="id"
            striped
            renderExpandedContent={renderExpandedContent}
          />
        ) : (
          <p>No firms or vendors currently assigned to this matter.</p>
        )}
      </div>
    </div>
  );
};

export default MattersFirmsVendors;

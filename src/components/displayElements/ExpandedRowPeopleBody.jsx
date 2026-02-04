import React from "react";
import "../../styles/Tables.css";

/**
 * ExpandedRowPeopleBody - Displays detailed contact information for an individual
 * @param {Object} props
 * @param {Object} props.item - The person/employee item
 */
const ExpandedRowPeopleBody = ({ item }) => {
  return (
    <div className="person-details-container">
      <div className="person-details-header">Contact Information</div>
      
      <div className="person-details-grid">
        <div className="person-detail-section">
          <div className="person-detail-label">Full Name</div>
          <div className="person-detail-value">{item.name || "-"}</div>
        </div>

        {item.title && (
          <div className="person-detail-section">
            <div className="person-detail-label">Title</div>
            <div className="person-detail-value">{item.title}</div>
          </div>
        )}

        <div className="person-detail-section">
          <div className="person-detail-label">Location</div>
          <div className="person-detail-value">{item.location || "-"}</div>
        </div>

        <div className="person-detail-section">
          <div className="person-detail-label">Phone</div>
          <div className="person-detail-value">{item.phone || "-"}</div>
        </div>

        {item.entityName && (
          <div className="person-detail-section">
            <div className="person-detail-label">Associated Entity</div>
            <div className="person-detail-value">
              {item.entityName} ({item.entityType})
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandedRowPeopleBody;

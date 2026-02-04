import React from "react";
import "../../styles/Tables.css";

/**
 * ExpandedRowMessageBody - Component for displaying message body in an expanded table row
 * 
 * @param {Object} props
 * @param {Object} props.item - The text record item containing the body to display
 */
const ExpandedRowMessageBody = ({ item }) => {
  return (
    <div className="message-body-container">
      <label className="message-body-label">Message Body:</label>
      <textarea
        className="message-body-textarea"
        value={item.body || ""}
        readOnly
        rows={4}
      />
    </div>
  );
};

export default ExpandedRowMessageBody;

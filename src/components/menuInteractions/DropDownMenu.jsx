import React from "react";
import "../../styles/TopNavigation.css"; // Assuming styles are here, or commonly shared

const DropDownMenu = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="dropdown-menu">
      {items.map((item, index) => (
        <div
          key={index}
          className="dropdown-item"
          onClick={(e) => {
            e.stopPropagation();
            if (item.onClick) {
              item.onClick(e);
            }
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default DropDownMenu;

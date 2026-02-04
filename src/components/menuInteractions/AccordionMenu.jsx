import React, { useState } from "react";

const AccordionMenu = ({
  items,
  defaultOpen,
  className,
  headerClass,
  itemClass,
}) => {
  const [openSections, setOpenSections] = useState(
    defaultOpen ? [defaultOpen] : []
  );

  const toggleSection = (id) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((sectionId) => sectionId !== id) : [...prev, id]
    );
  };

  return (
    <div className={`accordion-container ${className || ""}`}>
      {items.map((item) => (
        <div
          key={item.id}
          className={`accordion-item ${itemClass || ""} ${
            openSections.includes(item.id) ? "open" : ""
          }`}
        >
          <div
            className={`accordion-header ${headerClass || ""}`}
            onClick={() => toggleSection(item.id)}
          >
            <span>{item.title}</span>
          </div>
          {openSections.includes(item.id) && (
            <div className="accordion-content">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AccordionMenu;

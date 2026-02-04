import React from "react";
import "../styles/PeopleDashboard.css";

const PeopleFilterSidebar = ({ children, onLetterSelect, selectedLetter }) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="people-filter-sidebar">
      
        <div className="filter-group-header">
           Filter by Letter
        </div>

      <div className="alpha-grid">
        {letters.map((letter) => (
          <div
            key={letter}
            className={`alpha-box ${selectedLetter === letter ? 'active' : ''}`}
            onClick={() => onLetterSelect(letter)}
            style={{ cursor: 'pointer' }}
          >
            {letter}
          </div>
        ))}
      </div>

      <button className="sidebar-btn secondary" onClick={() => onLetterSelect(null)}>
        Reset Filter
      </button>

      {children}
    </div>
  );
};

export default PeopleFilterSidebar;

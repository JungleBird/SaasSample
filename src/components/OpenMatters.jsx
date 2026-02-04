import React from "react";
import "../styles/MattersLists.css";

const OpenMatters = () => {
  // Mock data for Open Matters
  const matters = [
    {
      id: 1,
      name: "Nupur V. Shah",
      created: "09/01/2016",
      lastAction: "01/05/2017",
      progress: 75,
    },
    {
      id: 2,
      name: "TechCorp Merger",
      created: "11/15/2023",
      lastAction: "02/01/2024",
      progress: 40,
    },
    {
      id: 3,
      name: "Estate Planning - Smith",
      created: "01/10/2024",
      lastAction: "01/28/2024",
      progress: 20,
    },
    {
      id: 4,
      name: "IP Dispute 2024",
      created: "12/05/2023",
      lastAction: "01/30/2024",
      progress: 60,
    },
    {
      id: 5,
      name: "Real Estate Acquisition",
      created: "10/20/2023",
      lastAction: "01/15/2024",
      progress: 90,
    },
    {
      id: 6,
      name: "Contract Review - Vendor X",
      created: "02/01/2024",
      lastAction: "02/02/2024",
      progress: 10,
    },
  ];

  return (
    <div className="matters-list-container">
      <div className="matters-column">
        <h3>Open Matters List</h3>
        <div className="matters-table-container">
          <table className="matters-table">
            <thead>
              <tr>
                <th>Matter Name</th>
                <th>Creation Date</th>
                <th>Last Action</th>
              </tr>
            </thead>
            <tbody>
              {matters.map((matter) => (
                <tr key={matter.id}>
                  <td>
                    <strong>{matter.name}</strong>
                  </td>
                  <td>{matter.created}</td>
                  <td>{matter.lastAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="matters-column">
        <h3>Matter Activity Metrics</h3>
        <div className="charts-container">
          {matters.map((matter) => (
            <div key={matter.id} className="chart-item">
              <div className="chart-placeholder">
                <span className="chart-label" title={matter.name}>
                  {matter.name}
                </span>
                <div className="chart-bar-container">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${matter.progress}%` }}
                  ></div>
                </div>
                <span className="chart-value">{matter.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpenMatters;

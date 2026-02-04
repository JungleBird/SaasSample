import React from "react";
import "../styles/MattersLists.css";

const ClosedMatters = () => {
  // Mock data for Closed Matters
  const matters = [
    {
      id: 101,
      name: "Legacy Dispute 2020",
      created: "01/15/2020",
      lastAction: "12/20/2020",
      progress: 100,
    },
    {
      id: 102,
      name: "Office Relocation",
      created: "03/10/2021",
      lastAction: "09/01/2021",
      progress: 100,
    },
    {
      id: 103,
      name: "Consulting Agreement",
      created: "06/05/2022",
      lastAction: "08/15/2022",
      progress: 100,
    },
    {
      id: 104,
      name: "Patent Filing #442",
      created: "02/20/2022",
      lastAction: "11/30/2023",
      progress: 100,
    },
    {
      id: 105,
      name: "Employee Handbook Update",
      created: "01/10/2023",
      lastAction: "03/15/2023",
      progress: 100,
    },
  ];

  return (
    <div className="matters-list-container">
      <div className="matters-column">
        <h3>Closed Matters List</h3>
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
        <h3>Historical Metrics</h3>
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
                    style={{ width: `100%`, backgroundColor: "#6b7280" }} // Grey for closed
                  ></div>
                </div>
                <span className="chart-value">Done</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClosedMatters;

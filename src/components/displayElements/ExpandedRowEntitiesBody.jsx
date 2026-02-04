import React from "react";
import { employees } from "../../data/people/employees";
import "../../styles/Tables.css";

/**
 * ExpandedRowEntitiesBody - Displays employees belonging to an entity in a grid
 * @param {Object} props
 * @param {Object} props.item - The entity (firm/vendor) item
 */
const ExpandedRowEntitiesBody = ({ item }) => {
  // Filter employees belonging to this entity
  const entityEmployees = employees.filter(
    (employee) => employee.entityId === item.id
  );

  if (entityEmployees.length === 0) {
    return (
      <div className="entity-employees-container">
        <div className="entity-employees-header">Employees</div>
        <p style={{ color: "#666", fontStyle: "italic" }}>
          No employees associated with this {item.type?.toLowerCase() || "entity"}.
        </p>
      </div>
    );
  }

  return (
    <div className="entity-employees-container">
      <div className="entity-employees-header">
        Employees ({entityEmployees.length})
      </div>
      <div className="entity-employees-grid">
        {entityEmployees.map((employee) => (
          <div key={employee.id} className="entity-employee-card">
            <div className="entity-employee-name">{employee.name}</div>
            <div className="entity-employee-title">{employee.title}</div>
            <div className="entity-employee-location">{employee.location}</div>
            <div className="entity-employee-phone">{employee.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpandedRowEntitiesBody;

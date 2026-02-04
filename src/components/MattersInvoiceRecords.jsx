import React from "react";
import "../styles/Dashboard.css";
import { invoices } from "../data/invoices/invoices";
import { entities } from "../data/people/entities";
import ContentTable from "./displayElements/ContentTable";

const MattersInvoiceRecords = ({ matter, onSelectInvoice }) => {
  const filteredInvoices = invoices
    .filter(
      (inv) =>
        matter &&
        inv.matters &&
        inv.matters.some((m) =>
          m.toLowerCase().includes(matter.name.toLowerCase()),
        ),
    )
    .map((inv) => ({
      ...inv,
      firmName: entities.find((e) => e.id === inv.entityId)?.name || inv.firm,
      lineItemsDisplay: inv.lineItems ? inv.lineItems.join(", ") : "-",
    }));

  const columns = [
    { key: "date", header: "DATE" },
    {
      key: "id",
      header: "INVOICE NO.",
      color: "#008fa1",
      fontWeight: "bold",
      render: (inv) => (
        <span
          style={{ color: "#008fa1", fontWeight: "bold", cursor: "pointer" }}
          onClick={() => onSelectInvoice && onSelectInvoice(inv)}
        >
          {inv.id}
        </span>
      ),
    },
    { key: "firmName", header: "FIRM / COMPANY" },
    { key: "lineItemsDisplay", header: "LINE ITEMS", fontSize: "11px", color: "#555" },
    { key: "amount", header: "AMOUNT", align: "left", className: "amount-column" },
    { key: "status", header: "STATUS", type: "status" },
  ];

  return (
    <div className="content-block">
      <div className="block-header">
        <h3>INVOICE RECORDS</h3>
      </div>
      <div className="block-content">
        {filteredInvoices.length > 0 ? (
          <ContentTable
            columns={columns}
            data={filteredInvoices}
            striped
          />
        ) : (
          <p>No invoice records found for this matter.</p>
        )}
      </div>
    </div>
  );
};

export default MattersInvoiceRecords;

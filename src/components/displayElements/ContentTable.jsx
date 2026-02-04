import React, { useState } from "react";
import "../../styles/Tables.css";

/**
 * ContentTable - A reusable table component for displaying list data
 *
 * @param {Object} props
 * @param {Array} props.columns - Column definitions: { key, header, width?, align?, render?, expandable? }
 * @param {Array} props.data - Array of data objects to display
 * @param {string} props.keyField - The field to use as the row key (default: "id")
 * @param {boolean} props.striped - Whether to use striped table styling
 * @param {string} props.emptyMessage - Message to display when no data
 * @param {Object} props.tableStyle - Additional styles for the table element
 * @param {Object} props.headerStyle - Additional styles for the header row
 * @param {Function} props.onRowClick - Optional callback when a row is clicked
 * @param {boolean} props.paginated - Whether to show pagination controls (default: true)
 * @param {number} props.defaultPageSize - Default number of results per page (default: 10)
 * @param {Function} props.renderExpandedContent - Function to render expanded row content (item) => JSX
 */
const ContentTable = ({
  columns,
  data,
  keyField = "id",
  striped = false,
  emptyMessage = "No results found.",
  tableStyle = {},
  headerStyle = {},
  onRowClick,
  paginated = true,
  defaultPageSize = 10,
  renderExpandedContent,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [expandedRows, setExpandedRows] = useState(new Set());

  const tableClassName = `content-table${striped ? " strip-table" : ""}`;

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // String comparison
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // Number comparison
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Default comparison
      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal > bVal ? -1 : 1;
      }
    });

    return sorted;
  }, [data, sortColumn, sortDirection]);

  // Pagination calculations
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = paginated
    ? sortedData.slice(startIndex, endIndex)
    : sortedData;

  // Reset to page 1 when data changes significantly
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [data.length, pageSize, totalPages]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      // Toggle direction if clicking same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Sort new column ascending
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
    // Reset to page 1 when sorting
    setCurrentPage(1);
  };

  const toggleRowExpanded = (rowKey) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowKey)) {
        newSet.delete(rowKey);
      } else {
        newSet.add(rowKey);
      }
      return newSet;
    });
  };

  /**
   * Generates page numbers to display
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, 4);
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
      }

      // Add ellipsis if needed before middle pages
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed after middle pages
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  /**
   * Renders the badges cell based on item properties
   */
  const renderBadges = (item) => {
    return (
      <div className="icon-cell">
        {item.email && <span className="feature-icon orange">✉</span>}
        {item.star && <span className="feature-icon blue">★</span>}
        {item.check && <span className="feature-icon blue">✔</span>}
        {item.thumb && <span className="feature-icon blue">👍</span>}
        {item.doc && <span className="feature-icon blue">📄</span>}
      </div>
    );
  };

  /**
   * Renders a cell value based on column configuration
   */
  const renderCell = (item, column) => {
    // If column has a custom render function, use it
    if (column.render) {
      return column.render(item, item[column.key]);
    }

    // Special handling for badges column
    if (column.type === "badges") {
      return renderBadges(item);
    }

    // Special handling for status column
    if (column.type === "status") {
      return <span className="invoice-status pending">{item[column.key]}</span>;
    }

    // Special handling for expandable column
    if (column.expandable && renderExpandedContent) {
      const rowKey = item[keyField];
      const isExpanded = expandedRows.has(rowKey);
      return (
        <a
          href="#"
          className={column.className || "expandable-link"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleRowExpanded(rowKey);
          }}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          {item[column.key]}
          <span className={`expand-indicator ${isExpanded ? "expanded" : ""}`}>
            {isExpanded ? "▼" : "▶"}
          </span>
        </a>
      );
    }

    // Special handling for link column
    if (column.type === "invoice-link") {
      return (
        <a
          href="#"
          className="invoice-link"
          onClick={(e) => {
            e.preventDefault();
            column.onClick && column.onClick(item);
          }}
        >
          {item[column.key]}
        </a>
      );
    }

    // Special handling for matter link column
    if (column.type === "matter-link") {
      return (
        <a
          href="#"
          className="matter-link"
          onClick={(e) => {
            e.preventDefault();
            column.onClick && column.onClick(item);
          }}
        >
          {item[column.key]}
        </a>
      );
    }

    // Special handling for actions column
    if (column.type === "actions") {
      return (
        <div style={{ textAlign: "right" }}>
          {column.actions &&
            column.actions.map((action, idx) => (
              <span
                key={idx}
                style={{
                  marginRight: idx < column.actions.length - 1 ? "10px" : 0,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick && action.onClick(item);
                }}
                title={action.title}
              >
                {action.icon}
              </span>
            ))}
        </div>
      );
    }

    // Default: return raw value or "-"
    const value = item[column.key];
    return value !== undefined && value !== null && value !== "" ? value : "-";
  };

  /**
   * Gets cell styles based on column configuration
   * @param {Object} column - Column configuration
   * @param {boolean} isHeader - Whether this is a header cell (excludes color styling)
   */
  const getCellStyle = (column, isHeader = false) => {
    const style = {};
    if (column.width) style.width = column.width;
    if (column.align) style.textAlign = column.align;
    // Only apply color to data cells, not headers
    if (column.color && !isHeader) style.color = column.color;
    if (column.fontWeight) style.fontWeight = column.fontWeight;
    if (column.fontSize) style.fontSize = column.fontSize;
    return style;
  };

  return (
    <div className="content-table-wrapper">
      {/* Pagination Bar */}
      {paginated && totalPages > 0 && (
        <div className="pagination-bar">
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Prev
            </button>

            <div className="pagination-pages">
              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    className={`pagination-page ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>

          <div className="pagination-page-size">
            <select value={pageSize} onChange={handlePageSizeChange}>
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={40}>40 per page</option>
            </select>
          </div>
        </div>
      )}

      <table className={tableClassName} style={tableStyle}>
        <thead>
          <tr style={headerStyle}>
            {columns.map((column) => (
              <th
                key={column.key}
                style={getCellStyle(column, true)}
                className={column.canSort ? "sortable-header" : ""}
                onClick={() => column.canSort && handleSort(column.key)}
              >
                <div className="header-content">
                  <span>{column.header}</span>
                  {column.canSort && (
                    <span
                      className={`sort-indicator ${sortColumn === column.key ? "active" : ""}`}
                    >
                      {sortColumn === column.key
                        ? sortDirection === "asc"
                          ? "▲"
                          : "▼"
                        : "▲▼"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, rowIndex) => {
              const rowKey = item[keyField] || rowIndex;
              const isExpanded = expandedRows.has(rowKey);
              return (
                <React.Fragment key={rowKey}>
                  <tr
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    style={onRowClick ? { cursor: "pointer" } : undefined}
                    className={isExpanded ? "expanded-row" : ""}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        style={getCellStyle(column)}
                        className={column.className}
                      >
                        {renderCell(item, column)}
                      </td>
                    ))}
                  </tr>
                  {isExpanded && renderExpandedContent && (
                    <tr className="expanded-content-row">
                      <td colSpan={columns.length}>
                        <div className="expanded-content-container">
                            
                          <div className="expanded-content-body">
                            {renderExpandedContent(item)}
                          </div>
                          <div className="expanded-content-header">
                            <button
                              className="collapse-btn"
                              onClick={() => toggleRowExpanded(rowKey)}
                              title="Collapse"
                            >
                              ▲ Collapse
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: "20px", textAlign: "center" }}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContentTable;

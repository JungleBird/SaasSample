import React, { useState } from "react";
import "../../styles/EventCalendar.css";

/**
 * EventCalendar - A compact calendar component for displaying event dates
 * @param {Object} props
 * @param {Array} props.events - Array of event objects with date and name properties
 * @param {string} props.dateField - The field name to use for the date (default: "date")
 * @param {string} props.nameField - The field name to use for the name (default: "name")
 * @param {Function} props.onEventHover - Callback when hovering over an event day (receives event name or null)
 */
const EventCalendar = ({ events = [], dateField = "date", nameField = "name", onEventHover }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Day names (abbreviated)
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Parse event dates and create a Set of day numbers that have events
  const eventDays = new Map();
  events.forEach((event) => {
    const eventDateStr = event[dateField];
    if (!eventDateStr) return;

    let eventDate;
    if (eventDateStr.includes("-")) {
      // YYYY-MM-DD format
      eventDate = new Date(eventDateStr + "T00:00:00");
    } else if (eventDateStr.includes("/")) {
      // MM/DD/YYYY format
      const [m, d, y] = eventDateStr.split("/");
      eventDate = new Date(y, m - 1, d);
    }

    if (eventDate && eventDate.getFullYear() === year && eventDate.getMonth() === month) {
      const day = eventDate.getDate();
      if (!eventDays.has(day)) {
        eventDays.set(day, []);
      }
      eventDays.get(day).push(event[nameField]);
    }
  });

  // Navigate to previous month
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build calendar grid
  const calendarDays = [];

  // Empty cells for days before the first day of month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="calendar-day empty"></div>
    );
  }

  // Actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const hasEvent = eventDays.has(day);
    const eventNames = eventDays.get(day) || [];

    calendarDays.push(
      <div
        key={day}
        className={`calendar-day ${hasEvent ? "has-event" : ""}`}
        title={hasEvent ? eventNames.join("\n") : ""}
        onMouseEnter={() => {
          if (hasEvent && onEventHover && eventNames.length > 0) {
            // For simplicity, highlight the first event if multiple events on same day
            onEventHover(eventNames[0]);
          }
        }}
        onMouseLeave={() => {
          if (hasEvent && onEventHover) {
            onEventHover(null);
          }
        }}
      >
        <span className="day-number">{day}</span>
        {hasEvent && <span className="event-dot"></span>}
      </div>
    );
  }

  return (
    <div className="event-calendar">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={goToPrevMonth}>
          ◀
        </button>
        <span className="calendar-month-year">
          {monthNames[month]} {year}
        </span>
        <button className="calendar-nav-btn" onClick={goToNextMonth}>
          ▶
        </button>
      </div>

      {/* Day Names Row */}
      <div className="calendar-day-names">
        {dayNames.map((dayName) => (
          <div key={dayName} className="calendar-day-name">
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {calendarDays}
      </div>

      {/* Legend */}
      {eventDays.size > 0 && (
        <div className="calendar-legend">
          <span className="legend-dot"></span>
          <span className="legend-text">{eventDays.size} event(s) this month</span>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;

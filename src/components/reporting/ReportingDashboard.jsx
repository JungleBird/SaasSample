import React from "react";
import { getAnomalies } from "../../utils/metrics";
import { useInvoiceMetrics } from "./metrics/useInvoiceMetrics";
import { usePeopleMetrics } from "./metrics/usePeopleMetrics";
import { useMattersMetrics } from "./metrics/useMattersMetrics";
import { MetricCard } from "./ReportingComponents";
import "../../styles/Reporting.css";

const ReportingDashboard = () => {
  const invoiceData = useInvoiceMetrics();
  const peopleData = usePeopleMetrics();
  const mattersData = useMattersMetrics();
  const anomalies = getAnomalies();

  // Flatten all metrics into a single array
  const allMetrics = [
    // Invoice Metrics
    {
      title: "Total Invoices",
      value: invoiceData.totalInvoices,
      subtext: "All statuses",
    },
    ...invoiceData.avgAmountByStatus.map((stat) => ({
      title: stat.status,
      value: `$${(stat.avgAmount / 1000).toFixed(1)}k`,
      subtext: `${stat.count} inv`,
    })),

    // People Metrics
    {
      title: "Compliance",
      value: peopleData.entityCompliance.avgScore,
      subtext: "of 4.0",
      trend: peopleData.entityCompliance.avgScore > 3 ? "up" : "down",
    },
    {
      title: "High Risk",
      value: peopleData.entityCompliance.highRisk.length,
      subtext: "flagged",
      trend: "down",
    },
    {
      title: "Workforce",
      value: peopleData.totalEmployees,
      subtext: `${peopleData.totalEntities} partners`,
    },

    // Matters Metrics
    {
      title: "Total Matters",
      value: mattersData.totalMatters,
      subtext: "All cases",
    },
    {
      title: "Open Matters",
      value: mattersData.openMatters,
      subtext: `${mattersData.closedMatters} closed`,
    },
    {
      title: "Priority A",
      value: mattersData.highPriorityCount,
      subtext: "High priority",
      trend: mattersData.highPriorityCount > 2 ? "down" : "up",
    },
    {
      title: "Avg Age",
      value: `${mattersData.avgMatterAgeDays}d`,
      subtext: "Open matters",
    },
    {
      title: "Stale Cases",
      value: mattersData.staleMatterCount,
      subtext: ">60 days idle",
      trend: mattersData.staleMatterCount > 0 ? "down" : "up",
    },
    {
      title: "Upcoming Court",
      value: mattersData.upcomingCourtDates.length,
      subtext: "Next 30 days",
    },
    {
      title: "Federal",
      value: mattersData.jurisdictionCounts.Federal || 0,
      subtext: `${mattersData.jurisdictionCounts.State || 0} State`,
    },

    // Top metrics from detailed data
    ...invoiceData.avgLineItemsByFirm.slice(0, 2).map((item, i) => ({
      title: `#${i + 1} Firm Complexity`,
      value: item.avgLineItems,
      subtext: item.firm.substring(0, 18),
    })),

    ...invoiceData.topLineItems.slice(0, 2).map((item, i) => ({
      title: `#${i + 1} Service`,
      value: item.count,
      subtext: item.name.substring(0, 16),
    })),

    ...peopleData.employeeTitles.slice(0, 2).map((item, i) => ({
      title: `#${i + 1} Role`,
      value: item[1],
      subtext: item[0].substring(0, 16),
    })),

    ...mattersData.topAreasOfLaw.slice(0, 2).map((item, i) => ({
      title: `#${i + 1} Practice`,
      value: item[1],
      subtext: item[0].substring(0, 16),
    })),

    ...mattersData.topClients.slice(0, 2).map((item, i) => ({
      title: `#${i + 1} Client`,
      value: item[1],
      subtext: item[0].substring(0, 16),
    })),
  ];

  return (
    <div className="reporting-dashboard">
      <div className="reporting-header">
        <h1>Enterprise Analytics & AI Insights</h1>
      </div>

      {/* Unified Metric Grid - Full Width */}
      <section className="metrics-section" style={{ marginBottom: "10px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            width: "100%",
          }}
        >
          {allMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              subtext={metric.subtext}
              trend={metric.trend}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ReportingDashboard;

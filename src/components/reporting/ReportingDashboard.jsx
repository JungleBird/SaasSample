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
      title: "Total Invoice Records",
      value: invoiceData.totalInvoices,
      subtext: "Across all payment statuses and vendors",
    },
    ...invoiceData.avgAmountByStatus.map((stat) => ({
      title: `${stat.status} - Average Invoice Value`,
      value: `$${(stat.avgAmount / 1000).toFixed(1)}k`,
      subtext: `Based on ${stat.count} invoices in this status`,
    })),

    // People Metrics
    {
      title: "Average Compliance Score",
      value: peopleData.entityCompliance.avgScore,
      subtext: "Out of 4.0 maximum rating across all entities",
      trend: peopleData.entityCompliance.avgScore > 3 ? "up" : "down",
    },
    {
      title: "High Risk Entities Flagged",
      value: peopleData.entityCompliance.highRisk.length,
      subtext: "Organizations requiring immediate attention",
      trend: "down",
    },
    {
      title: "Total Internal Workforce",
      value: peopleData.totalEmployees,
      subtext: `Working with ${peopleData.totalEntities} external partner organizations`,
    },

    // Matters Metrics
    {
      title: "Total Legal Matters",
      value: mattersData.totalMatters,
      subtext: "All cases across all practice areas and jurisdictions",
    },
    {
      title: "Currently Active Matters",
      value: mattersData.openMatters,
      subtext: `${mattersData.closedMatters} matters have been successfully closed`,
    },
    {
      title: "Priority A Matters",
      value: mattersData.highPriorityCount,
      subtext: "Highest priority cases requiring immediate attention",
      trend: mattersData.highPriorityCount > 2 ? "down" : "up",
    },
    {
      title: "Average Matter Age",
      value: `${mattersData.avgMatterAgeDays}d`,
      subtext: "Average days since matter opened for active cases",
    },
    {
      title: "Stale Cases Identified",
      value: mattersData.staleMatterCount,
      subtext: "Matters with no activity for more than 60 days",
      trend: mattersData.staleMatterCount > 0 ? "down" : "up",
    },
    {
      title: "Upcoming Court Dates",
      value: mattersData.upcomingCourtDates.length,
      subtext: "Scheduled hearings and appearances in next 30 days",
    },
    {
      title: "Federal Jurisdiction Matters",
      value: mattersData.jurisdictionCounts.Federal || 0,
      subtext: `${mattersData.jurisdictionCounts.State || 0} matters in state jurisdiction`,
    },

    // Top metrics from detailed data
    ...invoiceData.avgLineItemsByFirm.slice(0, 2).map((item, i) => ({
      title: `Top ${i + 1} - Invoice Complexity by Firm`,
      value: item.avgLineItems,
      subtext: `${item.firm} - Average line items per invoice`,
    })),

    ...invoiceData.topLineItems.slice(0, 2).map((item, i) => ({
      title: `Top ${i + 1} - Most Billed Service`,
      value: item.count,
      subtext: `${item.name} - Total instances billed`,
    })),

    ...peopleData.employeeTitles.slice(0, 2).map((item, i) => ({
      title: `Top ${i + 1} - Most Common Role`,
      value: item[1],
      subtext: `${item[0]} - Total employees in this position`,
    })),

    ...mattersData.topAreasOfLaw.slice(0, 2).map((item, i) => ({
      title: `Top ${i + 1} - Practice Area by Volume`,
      value: item[1],
      subtext: `${item[0]} - Total matters in this practice`,
    })),

    ...mattersData.topClients.slice(0, 2).map((item, i) => ({
      title: `Top ${i + 1} - Client by Matter Count`,
      value: item[1],
      subtext: `${item[0]} - Total active and closed matters`,
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
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
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

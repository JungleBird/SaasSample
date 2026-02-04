import { useMemo } from "react";
import { matters } from "../../../data/matters/matters";

export const useMattersMetrics = () => {
  return useMemo(() => {
    const now = new Date();

    // 1. Status Distribution (Open vs Closed)
    const statusCounts = matters.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {});

    const openMatters = statusCounts["Open"] || 0;
    const closedMatters = statusCounts["Closed"] || 0;

    // 2. Area of Law Distribution
    const areaOfLawCounts = matters.reduce((acc, m) => {
      acc[m.areaOfLaw] = (acc[m.areaOfLaw] || 0) + 1;
      return acc;
    }, {});

    const topAreasOfLaw = Object.entries(areaOfLawCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // 3. Priority Distribution
    const priorityCounts = matters.reduce((acc, m) => {
      acc[m.priority] = (acc[m.priority] || 0) + 1;
      return acc;
    }, {});

    const highPriorityCount = priorityCounts["A"] || 0;
    const mediumPriorityCount = priorityCounts["B"] || 0;
    const lowPriorityCount = priorityCounts["C"] || 0;

    // 4. Federal vs State Jurisdiction
    const jurisdictionCounts = matters.reduce((acc, m) => {
      acc[m.fedState] = (acc[m.fedState] || 0) + 1;
      return acc;
    }, {});

    // 5. Average Matter Age (days since opened for open matters)
    const openMatterAges = matters
      .filter((m) => m.status === "Open")
      .map((m) => {
        const opened = new Date(m.dateOpened);
        return Math.floor((now - opened) / (1000 * 60 * 60 * 24));
      });

    const avgMatterAgeDays =
      openMatterAges.length > 0
        ? Math.round(
            openMatterAges.reduce((a, b) => a + b, 0) / openMatterAges.length,
          )
        : 0;

    const oldestMatterDays =
      openMatterAges.length > 0 ? Math.max(...openMatterAges) : 0;

    // 6. Upcoming Court Dates (next 30 days)
    const upcomingCourtDates = matters
      .filter((m) => m.courtDate)
      .map((m) => ({ ...m, courtDateObj: new Date(m.courtDate) }))
      .filter(
        (m) =>
          m.courtDateObj >= now &&
          m.courtDateObj <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      )
      .sort((a, b) => a.courtDateObj - b.courtDateObj)
      .slice(0, 5);

    // 7. Upcoming Review Dates (next 30 days)
    const upcomingReviewDates = matters
      .filter((m) => m.reviewDate)
      .map((m) => ({ ...m, reviewDateObj: new Date(m.reviewDate) }))
      .filter(
        (m) =>
          m.reviewDateObj >= now &&
          m.reviewDateObj <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      )
      .sort((a, b) => a.reviewDateObj - b.reviewDateObj)
      .slice(0, 5);

    // 8. Stale Matters (no update in 60+ days)
    const staleMatters = matters
      .filter((m) => m.status === "Open")
      .map((m) => ({
        ...m,
        daysSinceUpdate: Math.floor(
          (now - new Date(m.lastUpdateDate)) / (1000 * 60 * 60 * 24),
        ),
      }))
      .filter((m) => m.daysSinceUpdate > 60)
      .sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate)
      .slice(0, 5);

    // 9. Matters by Client (top clients)
    const clientCounts = matters.reduce((acc, m) => {
      acc[m.client] = (acc[m.client] || 0) + 1;
      return acc;
    }, {});

    const topClients = Object.entries(clientCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // 10. Matters Opened per Year
    const mattersByYear = matters.reduce((acc, m) => {
      const year = new Date(m.dateOpened).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    const yearTrend = Object.entries(mattersByYear)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .slice(0, 5);

    return {
      // Summary Metrics
      totalMatters: matters.length,
      openMatters,
      closedMatters,
      highPriorityCount,
      mediumPriorityCount,
      lowPriorityCount,
      avgMatterAgeDays,
      oldestMatterDays,

      // Distributions
      statusCounts,
      areaOfLawCounts,
      topAreasOfLaw,
      priorityCounts,
      jurisdictionCounts,

      // Upcoming Deadlines
      upcomingCourtDates,
      upcomingReviewDates,

      // Risk Indicators
      staleMatters,
      staleMatterCount: staleMatters.length,

      // Client & Trend Analysis
      topClients,
      yearTrend,
    };
  }, []);
};

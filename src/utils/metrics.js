import { invoices } from "../data/invoices/invoices";
import { lineItemsData } from "../data/invoices/lineItems";
import { matters } from "../data/matters/matters";
import { textRecords } from "../data/messages/textRecords";
import { entities } from "../data/people/entities";

/**
 * Helper to parse amount strings to numbers
 */
const parseAmount = (val) => parseFloat(val) || 0;

/**
 * Calculates Financial Metrics
 */
export const getFinancialMetrics = () => {
  const stats = {
    totalSpend: 0,
    totalOriginalAmount: 0,
    savingsTotal: 0,
    savingsRate: 0,
    rejectionRate: 0,
    spendByFirm: {},
    costByLineItem: {},
  };

  let rejectedCount = 0;

  invoices.forEach((inv) => {
    const amount = parseAmount(inv.amount);
    const originalAmount = parseAmount(inv.originalAmount);

    stats.totalSpend += amount;
    stats.totalOriginalAmount += originalAmount;

    if (inv.status === "Rejected") {
      rejectedCount++;
    }

    // Spend by Firm
    if (!stats.spendByFirm[inv.firm]) {
      stats.spendByFirm[inv.firm] = 0;
    }
    stats.spendByFirm[inv.firm] += amount;

    // Cost by Line Item Type
    inv.lineItems.forEach((code) => {
      const item = lineItemsData.find((li) => li.code === code);
      const type = item ? item.type : "Unknown";
      if (!stats.costByLineItem[type]) {
        stats.costByLineItem[type] = 0;
      }
      // Since specific item cost isn't in invoice, we estimate or just count frequency
      // For now, let's count frequency of Fee vs Disbursement
      stats.costByLineItem[type]++;
    });
  });

  stats.savingsTotal = stats.totalOriginalAmount - stats.totalSpend;
  stats.savingsRate =
    stats.totalOriginalAmount > 0
      ? (stats.savingsTotal / stats.totalOriginalAmount) * 100
      : 0;
  stats.rejectionRate = (rejectedCount / invoices.length) * 100;

  return stats;
};

/**
 * Calculates Matter Metrics
 */
export const getMatterMetrics = () => {
  const stats = {
    totalMatters: matters.length,
    openMatters: 0,
    closedMatters: 0,
    byAreaOfLaw: {},
    byPriority: { A: 0, B: 0, C: 0 },
    avgAgeDays: 0,
  };

  const now = new Date();
  let totalAgeDays = 0;

  matters.forEach((m) => {
    if (m.status === "Open") stats.openMatters++;
    if (m.status === "Closed") stats.closedMatters++;

    // Area of Law
    if (!stats.byAreaOfLaw[m.areaOfLaw]) {
      stats.byAreaOfLaw[m.areaOfLaw] = 0;
    }
    stats.byAreaOfLaw[m.areaOfLaw]++;

    // Priority
    if (stats.byPriority[m.priority] !== undefined) {
      stats.byPriority[m.priority]++;
    }

    // Age
    const opened = new Date(m.dateOpened);
    const diffTime = Math.abs(now - opened);
    totalAgeDays += Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });

  stats.avgAgeDays = Math.round(totalAgeDays / matters.length);

  return stats;
};

/**
 * Calculates Operational Metrics
 */
export const getOperationalMetrics = () => {
  const stats = {
    totalMessages: textRecords.length,
    activityByMatter: {},
    activityByEmployeeType: {
      "In-House": 0,
      Firm: 0,
      Vendor: 0,
    },
    subjectFrequency: {},
  };

  textRecords.forEach((rec) => {
    // Activity by Matter
    const matterName = rec.matterId || "Unassigned";
    if (!stats.activityByMatter[matterName]) {
      stats.activityByMatter[matterName] = 0;
    }
    stats.activityByMatter[matterName]++;

    // Activity by Employee Type
    if (stats.activityByEmployeeType[rec.employeeType] !== undefined) {
      stats.activityByEmployeeType[rec.employeeType]++;
    }

    // Subject Frequency
    if (!stats.subjectFrequency[rec.subject]) {
      stats.subjectFrequency[rec.subject] = 0;
    }
    stats.subjectFrequency[rec.subject]++;
  });

  return stats;
};

/**
 * Anomalies and Inconsistencies
 */
export const getAnomalies = () => {
  const anomalies = [];

  // 1. Invoices without Matter
  invoices.forEach((inv) => {
    if (!inv.matters || inv.matters.length === 0) {
      anomalies.push({
        type: "Data Gap",
        severity: "Medium",
        message: `Invoice ${inv.id} has no linked matters.`,
      });
    }
  });

  // 2. High Variance Savings (Greater than 30% adjustment)
  invoices.forEach((inv) => {
    const amount = parseAmount(inv.amount);
    const original = parseAmount(inv.originalAmount);
    if (original > 0) {
      const rate = (original - amount) / original;
      if (Math.abs(rate) > 0.3) {
        anomalies.push({
          type: "High Adjustment",
          severity: "High",
          message: `Invoice ${inv.id} from ${inv.firm} adjusted by ${Math.round(rate * 100)}%.`,
        });
      }
    }
  });

  // 3. Stale Open Matters (No activity in 12 months - simulated here by lastUpdateDate)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  matters.forEach((m) => {
    if (m.status === "Open" && new Date(m.lastUpdateDate) < oneYearAgo) {
      anomalies.push({
        type: "Stale Matter",
        severity: "Low",
        message: `Matter ${m.id} (${m.name}) has no recent updates.`,
      });
    }
  });

  return anomalies;
};

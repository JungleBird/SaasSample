import { useMemo } from "react";
import { invoices } from "../../../data/invoices/invoices";
import { lineItemsData } from "../../../data/invoices/lineItems";

export const useInvoiceMetrics = () => {
  return useMemo(() => {
    // --- Invoice & Line Item Metrics ---

    // Helper: Map line item codes to full objects
    const lineItemMap = lineItemsData.reduce((acc, item) => {
      acc[item.code] = item;
      return acc;
    }, {});

    // 1. Average number of line-items per invoice by Firm
    const invoicesByFirm = invoices.reduce((acc, inv) => {
      if (!acc[inv.firm]) {
        acc[inv.firm] = { count: 0, totalLineItems: 0 };
      }
      acc[inv.firm].count += 1;
      acc[inv.firm].totalLineItems += inv.lineItems.length;
      return acc;
    }, {});

    const avgLineItemsByFirm = Object.entries(invoicesByFirm)
      .map(([firm, data]) => ({
        firm,
        avgLineItems: parseFloat((data.totalLineItems / data.count).toFixed(2)),
      }))
      .sort((a, b) => b.avgLineItems - a.avgLineItems);

    // 2. Most commonly used line-items across all invoices
    const lineItemCounts = invoices.reduce((acc, inv) => {
      inv.lineItems.forEach((code) => {
        acc[code] = (acc[code] || 0) + 1;
      });
      return acc;
    }, {});

    const topLineItems = Object.entries(lineItemCounts)
      .map(([code, count]) => ({
        code,
        name: lineItemMap[code]?.name || "Unknown",
        type: lineItemMap[code]?.type || "Unknown",
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 3. Average Invoice Amount (Approved vs Pending vs Rejected)
    const amountsByStatus = invoices.reduce((acc, inv) => {
      if (!acc[inv.status]) {
        acc[inv.status] = { count: 0, totalAmount: 0 };
      }
      acc[inv.status].count += 1;
      acc[inv.status].totalAmount += parseFloat(inv.amount);
      return acc;
    }, {});

    const avgAmountByStatus = Object.entries(amountsByStatus).map(
      ([status, data]) => ({
        status,
        avgAmount: parseFloat((data.totalAmount / data.count).toFixed(2)),
        totalAmount: data.totalAmount,
        count: data.count,
      }),
    );

    // 4. Line Item Type Distribution
    const lineItemTypeDistribution = invoices.reduce((acc, inv) => {
      inv.lineItems.forEach((code) => {
        const type = lineItemMap[code]?.type || "Other";
        acc[type] = (acc[type] || 0) + 1;
      });
      return acc;
    }, {});

    // 5. Rejection Rate by Firm
    const rejectionStatsByFirm = invoices.reduce((acc, inv) => {
      if (!acc[inv.firm]) acc[inv.firm] = { total: 0, rejected: 0 };
      acc[inv.firm].total += 1;
      if (inv.status === "Rejected") acc[inv.firm].rejected += 1;
      return acc;
    }, {});

    const rejectionRates = Object.entries(rejectionStatsByFirm)
      .map(([firm, stats]) => ({
        firm,
        rate: parseFloat(((stats.rejected / stats.total) * 100).toFixed(1)),
        totalInvoices: stats.total,
      }))
      .filter((item) => item.totalInvoices > 1)
      .sort((a, b) => b.rate - a.rate);

    return {
      // Invoice Metrics
      avgLineItemsByFirm,
      topLineItems,
      avgAmountByStatus,
      lineItemTypeDistribution,
      rejectionRates,
      totalInvoices: invoices.length,
    };
  }, []);
};

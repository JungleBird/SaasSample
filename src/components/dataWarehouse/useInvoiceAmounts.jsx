import { useMemo } from "react";

const useInvoiceAmounts = (invoice, lineItemsData) => {
  return useMemo(() => {
    if (!invoice) {
      return {
        fullLineItems: [],
        calculatedFees: 0,
        calculatedDisbursements: 0,
        totalCalculatedAmount: 0,
        adjustmentAmount: 0,
      };
    }

    // Map invoice line item codes to full data objects
    const fullLineItems = (invoice.lineItems || [])
      .map((code) => {
        const found = lineItemsData.find(
          (item) => item.code.trim() === code.trim(),
        );
        return found;
      })
      .filter(Boolean);

    // Calculate Totals using robust logic
    const calculatedFees = fullLineItems.reduce((sum, item) => {
      const type = (item.type || "").toLowerCase();
      const rate = Number(item.rate || 0);
      // Include anything that isn't explicitly a disbursement as a fee
      return type !== "disbursement" ? sum + rate : sum;
    }, 0);

    const calculatedDisbursements = fullLineItems.reduce((sum, item) => {
      const type = (item.type || "").toLowerCase();
      const rate = Number(item.rate || 0);
      return type === "disbursement" ? sum + rate : sum;
    }, 0);

    const totalCalculatedAmount = calculatedFees + calculatedDisbursements;

    // Parse numeric amount from "X,XXX.XX USD" format
    const invoiceAmountNumeric = parseFloat(
      invoice.amount.replace(/,/g, "").replace(/[^\d.-]/g, ""),
    );
    const adjustmentAmount = invoiceAmountNumeric - totalCalculatedAmount;

    return {
      fullLineItems,
      calculatedFees,
      calculatedDisbursements,
      totalCalculatedAmount,
      adjustmentAmount,
    };
  }, [invoice, lineItemsData]);
};

export default useInvoiceAmounts;

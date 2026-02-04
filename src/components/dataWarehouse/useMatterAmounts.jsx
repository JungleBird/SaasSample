import { useMemo } from "react";
import { invoices } from "../../data/invoices/invoices";

/**
 * Hook to calculate total amounts for matters based on assigned invoices
 * @param {Array} matters - Array of matter objects
 * @returns {Object} Map of matter IDs to their calculated amounts
 */
const useMatterAmounts = (matters) => {
  return useMemo(() => {
    if (!matters || matters.length === 0) {
      return {};
    }

    const matterAmounts = {};

    matters.forEach((matter) => {
      // Find all invoices that reference this matter
      const relatedInvoices = invoices.filter((invoice) =>
        invoice.matters?.some((matterString) =>
          matterString.includes(matter.id)
        )
      );

      // Sum up the amounts from all related invoices
      const totalAmount = relatedInvoices.reduce((sum, invoice) => {
        // Parse numeric amount from "X,XXX.XX" or "X,XXX.XX USD" format
        const numericAmount = parseFloat(
          invoice.amount.replace(/,/g, "").replace(/[^\d.-]/g, "")
        );
        return sum + (isNaN(numericAmount) ? 0 : numericAmount);
      }, 0);

      matterAmounts[matter.id] = totalAmount;
    });

    return matterAmounts;
  }, [matters]);
};

export default useMatterAmounts;

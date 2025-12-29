import { apiFetch } from "../lib/api";

export const analyticsService = {
  /**
   * Get sales analytics for a date range
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @param {number|null} shopId - Optional shop ID filter
   */
  getSalesAnalytics: async (startDate, endDate, shopId = null) => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    if (shopId) {
      params.append("shopId", shopId);
    }

    return await apiFetch(`/sales/analytics?${params.toString()}`);
  },

  /**
   * Get expense analytics for a date range
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @param {number|null} shopId - Optional shop ID filter
   */
  getExpenseAnalytics: async (startDate, endDate, shopId = null) => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    if (shopId) {
      params.append("shopId", shopId);
    }

    return await apiFetch(`/expenses/analytics?${params.toString()}`);
  },
};

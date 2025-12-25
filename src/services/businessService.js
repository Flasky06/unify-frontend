import { apiFetch } from "../lib/api";

export const businessService = {
  /**
   * Get authenticated user's business
   */
  getMyBusiness: async () => {
    return await apiFetch("/business/me");
  },

  /**
   * Create business for authenticated user
   */
  createBusiness: async (businessData) => {
    return await apiFetch("/business", {
      method: "POST",
      body: businessData,
    });
  },

  /**
   * Update authenticated user's business
   */
  updateBusiness: async (businessData) => {
    return await apiFetch("/business/me", {
      method: "PUT",
      body: businessData,
    });
  },
};

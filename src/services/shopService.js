import { apiFetch } from "../lib/api";

export const shopService = {
  // Get all shops
  getAll: async () => {
    return await apiFetch("/shops");
  },

  // Get single shop
  getById: async (id) => {
    return await apiFetch(`/shops/${id}`);
  },

  // Create shop
  create: async (data) => {
    return await apiFetch("/shops", {
      method: "POST",
      body: data,
    });
  },

  // Update shop
  update: async (id, data) => {
    return await apiFetch(`/shops/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  // Delete shop
  delete: async (id) => {
    return await apiFetch(`/shops/${id}`, {
      method: "DELETE",
    });
  },
};

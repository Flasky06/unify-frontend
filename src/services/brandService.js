import { apiFetch } from "../lib/api";

export const brandService = {
  // Get all brands
  getAll: async () => {
    return await apiFetch("/brands");
  },

  // Get single brand
  getById: async (id) => {
    return await apiFetch(`/brands/${id}`);
  },

  // Create brand
  create: async (data) => {
    return await apiFetch("/brands", {
      method: "POST",
      body: data,
    });
  },

  // Update brand
  update: async (id, data) => {
    return await apiFetch(`/brands/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  // Delete brand
  delete: async (id) => {
    return await apiFetch(`/brands/${id}`, {
      method: "DELETE",
    });
  },
};

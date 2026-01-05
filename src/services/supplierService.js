import { apiFetch } from "../lib/api";

export const supplierService = {
  // Get all suppliers
  getAll: async () => {
    return await apiFetch("/suppliers");
  },

  // Get single supplier
  getById: async (id) => {
    return await apiFetch(`/suppliers/${id}`);
  },

  // Create supplier
  create: async (data) => {
    return await apiFetch("/suppliers", {
      method: "POST",
      body: data,
    });
  },

  // Update supplier
  update: async (id, data) => {
    return await apiFetch(`/suppliers/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  // Delete supplier
  delete: async (id) => {
    return await apiFetch(`/suppliers/${id}`, {
      method: "DELETE",
    });
  },
};

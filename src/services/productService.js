import { apiFetch } from "../lib/api";

export const productService = {
  // Get all products
  getAll: async () => {
    return await apiFetch("/products");
  },

  // Get active products only
  getActive: async () => {
    return await apiFetch("/products/active");
  },

  // Get single product
  getById: async (id) => {
    return await apiFetch(`/products/${id}`);
  },

  // Create product
  create: async (data) => {
    return await apiFetch("/products", {
      method: "POST",
      body: data,
    });
  },

  // Update product
  update: async (id, data) => {
    return await apiFetch(`/products/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  // Delete product
  delete: async (id) => {
    return await apiFetch(`/products/${id}`, {
      method: "DELETE",
    });
  },
};

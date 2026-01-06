import { apiFetch } from "../lib/api";

export const purchaseOrderService = {
  // Get all purchase orders
  getAll: async () => {
    return await apiFetch("/purchase-orders");
  },

  // Get single purchase order
  getById: async (id) => {
    return await apiFetch(`/purchase-orders/${id}`);
  },

  // Get purchase orders by supplier
  getBySupplier: async (supplierId) => {
    return await apiFetch(`/purchase-orders/supplier/${supplierId}`);
  },

  // Get purchase orders by status
  getByStatus: async (status) => {
    return await apiFetch(`/purchase-orders/status/${status}`);
  },

  // Create purchase order
  create: async (data) => {
    return await apiFetch("/purchase-orders", {
      method: "POST",
      body: data,
    });
  },

  // Update purchase order
  update: async (id, data) => {
    return await apiFetch(`/purchase-orders/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  // Record payment
  recordPayment: async (id, data) => {
    return await apiFetch(`/purchase-orders/${id}/payment`, {
      method: "POST",
      body: data,
    });
  },

  // Cancel purchase order
  cancel: async (id) => {
    return await apiFetch(`/purchase-orders/${id}/cancel`, {
      method: "POST",
    });
  },

  // Delete purchase order
  delete: async (id) => {
    return await apiFetch(`/purchase-orders/${id}`, {
      method: "DELETE",
    });
  },
};

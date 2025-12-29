import { apiFetch } from "../lib/api";

export const paymentMethodService = {
  getAll: async () => {
    return await apiFetch("/payment-methods");
  },

  getById: async (id) => {
    return await apiFetch(`/payment-methods/${id}`);
  },

  create: async (data) => {
    return await apiFetch("/payment-methods", {
      method: "POST",
      body: data,
    });
  },

  update: async (id, data) => {
    return await apiFetch(`/payment-methods/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  delete: async (id) => {
    await apiFetch(`/payment-methods/${id}`, {
      method: "DELETE",
    });
  },
};

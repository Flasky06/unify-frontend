import api from "./api";

export const paymentMethodService = {
  getAll: async () => {
    const response = await api.get("/payment-methods");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/payment-methods/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/payment-methods", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/payment-methods/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/payment-methods/${id}`);
  },
};

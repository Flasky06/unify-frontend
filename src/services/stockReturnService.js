import { api } from "../lib/api";

export const stockReturnService = {
  getAll: (shopId) => api.get(`/stock-returns?shopId=${shopId}`),
  create: (data) => api.post("/stock-returns", data),
  getTypes: () =>
    Promise.resolve(["CUSTOMER_RETURN", "SUPPLIER_RETURN", "DAMAGED"]), // Since we know the enum values
};

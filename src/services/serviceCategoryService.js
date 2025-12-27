import { api } from "../lib/api";

export const serviceCategoryService = {
  getAll: (businessId) =>
    api.get(`/businesses/${businessId}/service-categories`),
  getById: (id) => api.get(`/service-categories/${id}`),
  create: (businessId, data) =>
    api.post(`/businesses/${businessId}/service-categories`, data),
  update: (id, data) => api.put(`/service-categories/${id}`, data),
  delete: (id) => api.delete(`/service-categories/${id}`),
};

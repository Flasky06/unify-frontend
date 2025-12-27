import { api } from "../lib/api";

export const serviceProductService = {
  getAll: (businessId, categoryId = null) => {
    let url = `/businesses/${businessId}/services`;
    if (categoryId) {
      url += `?categoryId=${categoryId}`;
    }
    return api.get(url);
  },
  getById: (id) => api.get(`/services/${id}`),
  create: (businessId, data) =>
    api.post(`/businesses/${businessId}/services`, data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

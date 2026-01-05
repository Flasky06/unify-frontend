import { apiFetch } from "../lib/api";

export const salaryService = {
  async getAll() {
    return await apiFetch("/salaries");
  },

  async getById(id) {
    return await apiFetch(`/salaries/${id}`);
  },

  async getByEmployee(employeeId) {
    return await apiFetch(`/salaries/employee/${employeeId}`);
  },

  async create(data) {
    return await apiFetch("/salaries", {
      method: "POST",
      body: data,
    });
  },

  async update(id, data) {
    return await apiFetch(`/salaries/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  async void(id) {
    return await apiFetch(`/salaries/${id}/void`, {
      method: "POST",
    });
  },

  async delete(id) {
    return await apiFetch(`/salaries/${id}`, {
      method: "DELETE",
    });
  },
};

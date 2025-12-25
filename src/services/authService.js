import { api, apiFetch } from "../lib/api";

export const authService = {
  /**
   * Login user - sends credentials as Basic Auth
   */
  login: async (credentials) => {
    // Send credentials in body
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: credentials,
    });
    return data;
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    const data = await api.post("/auth/register", userData);
    return data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Ignore logout errors
      console.error("Logout error:", error);
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const data = await api.get("/users/me");
    return data;
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async () => {
    const data = await api.post("/auth/refresh");
    return data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email) => {
    const data = await api.post("/auth/forgot-password", { email });
    return data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, newPassword) => {
    const data = await api.post("/auth/reset-password", { token, newPassword });
    return data;
  },
};

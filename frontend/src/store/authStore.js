import { create } from 'zustand';
import { authApi } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await authApi.login(credentials);
      set({ 
        user: data.data.user, 
        isAuthenticated: true,
        error: null 
      });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isAuthenticated: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  getProfile: async () => {
    try {
      set({ isLoading: true });
      const { data } = await authApi.getProfile();
      set({ user: data.data, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useAuthStore;

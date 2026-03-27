import { create } from 'zustand';
import api from '../shared/api-client';

/**
 * FUTURE-PROOF: Centralized Zustand Store for Item Management
 * Eliminates duplicate fetch calls and prop drilling.
 */
const useItemStore = create((set, get) => ({
  items: [],
  meta: { total: 0, page: 1, lastPage: 0 },
  isLoading: false,
  error: null,

  fetchItems: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/items?page=${page}&limit=${limit}`);
      set({ 
        items: data.data, 
        meta: data.meta, 
        isLoading: false 
      });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Failed to fetch items', 
        isLoading: false 
      });
    }
  },

  handleBulkDelete: async (ids) => {
    try {
      await api.post('/items/delete-selected', { ids });
      // Optimized: Optimistic update or refresh current page
      get().fetchItems(get().meta.page);
    } catch (err) {
      set({ error: 'Delete operation failed' });
    }
  }
}));

export default useItemStore;

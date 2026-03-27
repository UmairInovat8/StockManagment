import { create } from 'zustand';
import api from '../lib/api';

/**
 * Multi-Catalog Zustand Store
 * Manages item masters and catalog-scoped item fetching.
 */
const useItemStore = create((set, get) => ({
  items: [],
  masters: [],
  companies: [],
  selectedMasterId: localStorage.getItem('selectedMasterId') || null,
  meta: { total: 0, page: 1, lastPage: 0 },
  isLoading: false,
  error: null,

  setSelectedMasterId: (id) => {
    localStorage.setItem('selectedMasterId', id);
    set({ selectedMasterId: id });
  },

  fetchMasters: async () => {
    try {
      const { data } = await api.get('/items/masters');
      set({ masters: data });
      if (data.length > 0 && !get().selectedMasterId) {
        get().setSelectedMasterId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch masters', err);
    }
  },

  fetchCompanies: async () => {
    try {
      const { data } = await api.get('/brands');
      // Map brandName/brandCode to companyName/companyCode to avoid UI changes if possible, 
      // or just pass as is and update UI. We'll map to maintain compatibility.
      const mapped = data.map(b => ({
        id: b.id,
        companyName: b.brandName || b.name,
        companyCode: b.brandCode || b.code
      }));
      set({ companies: mapped });
    } catch (err) {
      console.error('Failed to fetch companies (brands)', err);
    }
  },

  createMaster: async (name, tenantId) => {
    try {
      const { data } = await api.post('/items/masters', { name, ...(tenantId && { tenantId }) });
      set(state => ({ masters: [...state.masters, data] }));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create catalog';
      console.error('Failed to create master', msg);
      throw new Error(msg);
    }
  },

  fetchItems: async (page = 1, limit = 20, search = '') => {
    const masterId = get().selectedMasterId;
    if (!masterId && get().masters.length === 0) {
      // If we don't have masters yet, fetch them first
      await get().fetchMasters();
    }
    
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/items', {
        params: { 
            itemMasterId: get().selectedMasterId || undefined,
            page, 
            limit, 
            search: search || undefined 
        }
      });
      set({ 
        items: data.items, 
        meta: {
            total: Number(data.total) || 0,
            page: Number(data.page) || 1,
            lastPage: Number(data.pages) || 1
        }, 
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
      get().fetchItems(get().meta.page);
    } catch (err) {
      set({ error: 'Delete operation failed' });
    }
  },

  deleteAllItems: async () => {
    const masterId = get().selectedMasterId;
    if (!masterId) return;
    set({ isLoading: true, error: null });
    try {
      await api.delete('/items/all', { params: { itemMasterId: masterId } });
      await get().fetchItems(1);
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Failed to clear catalog',
        isLoading: false 
      });
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useItemStore;

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const useAuditStore = create(
    persist(
        (set, get) => ({
            assignedSections: [],
            eventQueue: [], // { id, auditId, sectionId, itemId, quantity, timestamp }
            isSyncing: false,

            setAssignedSections: (sections) => set({ assignedSections: sections }),

            // Add a count event to the queue
            addCountEvent: (event) => {
                const newEvent = {
                    ...event,
                    id: Math.random().toString(36).substring(7),
                    timestamp: new Date().toISOString(),
                };
                set((state) => ({ eventQueue: [...state.eventQueue, newEvent] }));
                get().syncQueue();
            },

            // Attempt to sync the queue with the backend
            syncQueue: async () => {
                const { eventQueue, isSyncing } = get();
                if (isSyncing || eventQueue.length === 0) return;

                set({ isSyncing: true });

                const remainingEvents = [...eventQueue];
                const failedEvents = [];

                for (const event of remainingEvents) {
                    try {
                        // In reality, this would be a PATCH to specific audit/section/item
                        // Mocking the API call to the backend
                        await api.post(`/audits/${event.auditId}/sections/${event.sectionId}/counts`, {
                            itemId: event.itemId,
                            quantity: event.quantity,
                        });
                    } catch (e) {
                        console.warn('Sync failed for event', event.id, e.message);
                        failedEvents.push(event);
                    }
                }

                set({ eventQueue: failedEvents, isSyncing: false });
            },

            // Fetch assigned tasks from the server
            refreshTasks: async () => {
                try {
                    const res = await api.get('/audits/my-assignments');
                    set({ assignedSections: res.data });
                } catch (e) {
                    console.error('Failed to fetch assignments', e.message);
                }
            },
        }),
        {
            name: 'audit-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useAuditStore;

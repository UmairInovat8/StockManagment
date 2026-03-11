import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// Note: In a real mobile environment, localhost refers to the device itself.
// For Android Emulator, use 10.0.2.2. For physical devices, use the computer's local IP.
const API_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

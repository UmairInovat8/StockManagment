import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    timeout: 30000, // 30s timeout for future-proofing large uploads
    headers: {
        'Content-Type': 'application/json',
    }
});

// Future-Proof Request Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Future-Proof Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'A network error occurred';

        // Notify the Global State or trigger an Event
        if (status === 401) {
            window.dispatchEvent(new CustomEvent('AUTH_EXPIRED'));
        } else if (status === 403) {
            window.dispatchEvent(new CustomEvent('FORBIDDEN_ACCESS', { detail: { message } }));
        } else if (status >= 500) {
            window.dispatchEvent(new CustomEvent('SERVER_FAILURE', { detail: { message } }));
        }

        return Promise.reject(error);
    }
);

export default api;

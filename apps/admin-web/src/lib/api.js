import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api',
    timeout: 60000, 
    // Removed hardcoded Content-Type to allow automatic multipart boundary handling
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    window.dispatchEvent(new CustomEvent('GLOBAL_LOADING', { detail: { loading: true } }));
    return config;
}, (error) => {
    window.dispatchEvent(new CustomEvent('GLOBAL_LOADING', { detail: { loading: false } }));
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => {
        window.dispatchEvent(new CustomEvent('GLOBAL_LOADING', { detail: { loading: false } }));
        return response;
    },
    (error) => {
        const { status, data } = error.response || {};
        const message = data?.message || error.message || 'A network error occurred';
        const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
        
        if (status === 401 && !isAuthRoute) {
            window.dispatchEvent(new CustomEvent('AUTH_EXPIRED'));
        } else if (status === 403) {
            window.dispatchEvent(new CustomEvent('FORBIDDEN_ACCESS', { detail: { message } }));
        } else if (status >= 500) {
            window.dispatchEvent(new CustomEvent('SERVER_FAILURE', { detail: { message } }));
        }

        window.dispatchEvent(new CustomEvent('GLOBAL_LOADING', { detail: { loading: false } }));
        return Promise.reject(error);
    }
);

export default api;

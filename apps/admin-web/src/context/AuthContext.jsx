import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Basic token decode or fetch user profile
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setUser(storedUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);

        // Global interceptor for 401 Unauthorized responses
        const interceptor = axios.interceptors.response.use(
            (res) => res,
            (err) => {
                if (err.response && err.response.status === 401) {
                    alert('Your secure session has expired. Please log in again to continue.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    delete axios.defaults.headers.common['Authorization'];
                    setUser(null);
                    window.location.href = '/login';
                }
                return Promise.reject(err);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (email, password) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
            if (response.data && response.data.access_token) {
                const { access_token, user: userData } = response.data;
                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(userData));
                axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                setUser(userData);
                return true;
            } else {
                console.error('Login response missing access_token', response.data);
                return false;
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            return false;
        }
    };

    const register = async (data) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await axios.post(`${apiUrl}/auth/register`, data);

            if (response.data && response.data.access_token) {
                const { access_token, user: userData } = response.data;
                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(userData));
                axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                setUser(userData);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            return false;
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

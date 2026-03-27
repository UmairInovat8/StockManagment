import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import AuthAlert from '../components/AuthAlert';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showExpiryAlert, setShowExpiryAlert] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setUser(storedUser);
        }
        setLoading(false);

        // Listen for global expiry event from api.js
        const onAuthExpired = () => {
            setShowExpiryAlert(true);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        };

        window.addEventListener('AUTH_EXPIRED', onAuthExpired);
        return () => window.removeEventListener('AUTH_EXPIRED', onAuthExpired);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data && response.data.access_token) {
                const { access_token, user: userData } = response.data;
                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            return false;
        }
    };

    const register = async (data) => {
        try {
            const response = await api.post('/auth/register', data);
            if (response.data && response.data.access_token) {
                const { access_token, user: userData } = response.data;
                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return true;
            }
            return false;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Registration failed';
            console.error('Registration failed:', message);
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
            {showExpiryAlert && (
                <AuthAlert onLogin={() => {
                    setShowExpiryAlert(false);
                    window.location.href = '/login';
                }} />
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

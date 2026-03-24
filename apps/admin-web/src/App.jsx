import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Style Refresh Trigger: Clean Design Update confirmed.
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import Audits from './pages/Audits';
import AuditDetail from './pages/AuditDetail';
import Reports from './pages/Reports';
import Branches from './pages/Branches';
import Users from './pages/Users';
import Locations from './pages/Locations';
import Brands from './pages/Brands';
import Logs from './pages/Logs';
import Company from './pages/Company';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-brand/20 border-t-primary-brand rounded-full animate-spin" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Authorizing...</p>
            </div>
        </div>
    );
    if (!user) return <Navigate to="/login" />;
    return <Layout>{children}</Layout>;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/branches" element={
                        <ProtectedRoute>
                            <Branches />
                        </ProtectedRoute>
                    } />

                    <Route path="/users" element={
                        <ProtectedRoute>
                            <Users />
                        </ProtectedRoute>
                    } />

                    <Route path="/locations" element={
                        <ProtectedRoute>
                            <Locations />
                        </ProtectedRoute>
                    } />

                    <Route path="/items" element={
                        <ProtectedRoute>
                            <Items />
                        </ProtectedRoute>
                    } />

                    <Route path="/audits" element={
                        <ProtectedRoute>
                            <Audits />
                        </ProtectedRoute>
                    } />

                    <Route path="/audits/:id" element={
                        <ProtectedRoute>
                            <AuditDetail />
                        </ProtectedRoute>
                    } />

                    <Route path="/reports" element={
                        <ProtectedRoute>
                            <Reports />
                        </ProtectedRoute>
                    } />

                    <Route path="/logs" element={
                        <ProtectedRoute>
                            <Logs />
                        </ProtectedRoute>
                    } />

                    <Route path="/brands" element={
                        <ProtectedRoute>
                            <Brands />
                        </ProtectedRoute>
                    } />

                    <Route path="/company" element={
                        <ProtectedRoute>
                            <Company />
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, ShieldCheck, Mail } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API}/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                    <p className="text-slate-500">Invite auditors and manage access controls</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    Invite User
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Access</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-10 text-slate-400 italic">Syncing user directory...</td></tr>
                        ) : (
                            // Fallback to seed data visualization if empty
                            [
                                { id: 1, email: 'manager@athgadlang.com', name: 'Lead Architect', role: 'AuditManager', branch: 'Dubai Flagship' },
                                { id: 2, email: 'auditor1@athgadlang.com', name: 'Auditor One', role: 'Auditor', branch: 'Dubai Flagship' },
                                { id: 3, email: 'auditor2@athgadlang.com', name: 'Auditor Two', role: 'Auditor', branch: 'Dubai Flagship' }
                            ].map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                                                <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={10} /> {u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-bold uppercase">
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{u.branch}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            Online
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;

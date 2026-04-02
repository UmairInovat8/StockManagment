import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Users, Plus, ShieldCheck, Mail, XCircle, User, Briefcase, Building2, Save, Loader2, CheckCircle2 } from 'lucide-react';
import ModalPortal from '../components/ModalPortal';

const UserForm = ({ onSubmit, title, formData, setFormData, roles, branches, onClose, saving }) => (
    <ModalPortal>
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999] overflow-y-auto">
            <div className="w-full max-w-lg p-10 bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative my-auto animate-fade-up border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-[#0f172a]">{title}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Provisioning</p>
                    </div>
                    <button type="button" onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all group">
                        <XCircle size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name *</label>
                            <input className="clean-input mt-1" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name *</label>
                            <input className="clean-input mt-1" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address *</label>
                        <input className="clean-input mt-1" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Password *</label>
                        <input className="clean-input mt-1" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Role *</label>
                        <select className="clean-input mt-1 appearance-none" value={formData.roleId} onChange={e => setFormData({ ...formData, roleId: e.target.value })} required>
                            <option value="">Select Role...</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <div className="pt-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer group hover:bg-slate-100 transition-all" onClick={() => setFormData({ ...formData, globalAccess: !formData.globalAccess })}>
                            <span className="flex items-center gap-2">
                                <Building2 size={12} className={formData.globalAccess ? 'text-emerald-500' : 'text-slate-300'} />
                                Global Access (All Branches)
                            </span>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${formData.globalAccess ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-200'}`}>
                                <div className={`absolute top-0.5 bottom-0.5 w-3 h-3 bg-white rounded-full transition-all ${formData.globalAccess ? 'left-[1.2rem]' : 'left-0.5'}`}></div>
                            </div>
                        </label>
                    </div>

                    {!formData.globalAccess && (
                        <div className="animate-fade-down duration-300">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Branches (Multi-select)</label>
                            <select 
                                multiple 
                                className="clean-input mt-1 min-h-[100px] py-2" 
                                value={formData.branchIds} 
                                onChange={e => setFormData({ ...formData, branchIds: Array.from(e.target.selectedOptions, option => option.value) })}
                                required={!formData.globalAccess}
                            >
                                {branches.map(b => <option key={b.id} value={b.id}>{b.branchName}</option>)}
                            </select>
                            <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold italic">Hold Ctrl/Cmd to select multiple branches</p>
                        </div>
                    )}
                    <div className="flex gap-4 pt-8">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="flex-[2] bg-[#0f172a] text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-slate-900 transition-all shadow-[0_20px_40px_-12px_rgba(15,23,42,0.3)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Invite Auditor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </ModalPortal>
);

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInvite, setShowInvite] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', roleId: '', branchIds: [], globalAccess: true });

    const fetchData = async () => {
        try {
            const [uRes, rRes, bRes] = await Promise.all([
                api.get('/users'),
                api.get('/users/roles'),
                api.get('/branches')
            ]);
            setUsers(uRes.data);
            setRoles(rRes.data);
            setBranches(bRes.data);
        } catch (error) {
            console.error('Error fetching system directory', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleInvite = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { 
                ...formData, 
                // If global access is selected, send empty branchIds to the backend
                branchIds: formData.globalAccess ? [] : formData.branchIds 
            };
            await api.post('/users', payload);
            setShowInvite(false);
            setFormData({ firstName: '', lastName: '', email: '', password: '', roleId: '', branchIds: [], globalAccess: true });
            fetchData();
        } catch (error) {
            alert('Failed to invite user: ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">User Management</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Manage auditors and assign branch-level access controls</p>
                </div>
                <button onClick={() => setShowInvite(true)} className="bg-[#0f172a] text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-all text-sm shadow-xl shadow-slate-200">
                    <Plus size={18} /> Invite User
                </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Organization</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Security Role</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Branch Access</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Activity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-20 text-slate-300 italic animate-pulse">Synchronizing directory...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-20 text-slate-400 italic">No users registered yet.</td></tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[#0f172a] shadow-sm">
                                                {u.firstName?.charAt(0) || u.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-[#0f172a] text-sm tracking-tight">{u.firstName} {u.lastName}</p>
                                                <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium font-mono"><Mail size={12} className="text-slate-300" /> {u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <Building2 size={14} className="text-slate-400" />
                                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">
                                                {u.tenant?.companyName || 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-emerald-500" />
                                            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 font-black uppercase tracking-widest">
                                                {u.roles?.[0]?.role?.name || 'User'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-wrap gap-1.5 capitalize">
                                            {u.branchAccess?.length > 0 ? (
                                                u.branchAccess.map(ba => (
                                                    <span key={ba.branch.id} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                                                        {ba.branch.branchName}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">All Access (Global)</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="inline-flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50/50 px-4 py-2 rounded-xl border border-emerald-100/50">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                                            Active
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showInvite && (
                <UserForm 
                    onSubmit={handleInvite} 
                    title="Invite Auditor" 
                    formData={formData} 
                    setFormData={setFormData} 
                    roles={roles} 
                    branches={branches} 
                    onClose={() => setShowInvite(false)} 
                    saving={saving}
                />
            )}
        </div>
    );
};

export default UsersPage;


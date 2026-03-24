import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, Save, Tag, Hash, Package, GitBranch, Users, ClipboardCheck, Loader2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-black text-[#0f172a]">{value}</p>
        </div>
    </div>
);

const Company = () => {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ company_name: '', company_code: '' });
    const [editMode, setEditMode] = useState(false);

    const fetchCompany = async () => {
        try {
            const res = await axios.get(`${API}/tenant`);
            setCompany(res.data);
            setFormData({
                company_name: res.data.company_name || '',
                company_code: res.data.company_code || '',
            });
        } catch (error) {
            console.error('Error fetching company profile', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCompany(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.patch(`${API}/tenant`, formData);
            setCompany(res.data);
            setEditMode(false);
        } catch (error) {
            alert('Failed to update company: ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Company Profile</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">
                        Holding company details — top level of the hierarchy
                    </p>
                </div>
                {!editMode && (
                    <button
                        onClick={() => setEditMode(true)}
                        className="bg-[#0f172a] text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-all text-sm shadow-xl shadow-slate-200"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Hierarchy Breadcrumb */}
            <div className="flex items-center gap-3 text-sm text-slate-500 bg-white border border-slate-100 rounded-2xl px-6 py-4">
                <Building2 size={16} className="text-[#38bdf8]" />
                <span className="font-bold">Hierarchy:</span>
                <span className="font-black text-[#0f172a]">Company (Tenant)</span>
                <span className="text-slate-300">→</span>
                <span>Brand / Sub-Entity</span>
                <span className="text-slate-300">→</span>
                <span>Branch</span>
            </div>

            {/* Stats */}
            {company?._count && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <StatCard icon={Tag} label="Brands" value={company._count.brands} color="bg-violet-50 text-violet-500" />
                    <StatCard icon={GitBranch} label="Branches" value={company._count.branches} color="bg-blue-50 text-blue-500" />
                    <StatCard icon={Package} label="Items" value={company._count.items} color="bg-emerald-50 text-emerald-500" />
                    <StatCard icon={ClipboardCheck} label="Audits" value={company._count.audits} color="bg-amber-50 text-amber-500" />
                    <StatCard icon={Users} label="Users" value={company._count.users} color="bg-rose-50 text-rose-500" />
                </div>
            )}

            {/* Company Details Card */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm">
                {editMode ? (
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Name *</label>
                                <input
                                    className="clean-input mt-1"
                                    value={formData.company_name}
                                    onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                    placeholder="e.g. athGadlang Holdings"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Code *</label>
                                <input
                                    className="clean-input mt-1 font-mono"
                                    value={formData.company_code}
                                    onChange={e => setFormData({ ...formData, company_code: e.target.value })}
                                    placeholder="e.g. ATHG-001"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => { setEditMode(false); setFormData({ company_name: company.company_name, company_code: company.company_code }); }}
                                className="flex-1 py-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-[2] bg-[#0f172a] text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-slate-900 transition-all shadow-[0_20px_40px_-12px_rgba(15,23,42,0.3)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <Building2 size={32} className="text-[#0f172a]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">{company?.company_name}</h2>
                                <p className="text-sm font-mono text-slate-400 mt-1">{company?.company_code}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 border-t border-slate-50 pt-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company Name</p>
                                <p className="text-sm font-bold text-[#0f172a]">{company?.company_name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company Code</p>
                                <p className="text-sm font-mono font-bold text-[#0f172a]">{company?.company_code}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tenant ID</p>
                                <p className="text-xs font-mono text-slate-400">{company?.id}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Created</p>
                                <p className="text-sm text-slate-500">{company?.createdAt ? new Date(company.createdAt).toLocaleDateString() : '—'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Company;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, MapPin, Phone, User, Settings, Edit2, Trash2, XCircle, ChevronRight, Globe, Tag, Building2, Pencil } from 'lucide-react';
import ModalPortal from '../components/ModalPortal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const BranchForm = ({ onSubmit, title, formData, setFormData, brands, onClose }) => (
    <ModalPortal>
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999] overflow-y-auto">
            <div
                className="w-full max-w-lg p-10 bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative my-auto animate-fade-up border border-white/20"
                onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); onSubmit(e); } }}
            >
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-[#0f172a]">{title}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry Verification Required</p>
                    </div>
                    <button type="button" onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all group">
                        <XCircle size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch Name *</label>
                            <input className="clean-input mt-1" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch Code *</label>
                            <input className="clean-input mt-1 font-mono" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} required />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent Brand / Sub-Entity *</label>
                        <select className="clean-input mt-1 appearance-none" value={formData.brandId} onChange={e => setFormData({ ...formData, brandId: e.target.value })} required>
                            <option value="">Select Brand...</option>
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                        <select className="clean-input mt-1" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="Active">Active</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Point of Contact (POC)</label>
                        <input className="clean-input mt-1" value={formData.poc} onChange={e => setFormData({ ...formData, poc: e.target.value })} placeholder="Name, Phone" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Physical Address</label>
                        <textarea className="clean-input mt-1" rows={2} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No. of Resources</label>
                            <input className="clean-input mt-1" type="number" min="0" value={formData.resources} onChange={e => setFormData({ ...formData, resources: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Counters</label>
                            <input className="clean-input mt-1" type="number" min="0" value={formData.counters} onChange={e => setFormData({ ...formData, counters: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shelves</label>
                            <input className="clean-input mt-1" type="number" min="0" value={formData.shelves} onChange={e => setFormData({ ...formData, shelves: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gondolas</label>
                            <input className="clean-input mt-1" type="number" min="0" value={formData.gondolas} onChange={e => setFormData({ ...formData, gondolas: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex gap-4 pt-8">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95">Discard</button>
                        <button type="submit" className="flex-[2] bg-[#0f172a] text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-slate-900 transition-all shadow-[0_20px_40px_-12px_rgba(15,23,42,0.3)] active:scale-95">
                            Commit Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </ModalPortal>
);

const Branches = () => {
    const [branches, setBranches] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editBranch, setEditBranch] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '', brandId: '', status: 'Active', poc: '', address: '', resources: '', counters: '', shelves: '', gondolas: '' });

    const fetchBranches = async () => {
        try {
            const [bRes, brRes] = await Promise.all([
                axios.get(`${API}/branches`),
                axios.get(`${API}/brands`)
            ]);
            setBranches(bRes.data);
            setBrands(brRes.data);
        } catch (error) {
            console.error('Error fetching branches/brands', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBranches(); }, []);

    const resetForm = () => setFormData({ name: '', code: '', brandId: '', status: 'Active', poc: '', address: '', resources: '', counters: '', shelves: '', gondolas: '' });

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/branches`, formData);
            setShowCreate(false);
            resetForm();
            fetchBranches();
        } catch (error) {
            alert('Failed to create branch: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`${API}/branches/${editBranch.id}`, formData);
            setEditBranch(null);
            resetForm();
            fetchBranches();
        } catch (error) {
            alert('Failed to update branch: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this branch?')) return;
        try {
            await axios.delete(`${API}/branches/${id}`);
            fetchBranches();
        } catch (error) {
            alert('Failed to delete branch.');
        }
    };

    const openEdit = (branch) => {
        setEditBranch(branch);
        setFormData({
            name: branch.name || '',
            code: branch.code || '',
            brandId: branch.brandId || '',
            status: branch.status || 'Active',
            poc: branch.poc || '',
            address: branch.address || '',
            resources: branch.resources || '',
            counters: branch.counters || '',
            shelves: branch.shelves || '',
            gondolas: branch.gondolas || '',
        });
    };

    const closeForm = () => {
        setShowCreate(false);
        setEditBranch(null);
        resetForm();
    };

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Branch Management</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Configure organizational units and outlet profiles</p>
                </div>
                <button onClick={() => setShowCreate(true)} className="bg-[#0f172a] text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-all text-sm shadow-xl shadow-slate-200">
                    <Plus size={18} /> Add Branch
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-slate-400 italic">Loading branches...</div>
                ) : branches.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-400 italic">No branches configured yet.</div>
                ) : (
                    branches.map((branch) => (
                        <div key={branch.id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:-translate-y-1 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <Building2 size={24} className="text-[#0f172a]" />
                                </div>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${branch.status === 'Closed' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                    {branch.status || 'Active'}
                                </span>
                            </div>
                            <h3 className="font-black text-[#0f172a] text-lg tracking-tight">{branch.name}</h3>
                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">Code: {branch.code}</p>
                            {branch.poc && <p className="text-xs text-slate-500 mt-2 font-medium">POC: {branch.poc}</p>}
                            {branch.address && <p className="text-xs text-slate-400 mt-1">{branch.address}</p>}
                            {(branch.counters || branch.shelves || branch.gondolas) && (
                                <div className="mt-4 flex gap-3 text-[10px] font-black text-slate-300 uppercase tracking-widest border-t border-slate-50 pt-4">
                                    {branch.counters && <span>Counters: {branch.counters}</span>}
                                    {branch.shelves && <span>Shelves: {branch.shelves}</span>}
                                    {branch.gondolas && <span>Gondolas: {branch.gondolas}</span>}
                                </div>
                            )}
                            <div className="flex gap-2 mt-6 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => openEdit(branch)} className="flex-1 py-2 text-xs font-black text-slate-500 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-1"><Pencil size={12} /> Edit</button>
                                <button onClick={() => handleDelete(branch.id)} className="flex-1 py-2 text-xs font-black text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-1"><Trash2 size={12} /> Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showCreate && <BranchForm onSubmit={handleCreate} title="Create New Branch" formData={formData} setFormData={setFormData} brands={brands} onClose={closeForm} />}
            {editBranch && <BranchForm onSubmit={handleEdit} title="Edit Branch" formData={formData} setFormData={setFormData} brands={brands} onClose={closeForm} />}
        </div>
    );
};

export default Branches;

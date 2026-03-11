import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Tag, X, Edit2, Trash2, XCircle, Building, Pencil } from 'lucide-react';
import ModalPortal from '../components/ModalPortal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const BrandForm = ({ onSubmit, title, formData, setFormData, onClose }) => (
    <ModalPortal>
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999] overflow-y-auto">
            <div
                className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative my-auto animate-fade-up border border-white/20 p-10"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSubmit(e); } }}
            >
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-[#0f172a]">{title}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brand / Entity Identification</p>
                    </div>
                    <button type="button" onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all group">
                        <XCircle size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand / Sub-Entity Name *</label>
                        <input
                            className="clean-input mt-1"
                            value={formData.name}
                            onChange={e => setFormData({ name: e.target.value })}
                            placeholder="e.g. Retail Chain - Dubai"
                            required
                        />
                    </div>
                    <div className="flex gap-4 pt-8">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95">Discard</button>
                        <button type="submit" className="flex-[2] bg-[#0f172a] text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-slate-900 transition-all shadow-[0_20px_40px_-12px_rgba(15,23,42,0.3)] active:scale-95">Sync Identity</button>
                    </div>
                </form>
            </div>
        </div>
    </ModalPortal>
);

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editBrand, setEditBrand] = useState(null);
    const [formData, setFormData] = useState({ name: '' });

    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${API}/brands`);
            setBrands(res.data);
        } catch (e) {
            console.error('Error fetching brands', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBrands(); }, []);

    const resetForm = () => setFormData({ name: '' });

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/brands`, formData);
            setShowCreate(false);
            resetForm();
            fetchBrands();
        } catch (e) {
            alert('Failed to create brand: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`${API}/brands/${editBrand.id}`, formData);
            setEditBrand(null);
            resetForm();
            fetchBrands();
        } catch (e) {
            alert('Failed to update brand: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this brand? This will also affect linked branches.')) return;
        try {
            await axios.delete(`${API}/brands/${id}`);
            fetchBrands();
        } catch (e) {
            alert('Failed to delete brand: ' + (e.response?.data?.message || e.message));
        }
    };

    const openEdit = (brand) => {
        setEditBrand(brand);
        setFormData({ name: brand.name });
    };

    const closeForm = () => {
        setShowCreate(false);
        setEditBrand(null);
        resetForm();
    };

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Brand / Sub-Entity Management</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Manage retail brands and sub-entities under your company</p>
                </div>
                <button onClick={() => setShowCreate(true)} className="bg-[#0f172a] text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-all text-sm shadow-xl shadow-slate-200">
                    <Plus size={18} /> Add Brand
                </button>
            </div>

            {/* Hierarchy hint */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 text-sm text-slate-500">
                <Building size={18} className="text-[#38bdf8] flex-shrink-0" />
                <span>Hierarchy: <strong className="text-[#0f172a]">Company (Tenant)</strong> → <strong className="text-[#0f172a]">Brand / Sub-Entity</strong> → <strong className="text-[#0f172a]">Branch</strong></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-slate-400 italic">Loading brands...</div>
                ) : brands.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-400 italic">No brands configured yet. Create your first brand to link branches to it.</div>
                ) : (
                    brands.map((brand) => (
                        <div key={brand.id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:-translate-y-1 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100">
                                    <Tag size={22} className="text-[#38bdf8]" />
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                    {brand._count?.branches ?? brand.branches?.length ?? 0} branch{(brand._count?.branches ?? 0) !== 1 ? 'es' : ''}
                                </span>
                            </div>
                            <h3 className="font-black text-[#0f172a] text-lg tracking-tight">{brand.name}</h3>
                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">{brand.id?.slice(0, 8)}...</p>
                            <div className="flex gap-2 mt-6 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => openEdit(brand)} className="flex-1 py-2 text-xs font-black text-slate-500 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-1">
                                    <Pencil size={12} /> Edit
                                </button>
                                <button onClick={() => handleDelete(brand.id)} className="flex-1 py-2 text-xs font-black text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-1">
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showCreate && <BrandForm onSubmit={handleCreate} title="Create New Brand" formData={formData} setFormData={setFormData} onClose={closeForm} />}
            {editBrand && <BrandForm onSubmit={handleEdit} title="Edit Brand" formData={formData} setFormData={setFormData} onClose={closeForm} />}
        </div>
    );
};

export default Brands;

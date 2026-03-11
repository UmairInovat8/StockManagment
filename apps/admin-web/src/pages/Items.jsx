import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Search, Package, Plus, X, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import ModalPortal from '../components/ModalPortal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Field = ({ label, value }) => value ? (
    <div>
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
        <p className="text-xs font-mono text-slate-600 font-medium">{value}</p>
    </div>
) : null;

const Items = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [importing, setImporting] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [formData, setFormData] = useState({
        sku: '', name: '', description: '', brandName: '',
        gtin: '', batch: '', expiry: '', productionDate: '',
        barcode: '', qrCode: '', serialNumber: '', upc: '',
        boxLength: '', boxWidth: '', boxHeight: '', boxWeight: '',
    });

    const fetchItems = async () => {
        try {
            const response = await axios.get(`${API}/items`);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    const resetForm = () => setFormData({
        sku: '', name: '', description: '', brandName: '',
        gtin: '', batch: '', expiry: '', productionDate: '',
        barcode: '', qrCode: '', serialNumber: '', upc: '',
        boxLength: '', boxWidth: '', boxHeight: '', boxWeight: '',
    });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('file', file);
        setImporting(true);
        try {
            await axios.post(`${API}/items/import`, fd);
            fetchItems();
            alert('Import successful!');
        } catch {
            alert('Import failed. Please check the CSV format (required: sku, name).');
        } finally {
            setImporting(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/items`, formData);
            setShowCreate(false);
            resetForm();
            fetchItems();
        } catch (err) {
            alert('Failed to create item: ' + (err.response?.data?.message || err.message));
        }
    };

    const filtered = items.filter(i =>
        i.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.gtin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Item Master</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Manage your SKU catalog with identifiers, expiry, and dimensions</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowCreate(true)} className="bg-[#0f172a] text-white font-black px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-all text-sm shadow-xl shadow-slate-200">
                        <Plus size={16} /> Add Item
                    </button>
                    <label className="bg-slate-50 border border-slate-100 text-slate-700 font-black px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition-all text-sm">
                        <Upload size={16} />
                        {importing ? 'Importing...' : 'Upload CSV'}
                        <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} disabled={importing} />
                    </label>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <Search className="text-slate-300 flex-shrink-0" size={18} />
                <input
                    type="text"
                    placeholder="Search by SKU, name, GTIN, or brand..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && <button onClick={() => setSearchTerm('')} className="text-slate-300 hover:text-slate-500"><X size={16} /></button>}
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">SKU</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Name</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Brand</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">GTIN</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Expiry</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Identifiers</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-20 text-slate-400 italic">Loading catalog...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-20 text-slate-400 italic">No items found. Import your first CSV or click "Add Item".</td></tr>
                        ) : (
                            filtered.map((item) => (
                                <React.Fragment key={item.id}>
                                    <tr className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}>
                                        <td className="px-6 py-4 font-mono text-sm font-bold text-[#38bdf8]">{item.sku}</td>
                                        <td className="px-6 py-4 font-medium text-[#0f172a] text-sm">{item.name}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500">{item.brandName || '—'}</td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.gtin || '—'}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500">{item.expiry ? new Date(item.expiry).toLocaleDateString() : '—'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 flex-wrap">
                                                {item.identifiers?.slice(0, 2).map((id) => (
                                                    <span key={id.id} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 uppercase font-black tracking-widest">
                                                        {id.type}
                                                    </span>
                                                ))}
                                                {item.identifiers?.length > 2 && <span className="text-[9px] text-slate-400 font-black">+{item.identifiers.length - 2}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {expandedRow === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </td>
                                    </tr>
                                    {expandedRow === item.id && (
                                        <tr className="bg-slate-50/60">
                                            <td colSpan="7" className="px-8 py-6">
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                                    <Field label="Barcode" value={item.barcode} />
                                                    <Field label="QR Code" value={item.qrCode} />
                                                    <Field label="Serial No." value={item.serialNumber} />
                                                    <Field label="UPC" value={item.upc} />
                                                    <Field label="Batch" value={item.batch} />
                                                    <Field label="Prod. Date" value={item.productionDate ? new Date(item.productionDate).toLocaleDateString() : null} />
                                                    <Field label="Box L×W×H" value={item.boxLength ? `${item.boxLength}×${item.boxWidth}×${item.boxHeight} cm` : null} />
                                                    <Field label="Weight" value={item.boxWeight ? `${item.boxWeight} kg` : null} />
                                                    {item.description && <div className="col-span-2"><Field label="Description" value={item.description} /></div>}
                                                    {item.identifiers?.map(id => (
                                                        <div key={id.id}><Field label={id.type} value={id.value} /></div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Item Modal */}
            {showCreate && (
                <ModalPortal>
                    <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999] overflow-y-auto">
                        <div
                            className="w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative my-auto animate-fade-up border border-white/20"
                            onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); handleCreate(e); } }}
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-black text-[#0f172a]">Item Master Entry</h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global SKU Registration</p>
                                    </div>
                                    <button type="button" onClick={() => { setShowCreate(false); resetForm(); }} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all group">
                                        <XCircle size={24} className="group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                                <form onSubmit={handleCreate} className="space-y-6">
                                    {/* Core */}
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">Core Details</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU *</label><input className="clean-input mt-1 font-mono" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} required /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Name *</label><input className="clean-input mt-1" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Name</label><input className="clean-input mt-1" value={formData.brandName} onChange={e => setFormData({ ...formData, brandName: e.target.value })} /></div>
                                            <div className="col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label><textarea className="clean-input mt-1" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                                        </div>
                                    </div>
                                    {/* Identifiers */}
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">Identifiers</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GTIN</label><input className="clean-input mt-1 font-mono" value={formData.gtin} onChange={e => setFormData({ ...formData, gtin: e.target.value })} /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Barcode</label><input className="clean-input mt-1 font-mono" value={formData.barcode} onChange={e => setFormData({ ...formData, barcode: e.target.value })} /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QR Code</label><input className="clean-input mt-1 font-mono" value={formData.qrCode} onChange={e => setFormData({ ...formData, qrCode: e.target.value })} /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Serial Number</label><input className="clean-input mt-1 font-mono" value={formData.serialNumber} onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UPC</label><input className="clean-input mt-1 font-mono" value={formData.upc} onChange={e => setFormData({ ...formData, upc: e.target.value })} /></div>
                                        </div>
                                    </div>
                                    {/* Batch/Dates */}
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">Batch & Dates</p>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch No.</label><input className="clean-input mt-1 font-mono" value={formData.batch} onChange={e => setFormData({ ...formData, batch: e.target.value })} /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Production Date</label><input type="date" className="clean-input mt-1" value={formData.productionDate} onChange={e => setFormData({ ...formData, productionDate: e.target.value })} /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</label><input type="date" className="clean-input mt-1" value={formData.expiry} onChange={e => setFormData({ ...formData, expiry: e.target.value })} /></div>
                                        </div>
                                    </div>
                                    {/* Dimensions */}
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">Box Dimensions</p>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Length (cm)</label><input type="number" className="clean-input mt-1" value={formData.boxLength} onChange={e => setFormData({ ...formData, boxLength: e.target.value })} /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Width (cm)</label><input type="number" className="clean-input mt-1" value={formData.boxWidth} onChange={e => setFormData({ ...formData, boxWidth: e.target.value })} /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Height (cm)</label><input type="number" className="clean-input mt-1" value={formData.boxHeight} onChange={e => setFormData({ ...formData, boxHeight: e.target.value })} /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight (kg)</label><input type="number" className="clean-input mt-1" value={formData.boxWeight} onChange={e => setFormData({ ...formData, boxWeight: e.target.value })} /></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-8">
                                        <button type="button" onClick={() => { setShowCreate(false); resetForm(); }} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95">Discard</button>
                                        <button type="submit" className="flex-[2] bg-[#0f172a] text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-slate-900 transition-all shadow-[0_20px_40px_-12px_rgba(15,23,42,0.3)] active:scale-95">Registry Sync</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </div>
    );
};

export default Items;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
    Search, Plus, Upload, Download, Trash2, Filter, 
    ChevronRight, ChevronLeft, ChevronUp, ChevronDown, 
    Loader2, X, XCircle 
} from 'lucide-react';
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [importing, setImporting] = useState(false);
    const [importJob, setImportJob] = useState(null);
    const [pollFailures, setPollFailures] = useState(0);
    const [showCreate, setShowCreate] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [formData, setFormData] = useState({
        sku_code: '', sku_name: '', description: '', brand_name: '',
        client_sku_code: '', unit_cost_price: '', uom: 'EA',
        gtin: '', batch: '', expiry: '', productionDate: '',
        barcode: '', qrCode: '', serialNumber: '', upc_code: '',
        box_dimensions: '',
    });

    const fileInputRef = useRef(null);

    const triggerUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // Clear first
            fileInputRef.current.click();
        } else {
            console.error("Error: The file input element was not found in the DOM.");
        }
    };

    const fetchItems = async (showMainLoader = false) => {
        if (showMainLoader && items.length === 0) setLoading(true);
        try {
            const response = await axios.get(`${API}/items`, {
                params: {
                    page: page,
                    limit: 20,
                    search: searchTerm || undefined
                }
            });
            setItems(response.data.items || []);
            setTotalPages(response.data.pages || 0);
            setTotalItems(response.data.total || 0);
        } catch (error) {
            console.error('Error fetching items', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchItems(!items.length); // Only show main loader if we have NO items yet
        }, 300);
        return () => clearTimeout(timer);
    }, [page, searchTerm]);

    // Import progress polling
    useEffect(() => {
        let interval;
        if (importing) {
            interval = setInterval(async () => {
                try {
                    const res = await axios.get(`${API}/items/import/status`);
                    if (res.data) {
                        setImportJob(res.data);
                        setPollFailures(0); // Reset on success
                        if (res.data.status === 'COMPLETED' || res.data.status === 'FAILED') {
                            setImporting(false);
                            fetchItems(true); // Silent refresh
                            setTimeout(() => setImportJob(null), 3000);
                        }
                    } else {
                        // Increment failure counter - only close after 5 consecutive nulls
                        setPollFailures(prev => {
                            const count = prev + 1;
                            if (count >= 5) {
                                setImporting(false);
                                setImportJob(null);
                            }
                            return count;
                        });
                    }
                } catch (err) {
                    setPollFailures(prev => prev + 1);
                    console.error('Polling error:', err);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [importing]);

    const resetForm = () => setFormData({
        sku_code: '', sku_name: '', description: '', brand_name: '',
        client_sku_code: '', unit_cost_price: '', uom: 'EA',
        gtin: '', batch: '', expiry: '', productionDate: '',
        barcode: '', qrCode: '', serialNumber: '', upc_code: '',
        box_dimensions: '',
    });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.error("No file was detected by the browser.");
            return;
        }
        
        const fd = new FormData();
        fd.append('file', file);
        setImporting(true);
        setImportJob({ processed: 0, total: 0, status: 'STARTING' }); // Instant modal
        try {
            await axios.post(`${API}/items/upload`, fd);
            // Polling is started by setting importing to true
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed: ' + (error.response?.data?.message || error.message));
            setImporting(false);
            setImportJob(null);
        } finally {
            if (e.target) e.target.value = null;
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
            console.error('Failed to create item: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} selected items?`)) return;
        setIsDeleting(true);
        try {
            await axios.post(`${API}/items/delete-selected`, { ids: Array.from(selectedIds) });
            setSelectedIds(new Set());
            fetchItems(true);
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete items');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClearAll = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`${API}/items/all`);
            setShowClearConfirm(false);
            setPage(1);
            fetchItems(true);
        } catch (err) {
            console.error('Clear failed:', err);
            alert('Failed to clear catalog');
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === items.length && items.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(items.map(item => item.id)));
        }
    };

    const toggleSelectItem = (id) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    // Server-side filtered items are already in the "items" state
    const displayItems = items;

    return (
        <div className="space-y-8 relative">
            {/* Surgical Loading Overlay - Only shows on initial absolute empty state */}
            {loading && items.length === 0 && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-[2px] z-[50] flex flex-col items-center justify-center space-y-4 animate-fade-in">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] animate-pulse">Initializing Catalog...</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Item Master</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Manage your SKU catalog with identifiers, expiry, and dimensions</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowCreate(true)} className="bg-[#0f172a] text-white font-black px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-all text-sm shadow-xl shadow-slate-200">
                        <Plus size={16} /> Add Item
                    </button>
                    <button 
                        onClick={triggerUpload} 
                        disabled={importing}
                        className="bg-slate-50 border border-slate-100 text-slate-700 font-black px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-100 transition-all text-sm active:scale-95 disabled:opacity-50"
                    >
                        <Upload size={16} />
                        {importing ? 'Importing...' : 'Upload Data'}
                    </button>
                    <button 
                        onClick={() => setShowClearConfirm(true)} 
                        className="bg-red-50 text-red-600 font-black px-4 py-3 rounded-2xl flex items-center gap-2 hover:bg-red-100 transition-all text-sm active:scale-95 border border-red-100"
                        title="Clear Catalog"
                    >
                        <Trash2 size={16} />
                    </button>
                    {/* Input is visually hidden but remains in DOM flow to prevent browser suppression */}
                    <input 
                        ref={fileInputRef} 
                        type="file" 
                        className="absolute w-0 h-0 opacity-0 pointer-events-none" 
                        accept=".csv, .xls, .xlsx, text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                        onChange={handleFileUpload} 
                        disabled={importing} 
                    />
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
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1); // Reset to first page on search
                    }}
                />
                {searchTerm && <button onClick={() => { setSearchTerm(''); setPage(1); }} className="text-slate-300 hover:text-slate-500"><X size={16} /></button>}
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 w-12">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-slate-300 text-[#0f172a] focus:ring-[#0f172a]"
                                    checked={items.length > 0 && selectedIds.size === items.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">SKU Code</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">SKU Name</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Brand</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">GTIN</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Expiry</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Identifiers</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {items.length === 0 && !loading ? (
                            <tr><td colSpan="8" className="text-center py-24 text-slate-300 italic text-sm">No items found in catalog. Start by uploading an Excel file.</td></tr>
                        ) : (
                            items.map((item) => (
                                <React.Fragment key={item.id}>
                                    <tr className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedIds.has(item.id) ? 'bg-blue-50/30' : ''}`} onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}>
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-slate-300 text-[#0f172a] focus:ring-[#0f172a]"
                                                checked={selectedIds.has(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm font-bold text-[#38bdf8]">{item.sku_code}</td>
                                        <td className="px-6 py-4 font-medium text-[#0f172a] text-sm">{item.sku_name}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500 text-center">{item.brand_name || '—'}</td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500 text-center">{item.gtin || '—'}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500 text-center">{item.expiry ? new Date(item.expiry).toLocaleDateString() : '—'}</td>
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
                                            <td colSpan="8" className="px-8 py-6">
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                                    <Field label="Barcode" value={item.barcode} />
                                                    <Field label="QR Code" value={item.qrCode} />
                                                    <Field label="Serial No." value={item.serialNumber} />
                                                    <Field label="UPC" value={item.upc_code} />
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

            {/* Pagination */}
            {totalItems > 0 && (
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                    <p className="text-xs font-medium text-slate-400">
                        Showing <span className="font-bold text-slate-600">{(page - 1) * 20 + 1}</span> to <span className="font-bold text-slate-600">{Math.min(page * 20, totalItems)}</span> of <span className="font-bold text-slate-600">{totalItems.toLocaleString()}</span> items
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) pageNum = i + 1;
                                else if (page <= 3) pageNum = i + 1;
                                else if (page > totalPages - 2) pageNum = totalPages - 4 + i;
                                else pageNum = page - 2 + i;

                                return (
                                    <button 
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-xl transition-all ${page === pageNum ? 'bg-[#0f172a] text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button 
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

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
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU Code *</label><input className="clean-input mt-1 font-mono" value={formData.sku_code} onChange={e => setFormData({ ...formData, sku_code: e.target.value })} required /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU Name *</label><input className="clean-input mt-1" value={formData.sku_name} onChange={e => setFormData({ ...formData, sku_name: e.target.value })} required /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Name</label><input className="clean-input mt-1" value={formData.brand_name} onChange={e => setFormData({ ...formData, brand_name: e.target.value })} /></div>
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
            {/* Action Bar for Selection */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0f172a] text-white px-8 py-4 rounded-[2rem] shadow-2xl z-[100] flex items-center gap-6 animate-fade-up border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-black text-sm">
                            {selectedIds.size}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Items Selected</span>
                    </div>
                    <button 
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                        className="text-red-400 hover:text-red-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        Delete Selected
                    </button>
                    <button 
                        onClick={() => setSelectedIds(new Set())}
                        className="text-slate-400 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                        Deselect
                    </button>
                </div>
            )}

            {/* Clear All Confirmation Modal */}
            {showClearConfirm && (
                <ModalPortal>
                    <div className="fixed inset-0 bg-red-950/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
                        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl text-center space-y-8 animate-fade-up border border-red-100">
                            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto shadow-inner relative overflow-hidden">
                                <Trash2 className="text-red-500" size={32} />
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-[#0f172a]">Wipe Entire Catalog?</h3>
                                <p className="text-slate-400 text-xs font-medium px-4">This will permanently delete all <span className="text-red-500 font-bold">{totalItems.toLocaleString()} items</span> and their history. This action cannot be undone.</p>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setShowClearConfirm(false)}
                                    className="flex-1 py-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleClearAll}
                                    disabled={isDeleting}
                                    className="flex-[2] bg-red-500 text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-red-600 transition-all shadow-xl shadow-red-200 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {isDeleting && <Loader2 size={14} className="animate-spin" />}
                                    Yes, Clear Everything
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}

            {/* Import Progress Modal */}
            {importing && (
                <ModalPortal>
                    <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-xl flex items-center justify-center p-4 z-[10000]">
                        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl text-center space-y-8 border border-white/10">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto shadow-inner relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent animate-pulse" />
                                {importJob?.status === 'STARTING' ? (
                                    <Loader2 className="text-blue-500 animate-spin" size={32} />
                                ) : (
                                    <Upload className="text-blue-500 animate-bounce" size={32} />
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-[#0f172a]">Synchronizing Catalog</h3>
                                <p className="text-slate-400 text-xs font-medium">Processing your massive dataset. Please do not close this tab.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Progress</span>
                                    <span className="text-sm font-mono font-bold text-blue-500">
                                        {importJob && importJob.total > 0 
                                            ? Math.round((( (importJob.processed || 0) + (importJob.failed || 0) ) / importJob.total) * 100) 
                                            : 0}%
                                    </span>
                                </div>
                                <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50 p-1 relative">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 shadow-inner relative z-10"
                                        style={{ 
                                            width: `${importJob && importJob.total > 0 
                                                ? Math.min(100, Math.round((( (importJob.processed || 0) + (importJob.failed || 0) ) / importJob.total) * 100)) 
                                                : 0}%` 
                                        }}
                                    />
                                    {(!importJob || !importJob.total) && (
                                        <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-full" />
                                    )}
                                </div>
                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Processed: {importJob?.processed?.toLocaleString() || '0'}</span>
                                    <span>Total: {importJob?.total?.toLocaleString() || '...'}</span>
                                </div>
                            </div>

                            {importJob?.failed > 0 && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-bold flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                                    {importJob.failed} items skipped due to identifier conflicts
                                </div>
                            )}

                            <div className="pt-4">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] animate-pulse">
                                    {importJob?.status === 'STARTING' ? 'Preparing Upload...' : 'Running Background Sync...'}
                                </p>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </div>
    );
};

export default Items;

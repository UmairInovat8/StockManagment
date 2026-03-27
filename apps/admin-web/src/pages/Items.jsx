import React, { useState, useEffect, useRef } from 'react';
import { 
    Search, Plus, Upload, Download, Trash2, Filter, 
    ChevronRight, ChevronLeft, ChevronUp, ChevronDown, 
    Loader2, X, XCircle, Layers, PlusCircle
} from 'lucide-react';
import ModalPortal from '../components/ModalPortal';
import ConfirmModal from '../components/ConfirmModal';
import api from '../lib/api';
import useItemStore from '../store/itemStore';

const Field = ({ label, value }) => value ? (
    <div>
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
        <p className="text-xs font-mono text-slate-600 font-medium">{value}</p>
    </div>
) : null;

const Items = () => {
    const { 
        items, meta, masters, companies, isLoading, selectedMasterId,
        fetchItems, fetchMasters, fetchCompanies, createMaster, setSelectedMasterId, handleBulkDelete, deleteAllItems 
    } = useItemStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [importing, setImporting] = useState(false);
    const [importJob, setImportJob] = useState(null);
    const [importMessage, setImportMessage] = useState('');
    const [showCreateMaster, setShowCreateMaster] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [newMasterName, setNewMasterName] = useState('');
    const [selectedTenantId, setSelectedTenantId] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

    const fileInputRef = useRef(null);

    // Init
    useEffect(() => {
        fetchMasters();
        fetchCompanies();
        // Check for active import on mount — only resume if actually active
        const checkActiveImport = async () => {
            try {
                const res = await api.get('/items/import/status');
                if (res.data) {
                    const { status, message } = res.data;
                    if (status === 'STARTING' || status === 'PROCESSING') {
                        setImporting(true);
                        setImportJob(res.data);
                    } else if (status === 'FAILED' && message) {
                        // Show message for a recent failure without entering import mode
                        setImportMessage(message);
                    }
                }
            } catch (err) {}
        };
        checkActiveImport();
    }, []);

    // Fetch items on master/page/search change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchItems(page, 20, searchTerm); 
        }, 300);
        return () => clearTimeout(timer);
    }, [page, searchTerm, selectedMasterId]);

    // Polling for import
    useEffect(() => {
        let interval;
        if (importing) {
            interval = setInterval(async () => {
                try {
                    const res = await api.get('/items/import/status');
                    const job = res.data;

                    // No active job found — treat as completed to unblock UI
                    if (!job || job.status === 'COMPLETED' || job.status === 'FAILED') {
                        setImporting(false);
                        if (job) {
                            setImportJob(job);
                            if (job.message) setImportMessage(job.message);
                        }
                        if (!job || job.status === 'COMPLETED') {
                            setImportMessage(job?.message || 'Synchronization successful! The catalog has been updated.');
                            // Explicitly refresh the current master
                            fetchItems(1, 20, searchTerm);
                        }
                        return;
                    }

                    // Still active — update progress
                    setImportJob(job);
                    setImportMessage('');
                } catch (err) {
                    console.error('Polling error', err);
                    // On network error, don't get stuck — clear after 3 failed polls
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [importing]);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedMasterId) return;

        const fd = new FormData();
        fd.append('file', file);
        fd.append('itemMasterId', selectedMasterId);

        setImporting(true);
        try {
            const res = await api.post('/items/upload', fd);
            setImportJob({ id: res.data.jobId, status: 'STARTING', processed: 0, total: 0 });
        } catch (err) {
            setImporting(false);
            alert(err.response?.data?.message || 'Upload failed');
        }
    };

    const handleDeleteSelected = async () => {
        setIsDeleting(true);
        try {
            await handleBulkDelete(Array.from(selectedIds));
            setSelectedIds(new Set());
            setShowDeleteConfirm(false);
        } catch (err) {
            alert('Failed to delete items');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteAll = async () => {
        setIsDeletingAll(true);
        try {
            await deleteAllItems();
            setShowDeleteAllConfirm(false);
        } catch (err) {
            alert('Failed to clear catalog');
        } finally {
            setIsDeletingAll(false);
        }
    };

    const handleCreateMaster = async () => {
        if (!newMasterName.trim()) return;
        try {
            const master = await createMaster(newMasterName.trim(), selectedTenantId || undefined);
            if (master) {
                setSelectedMasterId(master.id);
                setShowCreateMaster(false);
                setNewMasterName('');
                setSelectedTenantId('');
            }
        } catch (err) {
            alert(`Failed to create catalog: ${err.message}`);
        }
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header / Master Selection */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Item Master</h1>
                    <p className="text-slate-400 text-sm font-medium">Manage and synchronize your product catalogs.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select 
                            value={selectedMasterId || ''}
                            onChange={(e) => setSelectedMasterId(e.target.value)}
                            className="pl-9 pr-10 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer min-w-[200px]"
                        >
                            {masters.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    
                    <button 
                        onClick={() => setShowCreateMaster(true)}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 shadow-sm"
                        title="New Catalog"
                    >
                        <PlusCircle className="w-5 h-5" />
                    </button>

                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!selectedMasterId || importing}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        <span>Sync Catalog</span>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".xlsx,.xls,.csv" />
                </div>
            </div>

            {/* Import Message Banner (for completed/failed jobs) */}
            {!importing && importMessage && (
                <div className={`p-4 rounded-2xl text-sm font-semibold border ${
                    importMessage.includes('Mapping failed') || importMessage.includes('failed') || importMessage.includes('FAILED')
                        ? 'bg-red-50 border-red-100 text-red-700'
                        : 'bg-green-50 border-green-100 text-green-700'
                }`}>
                    <div className="flex items-start justify-between gap-4">
                        <p className="flex-1">{importMessage}</p>
                        <button onClick={() => setImportMessage('')} className="text-current opacity-50 hover:opacity-100 shrink-0 font-bold text-lg leading-none">×</button>
                    </div>
                </div>
            )}

            {/* Import Status Bar */}
            {importing && importJob && (
                <div className="bg-white border border-blue-100 p-6 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-800 tracking-tight">Syncing Product Catalog</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{importJob.status}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-blue-600 font-mono">
                                {Math.round(((importJob.processed || 0) / (importJob.total || 1)) * 100)}%
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                                {(importJob.processed || 0).toLocaleString()} / {(importJob.total || 0).toLocaleString()} Items
                            </p>
                        </div>
                    </div>
                    
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-600 transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(100, Math.round((importJob.processed / (importJob.total || 1)) * 100))}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Table Area */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search by SKU, Name or Brand..."
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
                                {Number(meta.total || 0).toLocaleString()} Total Items
                            </span>
                        </div>
                    </div>

                    {/* Top Pagination */}
                    <div className="flex items-center gap-1 ml-4 pr-4 border-r border-slate-200">
                        <button 
                            disabled={meta.page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-1.5 hover:bg-white rounded-lg disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mx-2">
                            {meta.page || 1} / {meta.lastPage || 1}
                        </span>
                        <button 
                            disabled={meta.page >= (meta.lastPage || 1)}
                            onClick={() => setPage(p => p + 1)}
                            className="p-1.5 hover:bg-white rounded-lg disabled:opacity-30 transition-all"
                        >
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {selectedIds.size > 0 ? (
                            <button 
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Selected ({selectedIds.size})</span>
                            </button>
                        ) : (
                            selectedMasterId && (
                                <button 
                                    onClick={() => setShowDeleteAllConfirm(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all group"
                                >
                                    <Trash2 className="w-4 h-4 group-hover:animate-bounce" />
                                    <span>Clear Catalog</span>
                                </button>
                            )
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="p-4 text-left w-12">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedIds(new Set(items.map(i => i.id)));
                                            else setSelectedIds(new Set());
                                        }}
                                    />
                                </th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Product / SKU</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Brand & Type</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status</th>
                                <th className="p-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading && items.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                                        <p className="text-slate-400 text-sm mt-4 font-bold">Loading catalog data...</p>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <Layers className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 text-sm font-bold">This catalog is empty.</p>
                                        <p className="text-slate-300 text-xs">Sync a file to populate this master.</p>
                                    </td>
                                </tr>
                            ) : items.map((item) => (
                                <React.Fragment key={item.id}>
                                    <tr className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${expandedRow === item.id ? 'bg-blue-50/30' : ''}`}
                                        onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}>
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.has(item.id)}
                                                onChange={() => {
                                                    const next = new Set(selectedIds);
                                                    if (next.has(item.id)) next.delete(item.id); else next.add(item.id);
                                                    setSelectedIds(next);
                                                }}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700 leading-tight">{item.skuName}</span>
                                                <span className="text-[10px] font-mono font-black text-slate-400 mt-1 uppercase tracking-tighter">{item.skuCode}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{item.brandName || 'NO BRAND'}</span>
                                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase">{item.uom}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-400'}`} />
                                                {item.status || 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${expandedRow === item.id ? 'rotate-90' : ''}`} />
                                        </td>
                                    </tr>
                                    {expandedRow === item.id && (
                                        <tr className="bg-slate-50/30">
                                            <td colSpan="5" className="px-16 py-6 border-b border-slate-100">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <Field label="GTIN" value={item.gtin} />
                                                    <Field label="Batch" value={item.batch} />
                                                    <Field label="Expiry" value={item.expiry ? new Date(item.expiry).toLocaleDateString() : null} />
                                                    <Field label="Production" value={item.productionDate ? new Date(item.productionDate).toLocaleDateString() : null} />
                                                    <Field label="Barcode" value={item.barcode} />
                                                    <Field label="Serial" value={item.serialNumber} />
                                                    <Field label="Alt Code 1" value={item.identifiers?.find(i => i.type === 'ALT1')?.value} />
                                                    <Field label="Alt Code 2" value={item.identifiers?.find(i => i.type === 'ALT2')?.value} />
                                                    <Field label="Alt Code 3" value={item.identifiers?.find(i => i.type === 'ALT3')?.value} />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                        Page {meta.page || 1} of {meta.lastPage || 1}
                    </span>
                    <div className="flex items-center gap-1">
                        <button 
                            disabled={meta.page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all active:scale-95"
                        >
                            <ChevronLeft className="w-4 h-4 text-slate-600" />
                        </button>

                        {/* Page Numbers */}
                        {(() => {
                            const totalPages = meta.lastPage || 1;
                            const count = Math.min(5, totalPages);
                            return Array.from({ length: count }, (_, i) => {
                                let p;
                                if (totalPages <= 5) {
                                    p = i + 1;
                                } else if (meta.page <= 3) {
                                    p = i + 1;
                                } else if (meta.page >= totalPages - 2) {
                                    p = totalPages - 4 + i;
                                } else {
                                    p = meta.page - 2 + i;
                                }
                                if (p < 1 || p > totalPages) return null;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${meta.page === p ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white text-slate-400 border border-transparent hover:border-slate-200'}`}
                                    >
                                        {p}
                                    </button>
                                );
                            });
                        })()}

                        <button 
                            disabled={meta.page >= (meta.lastPage || 1)}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all active:scale-95"
                        >
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Master Modal */}
            {showCreateMaster && (
                <ModalPortal>
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">New Product Catalog</h3>
                                <button onClick={() => setShowCreateMaster(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Catalog Name</label>
                                    <input 
                                        type="text" 
                                        autoFocus
                                        placeholder="e.g. Pharmacy Stock, Retail Inventory..."
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-medium focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300 transition-all outline-none"
                                        value={newMasterName}
                                        onChange={(e) => setNewMasterName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Business Unit / Entity (Optional)</label>
                                    <select 
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-medium focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none cursor-pointer"
                                        value={selectedTenantId}
                                        onChange={(e) => setSelectedTenantId(e.target.value)}
                                    >
                                        <option value="">Current Company</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.id}>{c.companyName} ({c.companyCode})</option>
                                        ))}
                                    </select>
                                </div>
                                <button 
                                    onClick={handleCreateMaster}
                                    disabled={!newMasterName.trim()}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
                                >
                                    Create Catalog
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}

            {/* Delete Modal */}
            <ConfirmModal 
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteSelected}
                title="Delete Items?"
                message={`Are you sure you want to delete ${selectedIds.size} selected items? This action cannot be undone.`}
                confirmLabel={isDeleting ? "Deleting..." : "Delete Items"}
                variant="danger"
                loading={isDeleting}
            />

            {/* Delete All Modal */}
            <ConfirmModal 
                show={showDeleteAllConfirm} // Using 'show' based on common pattern, or 'isOpen' if consistent
                isOpen={showDeleteAllConfirm}
                onClose={() => setShowDeleteAllConfirm(false)}
                onConfirm={handleDeleteAll}
                title="Clear Entire Catalog?"
                message={`Are you sure you want to delete ALL ${meta.total?.toLocaleString()} items in this catalog? This will permanently wipe the data and cannot be undone.`}
                confirmLabel={isDeletingAll ? "Clearing..." : "Clear Catalog"}
                variant="danger"
                loading={isDeletingAll}
            />
        </div>
    );
};

export default Items;

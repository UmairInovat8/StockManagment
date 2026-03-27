import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Clock, MapPin, ClipboardCheck, ChevronRight, LayoutGrid, X, XCircle } from 'lucide-react';
import ModalPortal from '../components/ModalPortal';



const StatusBadge = ({ status }) => {
    const colors = {
        'DRAFT': 'bg-slate-100 text-slate-500',
        'SCHEDULED': 'bg-blue-50 text-blue-500',
        'IN_PROGRESS': 'bg-amber-50 text-amber-500',
        'COMPLETED': 'bg-emerald-50 text-emerald-500',
    };
    return (
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-black/5 ${colors[status] || colors.DRAFT}`}>
            {status}
        </span>
    );
};

const Audits = () => {
    const navigate = useNavigate();
    const [audits, setAudits] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        branchId: '',
        itemMasterId: '',
        auditDateTime: '',
    });
    const [masters, setMasters] = useState([]);

    const fetchData = async () => {
        try {
            const [auditsRes, branchesRes, mastersRes] = await Promise.all([
                api.get('/audits'),
                api.get('/branches'),
                api.get('/items/masters')
            ]);
            setAudits(auditsRes.data);
            setBranches(branchesRes.data);
            setMasters(mastersRes.data);
        } catch (e) {
            console.error('Error fetching audits/branches', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const resetForm = () => setFormData({ name: '', branchId: '', auditDateTime: '' });

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/audits', formData);
            setShowCreate(false);
            resetForm();
            fetchData();
            navigate(`/audits/${res.data.id}`);
        } catch (e) {
            alert('Failed to create audit: ' + (e.response?.data?.message || e.message));
        }
    };

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Audit Protocol</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Setup and manage stock audit cycles across your branches</p>
                </div>
                <button onClick={() => setShowCreate(true)} className="bg-[#0f172a] text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-all text-sm shadow-xl shadow-slate-200">
                    <Plus size={18} /> Schedule New Audit
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-slate-400 italic">Syncing audit cycles...</div>
                ) : audits.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[2rem]">
                        <ClipboardCheck size={48} className="mx-auto text-slate-100 mb-4" />
                        <p className="italic">No audits found. Click "Schedule New Audit" to begin the workflow.</p>
                    </div>
                ) : (
                    audits.map((audit) => (
                        <div key={audit.id} onClick={() => navigate(`/audits/${audit.id}`)} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-violet-50 rounded-2xl border border-violet-100">
                                    <ClipboardCheck size={22} className="text-violet-500" />
                                </div>
                                <StatusBadge status={audit.status} />
                            </div>
                            <h3 className="font-black text-[#0f172a] text-lg tracking-tight mb-2 truncate">{audit.name}</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <MapPin size={12} className="text-slate-300" />
                                    <span className="font-bold">{audit.branch?.branchName || audit.branch?.branch_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar size={12} className="text-slate-300" />
                                    <span>{(audit.auditDateTime || audit.audit_date_time) ? new Date(audit.auditDateTime || audit.audit_date_time).toLocaleDateString() : 'No date'}</span>
                                    <Clock size={12} className="text-slate-300 ml-2" />
                                    <span>{(audit.auditDateTime || audit.audit_date_time) ? new Date(audit.auditDateTime || audit.audit_date_time).toLocaleTimeString() : 'No time'}</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                    {audit._count?.sections || 0} locations mapped
                                </span>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#0f172a] group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showCreate && (
                <ModalPortal>
                    <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999] overflow-y-auto">
                        <div
                            className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative my-auto animate-fade-up border border-white/20 p-10"
                            onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); handleCreate(e); } }}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-[#0f172a]">Audit Protocol</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initialization & Cycle Mapping</p>
                                </div>
                                <button type="button" onClick={() => setShowCreate(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all group">
                                    <XCircle size={24} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Cycle Name *</label>
                                    <input className="clean-input mt-1" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Annual Inventory 2024" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Branch *</label>
                                    <select className="clean-input mt-1 appearance-none" value={formData.branchId} onChange={e => setFormData({ ...formData, branchId: e.target.value })} required>
                                        <option value="">Select Branch...</option>
                                        {branches.map(b => <option key={b.id} value={b.id}>{b.branchName || b.branch_name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Catalog *</label>
                                    <select className="clean-input mt-1 appearance-none" value={formData.itemMasterId} onChange={e => setFormData({ ...formData, itemMasterId: e.target.value })} required>
                                        <option value="">Select Catalog...</option>
                                        {masters.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Date & Time</label>
                                    <input type="datetime-local" className="clean-input mt-1" value={formData.auditDateTime} onChange={e => setFormData({ ...formData, auditDateTime: e.target.value })} />
                                </div>
                                <div className="flex gap-4 pt-8">
                                    <button type="button" onClick={() => { setShowCreate(false); resetForm(); }} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95">Discard</button>
                                    <button type="submit" className="flex-[2] bg-[#0f172a] text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-slate-900 transition-all shadow-[0_20px_40px_-12px_rgba(15,23,42,0.3)] active:scale-95">Deploy Audit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </div >
    );
};

export default Audits;

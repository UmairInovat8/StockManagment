import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import {
    ArrowLeft, LayoutGrid, ClipboardList,
    Upload, UserPlus, CheckCircle2, AlertCircle, ChevronRight, Search, Settings, History
} from 'lucide-react';
import SignOffModal from '../components/SignOffModal';



const AuditDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [audit, setAudit] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [activeTab, setActiveTab] = useState('allocation');
    const [searchTerm, setSearchTerm] = useState('');
    const [assigningTo, setAssigningTo] = useState(null);
    const [varianceReport, setVarianceReport] = useState([]);
    const [loadingVariance, setLoadingVariance] = useState(false);
    const [showSignOff, setShowSignOff] = useState(false);

    const fetchData = async () => {
        setErrorMsg(null);
        setLoading(true);
        try {
            const auditRes = await api.get(`/audits/${id}`);
            if (!auditRes.data) {
                setErrorMsg('Audit not found or does not belong to your account.');
            } else {
                setAudit(auditRes.data);
            }
        } catch (e) {
            console.error('[AuditDetail] Error fetching audit:', e);
            setErrorMsg('Failed to load audit: ' + (e.response?.data?.message || e.message));
        } finally {
            setLoading(false);
        }

        // Load users separately so failure here doesn't block the audit view
        try {
            const usersRes = await api.get('/users');
            setAllUsers(usersRes.data || []);
        } catch (e) {
            console.warn('[AuditDetail] Could not load users:', e.message);
        }
    };

    const fetchVariance = async () => {
        setLoadingVariance(true);
        try {
            const res = await api.get(`/audits/${id}/variance-report`);
            setVarianceReport(res.data || []);
        } catch (e) {
            console.error('Error fetching variance report', e);
        } finally {
            setLoadingVariance(false);
        }
    };

    useEffect(() => {
        fetchData();
        if (activeTab === 'variance') fetchVariance();
    }, [id, activeTab]);

    const handleGenerateSections = async () => {
        if (!window.confirm('Retrieve branch layout? This will clear any existing assignments.')) return;
        try {
            await api.post(`/audits/${id}/generate-sections`);
            fetchData();
        } catch (e) {
            console.error('Generation failed: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleAssignAuditor = async (sectionId, userId) => {
        try {
            await api.patch(`/audits/sections/${sectionId}/assign`, { userId: userId || null });
            setAssigningTo(null);
            fetchData();
        } catch (e) {
            console.error('Assignment failed: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleResolveDiscrepancy = async (itemId, action) => {
        try {
            await api.post(`/audits/${id}/discrepancies/${itemId}/resolve`, { action, comment: 'Resolution by manager' });
            fetchVariance();
        } catch (e) {
            console.error('Resolution failed');
        }
    };

    const handleSignOff = async (signOffData) => {
        try {
            await api.post(`/audits/${id}/sign-off`, signOffData);
            setShowSignOff(false);
            fetchData();
        } catch (e) {
            console.error('Sign-off failed: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await api.post(`/audits/${id}/soh-baseline`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
            alert(`✅ ${res.data.imported || 0} SOH records imported successfully. ${res.data.skipped || 0} skipped.`);
            if (activeTab === 'variance') fetchVariance();
        } catch (e) {
            alert('Upload failed: ' + (e.response?.data?.message || e.message));
        } finally {
            e.target.value = null;
        }
    };

    if (loading) {
        return <div className="p-20 text-center italic text-slate-400">Loading audit architecture...</div>;
    }

    if (errorMsg || !audit) {
        return (
            <div className="p-20 text-center">
                <AlertCircle size={40} className="mx-auto text-red-400 mb-4" />
                <p className="text-red-500 font-bold text-lg">Audit Not Found</p>
                <p className="text-slate-400 text-sm mt-2 mb-6">{errorMsg || 'This audit does not exist or does not belong to your account.'}</p>
                <button onClick={() => navigate('/audits')} className="px-6 py-3 bg-[#0f172a] text-white rounded-2xl font-black text-sm">← Back to Audits</button>
            </div>
        );
    }

    const filteredSections = (audit.sections || []).filter(s => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            s.location?.code?.toLowerCase().includes(term) ||
            s.location?.name?.toLowerCase().includes(term) ||
            s.assignedUser?.firstName?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/audits')} className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                        <ArrowLeft size={20} className="text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#0f172a] tracking-tight flex items-center gap-3">
                            {audit.name}
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-violet-50 text-violet-500 border border-violet-100 rounded-full">
                                {audit.status}
                            </span>
                        </h1>
                        <p className="text-slate-400 text-sm font-medium mt-1">
                            Branch: <strong className="text-slate-600">{audit.branch?.branchName || audit.branch?.branch_name}</strong> • 
                            Catalog: <strong className="text-indigo-600 uppercase tracking-tight">{audit.itemMaster?.name || 'Default'}</strong> • 
                            Scheduled: <strong className="text-slate-600">{(audit.auditDateTime || audit.audit_date_time) ? new Date(audit.auditDateTime || audit.audit_date_time).toLocaleDateString() : 'N/A'}</strong>
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <label className="bg-white border border-slate-100 text-[#0f172a] font-black px-6 py-3 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-all text-sm shadow-sm">
                        <Upload size={18} /> Import SOH
                        <input type="file" accept=".xlsx,.csv" className="hidden" onChange={handleFileUpload} />
                    </label>
                    <button
                        onClick={() => setShowSignOff(true)}
                        className="bg-[#0f172a] text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-all text-sm shadow-xl shadow-slate-200"
                    >
                        <CheckCircle2 size={18} /> Complete &amp; Sign-off
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-slate-100/50 rounded-2xl w-fit">
                {[
                    { id: 'allocation', icon: LayoutGrid, label: 'Task Allocation' },
                    { id: 'variance', icon: ClipboardList, label: 'Variance Analysis' },
                    { id: 'settings', icon: Settings, label: 'Audit Setup' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-[#0f172a] shadow-md shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Variance Tab */}
            {activeTab === 'variance' && (
                <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black text-[#0f172a] tracking-tight">Stock Deviation Report</h3>
                            <p className="text-slate-400 text-sm mt-1">Real-time comparison between baseline SOH and physical counts</p>
                        </div>
                        <button onClick={fetchVariance} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
                            <History size={18} className="text-slate-400" />
                        </button>
                    </div>

                    {loadingVariance ? (
                        <div className="py-20 text-center italic text-slate-400">Recalculating stock deltas...</div>
                    ) : varianceReport.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-[2rem]">
                            <p className="text-slate-400 italic">No data to compare. Import SOH and start counting to see variances.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left bg-slate-50/50 rounded-xl">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">SKU / Item</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Baseline SOH</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Physical Count</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Variance</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {varianceReport.map(v => (
                                        <tr key={v.itemId} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-mono text-xs font-bold text-[#38bdf8]">{v.sku}</p>
                                                <p className="text-[11px] font-bold text-slate-600 truncate max-w-[200px]">{v.name}</p>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm font-bold text-slate-600">{v.soh}</td>
                                            <td className="px-6 py-4 font-mono text-sm font-bold text-[#0f172a]">{v.counted}</td>
                                            <td className={`px-6 py-4 font-mono text-sm font-black ${v.variance < 0 ? 'text-red-500' : v.variance > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {v.variance > 0 ? `+${v.variance}` : v.variance}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${v.status === 'MATCHED' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                                                    {v.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {v.status !== 'MATCHED' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleResolveDiscrepancy(v.itemId, 'ACCEPT')} className="text-[9px] font-black uppercase px-3 py-1 bg-[#0f172a] text-white rounded-lg hover:bg-black transition-all">Accept</button>
                                                        <button className="text-[9px] font-black uppercase px-3 py-1 bg-white border border-slate-100 text-slate-400 rounded-lg hover:border-red-200 hover:text-red-500 transition-all">Recount</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Task Allocation Tab */}
            {activeTab === 'allocation' && (
                <div className="space-y-6">
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <div>
                                <h3 className="text-lg font-black text-[#0f172a] tracking-tight">Location Allocation</h3>
                                <p className="text-slate-400 text-sm mt-1">Assign auditors to specific locations retrieved from branch layout</p>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <div className="flex-1 min-w-[300px] bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                                    <Search size={18} className="text-slate-300" />
                                    <input
                                        type="text"
                                        placeholder="Find location or auditor..."
                                        className="bg-transparent border-none outline-none text-sm w-full"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button onClick={handleGenerateSections} className="bg-sky-50 text-sky-600 font-black px-6 py-3 rounded-2xl border border-sky-100 hover:bg-sky-100 transition-all text-xs uppercase tracking-widest">
                                    Retrieve Layout
                                </button>
                            </div>
                        </div>

                        {!(audit.sections?.length > 0) ? (
                            <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-[2rem]">
                                <LayoutGrid size={48} className="mx-auto text-slate-100 mb-4" />
                                <p className="text-slate-400 italic">Branch layout not retrieved. Click "Retrieve Layout" to map locations for this audit.</p>
                            </div>
                        ) : filteredSections.length === 0 ? (
                            <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-[2rem]">
                                <LayoutGrid size={48} className="mx-auto text-slate-100 mb-4" />
                                <p className="text-slate-400 italic">No locations match your search.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredSections.map(section => (
                                    <div key={section.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl group relative hover:border-violet-200 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="px-3 py-1 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#0f172a]">
                                                {section.location?.code || 'LOC'}
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        </div>
                                        <h4 className="font-black text-[#0f172a] tracking-tight mb-6">{section.location?.name || section.location?.code}</h4>

                                        <div className="pt-4 border-t border-slate-100">
                                            {assigningTo === section.id ? (
                                                <select
                                                    className="w-full text-xs py-2 pr-8 border border-slate-200 rounded-xl outline-none"
                                                    onChange={(e) => handleAssignAuditor(section.id, e.target.value)}
                                                    onBlur={() => setAssigningTo(null)}
                                                    autoFocus
                                                    defaultValue=""
                                                >
                                                    <option value="">Unassigned</option>
                                                    {allUsers.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                                                </select>
                                            ) : (
                                                <div
                                                    onClick={() => setAssigningTo(section.id)}
                                                    className="flex items-center justify-between cursor-pointer group/user"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] ${section.assignedUser ? 'bg-violet-100 text-violet-600' : 'bg-slate-200 text-slate-400'}`}>
                                                            {section.assignedUser ? section.assignedUser.firstName?.charAt(0) : <UserPlus size={12} />}
                                                        </div>
                                                        <p className={`text-xs font-bold ${section.assignedUser ? 'text-slate-600' : 'text-slate-400'}`}>
                                                            {section.assignedUser ? `${section.assignedUser.firstName} ${section.assignedUser.lastName}` : 'Assign Auditor'}
                                                        </p>
                                                    </div>
                                                    <ChevronRight size={14} className="text-slate-200 group-hover/user:text-violet-500 transition-colors" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center text-slate-400 italic">
                    Audit settings module under development...
                </div>
            )}

            <SignOffModal
                isOpen={showSignOff}
                onClose={() => setShowSignOff(false)}
                onConfirm={handleSignOff}
                auditName={audit?.name}
            />
        </div>
    );
};

export default AuditDetail;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building2, Tag, ChevronRight, Home, Globe, Layout, Layers, Package } from 'lucide-react';
import api from '../lib/api';

const LocationNode = ({ location, allLocations, level = 0 }) => {
    const children = allLocations.filter(loc => loc.parentId === location.id);
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="ml-6 border-l-2 border-slate-100 pl-6 py-2">
            <div className="flex items-center gap-3 group">
                <div className={`p-2 rounded-lg ${level === 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                    <MapPin size={14} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-700">{location.code}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{location.locationType || 'Shelf'}</p>
                </div>
                {children.length > 0 && (
                    <button onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-slate-50 rounded-md transition-all text-slate-300">
                        <ChevronRight size={14} className={`transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
                    </button>
                )}
            </div>
            {expanded && children.length > 0 && (
                <div className="mt-2 space-y-1">
                    {children.map(child => (
                        <LocationNode key={child.id} location={child} allLocations={allLocations} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const BranchDetail = () => {
    const { id } = useParams();
    const [branch, setBranch] = useState(null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bRes, lRes] = await Promise.all([
                    api.get(`/branches/${id}`),
                    api.get(`/locations`, { params: { branchId: id } })
                ]);
                setBranch(bRes.data);
                setLocations(lRes.data);
            } catch (error) {
                console.error('Error fetching branch details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-20 text-center text-slate-400 italic">Syncing Branch Core...</div>;
    if (!branch) return <div className="p-20 text-center text-red-400 font-black uppercase tracking-widest">Branch Not Found</div>;

    const rootLocations = locations.filter(loc => !loc.parentId);

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header / Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Link to="/branches" className="hover:text-primary-sky transition-colors">Branches</Link>
                <ChevronRight size={10} />
                <span className="text-slate-900">{branch.branchName}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Branch Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[#0f172a] rotate-12">
                            <Building2 size={120} />
                        </div>
                        
                        <div className="relative z-10 space-y-8">
                            <div>
                                <h1 className="text-3xl font-black text-[#0f172a] tracking-tight mb-2">{branch.branchName}</h1>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest">{branch.status || 'Active'}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                    <div className="p-2 bg-white rounded-xl shadow-sm"><Tag size={16} className="text-primary-sky" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Parent Brand</p>
                                        <p className="text-sm font-bold text-[#0f172a]">{branch.brand?.brandName || 'Inovat8 Global'}</p>
                                        <p className="text-[9px] font-mono text-slate-400 uppercase">{branch.brand?.brandCode || 'INO-001'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                    <div className="p-2 bg-white rounded-xl shadow-sm"><Globe size={16} className="text-indigo-500" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Corporate Entity</p>
                                        <p className="text-sm font-bold text-[#0f172a]">{branch.tenant?.companyName || 'StockCount Corp'}</p>
                                        <p className="text-[9px] font-mono text-slate-400 uppercase">{branch.tenant?.companyCode || 'STK-GLOBAL'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Branch Metadata</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">POC</p>
                                        <p className="text-xs font-bold text-slate-700">{branch.poc || '--'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Code</p>
                                        <p className="text-xs font-mono font-bold text-slate-700">{branch.branchCode}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Location Hierarchy */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0f172a] rounded-[2.5rem] p-10 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <Layers size={140} />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black tracking-tight mb-2">Location Infrastructure</h2>
                            <p className="text-slate-400 text-sm font-medium">Mapped hierarchical layout for operational audits</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Hierarchical Tree View</p>
                            <span className="text-[10px] font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-full">{locations.length} Nodes</span>
                        </div>

                        {rootLocations.length > 0 ? (
                            <div className="space-y-2">
                                {rootLocations.map(loc => (
                                    <LocationNode key={loc.id} location={loc} allLocations={locations} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                                    <Package size={32} />
                                </div>
                                <p className="text-slate-400 italic text-sm">No locations mapped to this branch yet.</p>
                                <button className="text-[10px] font-black text-primary-sky uppercase tracking-widest hover:underline">Import Layout Template</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BranchDetail;

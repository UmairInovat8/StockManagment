import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Activity,
    Package,
    Shield,
    AlertCircle,
    TrendingUp,
    Clock,
    Layers,
    Zap,
    Globe,
    ArrowUpRight,
    Target,
    Users
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalAudits: 0,
        activeAuditors: 0,
        itemsLogged: '0',
        varianceRate: 0,
        recentActivity: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get(`${API}/tenant/dashboard`);
                if (res.data) setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-10 animate-fade-up">
            {/* Premium Hero Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col lg:flex-row justify-between items-center gap-10 shadow-sm relative overflow-hidden">
                    <div className="relative z-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <Target size={12} className="text-[#38bdf8]" /> Global Operational Health
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-[#0f172a] tracking-tighter mb-4">
                            Total Stock <span className="text-[#38bdf8]">Velocity</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-lg mb-8 text-sm lg:text-base">
                            Real-time precision audit across 14 active nodes. Managed and encrypted by athgadlang architecture.
                        </p>
                        <div className="flex gap-4 justify-center lg:justify-start">
                            <button className="bg-[#0f172a] text-white px-8 py-4 rounded-xl font-bold text-sm shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all active:scale-95">
                                Executive Report
                            </button>
                            <button className="bg-slate-50 border border-slate-100 px-8 py-4 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">
                                System Node Log
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-md relative z-10">
                        {[
                            { label: 'Network Uptime', val: '99.9%', color: 'text-emerald-500' },
                            { label: 'Active Sessions', val: '142', color: 'text-[#38bdf8]' },
                            { label: 'API Latency', val: '18ms', color: 'text-[#38bdf8]' },
                            { label: 'Data Encryption', val: 'RSA-4k', color: 'text-slate-400' }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.label}</p>
                                <p className={`text-xl font-black ${item.color}`}>{item.val}</p>
                            </div>
                        ))}
                    </div>

                    {/* Decorative Background */}
                    <div className="absolute top-[-50%] right-[-10%] w-[30rem] h-[30rem] bg-slate-50 blur-[100px] rounded-full" />
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Gross Audits', val: stats.totalAudits, trend: '+4', icon: Clock, color: 'text-[#0f172a] bg-slate-50' },
                    { title: 'Live Auditors', val: stats.activeAuditors, trend: 'Online', icon: Users, color: 'text-[#38bdf8] bg-sky-50' },
                    { title: 'SKU throughput', val: stats.itemsLogged, trend: 'High', icon: Layers, color: 'text-emerald-500 bg-emerald-50' },
                    { title: 'Variance index', val: `${stats.varianceRate}%`, trend: '-0.2%', icon: AlertCircle, color: 'text-red-500 bg-red-50' }
                ].map((m, i) => (
                    <div key={i} className="clean-card p-10 group hover:-translate-y-2 transition-all">
                        <div className="flex justify-between items-start mb-8">
                            <div className={`w-14 h-14 rounded-2xl ${m.color} flex items-center justify-center transition-transform group-hover:rotate-6`}>
                                <m.icon size={28} />
                            </div>
                            <div className="text-[10px] font-black px-2 py-1 rounded-lg bg-slate-50 text-slate-300 uppercase tracking-widest border border-slate-100">
                                {m.trend}
                            </div>
                        </div>
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{m.title}</h3>
                        <p className="text-4xl font-black text-[#0f172a] tracking-tighter">{m.val}</p>
                    </div>
                ))}
            </div>

            {/* Core Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 clean-card p-12">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-2xl font-black text-[#0f172a] tracking-tight mb-1 flex items-center gap-3">
                                <TrendingUp size={24} className="text-[#38bdf8]" />
                                Audit Intelligence Velocity
                            </h2>
                            <p className="text-slate-400 text-sm font-medium">Monthly efficiency metrics managed by athgadlang</p>
                        </div>
                        <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-[#0f172a] transition-all">
                            <ArrowUpRight size={18} />
                        </button>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4">
                        {(stats.auditVelocity && stats.auditVelocity.length === 12 ? stats.auditVelocity : [0,0,0,0,0,0,0,0,0,0,0,0]).map((v, i) => {
                            // Scale visual height smoothly (cap at 100)
                            const displayHeight = Math.max(5, Math.min(100, v));
                            return (
                            <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                                <div
                                    className={`w-full rounded-t-xl transition-all duration-500 cursor-pointer ${i === 11 ? 'bg-[#0f172a]' : 'bg-slate-100 group-hover:bg-[#38bdf8]'}`}
                                    style={{ height: `${displayHeight}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0f172a] text-white text-[10px] font-black py-1 px-2 rounded-lg transition-all">
                                        {v}
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>

                    <div className="flex justify-between mt-8 pt-8 border-t border-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <span>P-1 Epoch</span>
                        <span>Audit Phase 4</span>
                        <span>Current Node</span>
                    </div>
                </div>

                <div className="clean-card p-12">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Recent Activity</h2>
                        <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                    </div>

                    <div className="space-y-8">
                        {stats.recentActivity && stats.recentActivity.length > 0 ? stats.recentActivity.map((log, i) => {
                            const IconComponent = log.iconName === 'Shield' ? Shield : Globe;
                            return (
                                <div key={i} className="flex gap-5 group items-start">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#0f172a] group-hover:text-white transition-all">
                                        <IconComponent size={20} />
                                    </div>
                                    <div className="flex-1 border-b border-slate-50 pb-6">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">{log.user}</span>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase">{log.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium">{log.action}</p>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center text-slate-400 text-sm py-8">No recent activity found.</div>
                        )}
                    </div>

                    <button className="w-full mt-10 btn-primary !py-4 text-[10px] uppercase tracking-[0.3em]">
                        View Comprehensive Terminal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

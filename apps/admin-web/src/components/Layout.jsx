import React from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, ChevronDown, User, Zap, ShieldCheck } from 'lucide-react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">
                {/* Clean minimalist header */}
                <header className="h-20 px-10 flex items-center justify-between border-b border-slate-100 bg-white z-40">
                    <div className="flex items-center gap-8 w-full max-w-2xl px-4 py-2 relative group uppercase tracking-widest font-black text-[10px] text-slate-300">
                        <div className="flex items-center gap-4">
                            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                            Session Active / athgadlang Instance 74
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 group cursor-pointer px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#0f172a] transition-colors">
                                <Search size={16} />
                            </div>
                        </div>

                        <button className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all active:scale-95">
                            <Bell size={18} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>

                        <div className="h-8 w-px bg-slate-100 mx-2" />

                        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-[#0f172a] uppercase tracking-tighter mb-0.5">Control Center</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lead Architect</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0f172a] border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
                                <ShieldCheck size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content with subtle scrollbar */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                    <div className="p-10 max-w-7xl mx-auto min-h-full">
                        {children}
                    </div>

                    <footer className="p-10 border-t border-slate-100 flex justify-between items-center bg-white">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">© 2026 athgadlang Global</p>
                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Privacy Protocol</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Node Status</span>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default Layout;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    MapPin,
    Package,
    ClipboardList,
    Users,
    Settings,
    LogOut,
    BarChart3,
    History,
    ChevronRight,
    Globe,
    Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoWide from '../assets/branding/logo-wide.jpg';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/', group: 'Analytics' },
        { name: 'Item Master', icon: Package, path: '/items', group: 'Inventory' },
        { name: 'Audit Protocol', icon: ClipboardList, path: '/audits', group: 'Audit' },
        { name: 'Reporting', icon: BarChart3, path: '/reports', group: 'Analytics' },
        { name: 'Company', icon: Globe, path: '/company', group: 'Organization' },
        { name: 'Brands', icon: Tag, path: '/brands', group: 'Organization' },
        { name: 'Branches', icon: Settings, path: '/branches', group: 'Organization' },
        { name: 'Location Hierarchy', icon: MapPin, path: '/locations', group: 'Admin' },
        { name: 'User Management', icon: Users, path: '/users', group: 'Admin' },
        { name: 'Activity Logs', icon: History, path: '/logs', group: 'Audit' },
    ];

    const groupedItems = navItems.reduce((acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
    }, {});

    return (
        <aside className="w-72 h-screen bg-white text-slate-600 flex flex-col fixed left-0 top-0 border-r border-slate-100 shadow-[20px_0_40px_rgba(0,0,0,0.02)] z-50 font-sans">
            {/* Logo Section */}
            <div className="p-8 pb-10 flex flex-col items-center gap-4 relative">
                <img src={logoWide} alt="athgadlang" className="h-10 object-contain" />
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">Cortex / Global</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-5 py-4 space-y-10 overflow-y-auto custom-scrollbar">
                {Object.entries(groupedItems).map(([group, items]) => (
                    <div key={group}>
                        <p className="px-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">
                            {group}
                        </p>
                        <div className="space-y-1">
                            {items.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 group ${location.pathname === item.path
                                        ? 'bg-slate-50 text-[#0f172a] font-bold border-r-4 border-[#38bdf8]'
                                        : 'hover:bg-slate-50 hover:text-[#0f172a]'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon size={18} className={location.pathname === item.path ? 'text-[#38bdf8]' : 'text-slate-400 group-hover:text-[#38bdf8] transition-colors'} />
                                        <span className="text-sm font-semibold tracking-tight">{item.name}</span>
                                    </div>
                                    <ChevronRight size={14} className={`transition-all ${location.pathname === item.path ? 'opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Profile Section */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/50">
                <div className="flex items-center gap-4 px-2 mb-6 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-[#0f172a] flex items-center justify-center font-black text-white text-xs shadow-lg group-hover:scale-105 transition-transform">
                        {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[11px] font-black text-[#0f172a] truncate uppercase tracking-tight">{user?.firstName} {user?.lastName}</p>
                        <p className="text-[9px] text-slate-400 font-bold truncate uppercase tracking-widest flex items-center gap-1">
                            <Globe size={10} /> Lead Architect
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center justify-center gap-3 w-full py-4 text-slate-400 hover:text-red-500 font-black transition-all text-[10px] uppercase tracking-[0.2em] border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-100 active:scale-95"
                >
                    <LogOut size={14} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

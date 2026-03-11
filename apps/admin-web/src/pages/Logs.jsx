import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { History, Search, Shield, Clock, AlertCircle } from 'lucide-react';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            // For POC, simulate real system logs
            setTimeout(() => {
                setLogs([
                    { id: 1, action: 'SECTION_LOCKED', details: 'A-01 locked by Auditor 4', user: 'system_daemon', time: '2m ago', level: 'INFO' },
                    { id: 2, action: 'ITEM_SYNC_BATCH', details: 'Imported 450 count events', user: 'sync_worker', time: '12m ago', level: 'SUCCESS' },
                    { id: 3, action: 'AUTH_FAILURE', details: 'Incorrect password for manager@athgadlang.com', user: 'security_gate', time: '1h ago', level: 'WARNING' },
                    { id: 4, action: 'VARIANCE_EXPORT', details: 'Report generated for Audit ID #102', user: 'Lead Architect', time: '2h ago', level: 'INFO' },
                    { id: 5, action: 'DB_BACKUP_SUCCESS', details: 'Snapshot cumulative_v24 created', user: 'cloud_infra', time: '3h ago', level: 'SUCCESS' },
                    { id: 6, action: 'ITEM_IMPORT_ABORT', details: 'Missing SKU column in row 452', user: 'csv_processor', time: '5h ago', level: 'CRITICAL' },
                ]);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error fetching logs', error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getLevelColor = (level) => {
        switch (level) {
            case 'SUCCESS': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
            case 'WARNING': return 'text-amber-500 bg-amber-50 border-amber-100';
            case 'CRITICAL': return 'text-red-500 bg-red-50 border-red-100';
            default: return 'text-blue-500 bg-blue-50 border-blue-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Audit Logs</h1>
                    <p className="text-slate-500 font-medium">Immutable record of all inventory and access events</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all uppercase tracking-widest">
                        Download JSON
                    </button>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search system events..."
                        className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-600 w-full"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td className="text-center py-20 text-slate-400 italic">Streaming logs from secure storage...</td></tr>
                            ) : logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg border ${getLevelColor(log.level)}`}>
                                                {log.level === 'CRITICAL' ? <AlertCircle size={18} /> : <Clock size={18} />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-black text-slate-800 text-sm tracking-tight">{log.action}</span>
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getLevelColor(log.level)}`}>{log.level}</span>
                                                </div>
                                                <p className="text-slate-500 text-sm font-medium">{log.details}</p>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                                                        <Shield size={10} /> Origin: {log.user}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                                                        <Clock size={10} /> {log.time}
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-primary-brand transition-all">
                                                <Search size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Logs;

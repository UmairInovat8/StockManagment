import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Download, Filter, TrendingDown, TrendingUp, Minus } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Reports = () => {
    const [variances, setVariances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [auditId, setAuditId] = useState('DEFAULT_AUDIT_ID');

    const fetchVariance = async () => {
        try {
            const response = await axios.get(`${API}/reports/audits/${auditId}/variance`);
            setVariances(response.data);
        } catch (error) {
            console.error('Error fetching variance', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVariance();
    }, [auditId]);

    const handleExport = async () => {
        try {
            const response = await axios.get(`${API}/reports/audits/${auditId}/variance/export`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `variance_report_${auditId}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Export failed.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Variance Reporting</h1>
                    <p className="text-slate-500">Analyze discrepancies between SOH and physical counts</p>
                </div>
                <button onClick={handleExport} className="btn-primary flex items-center gap-2">
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            <div className="glass-card p-4 flex gap-4">
                <div className="flex-1 flex items-center gap-3 px-4 border-r border-slate-100">
                    <Filter size={18} className="text-slate-400" />
                    <select className="bg-transparent border-none text-sm font-medium focus:ring-0 text-slate-700 w-full" onChange={(e) => setAuditId(e.target.value)}>
                        <option value="DEFAULT_AUDIT_ID">Select Audit Session...</option>
                        <option value="ID-1">Q1 Storewide StockCount</option>
                    </select>
                </div>
                <div className="flex-1 flex gap-2">
                    <button className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold uppercase border border-emerald-100 italic">No Variance</button>
                    <button className="px-4 py-2 rounded-lg bg-amber-50 text-amber-600 text-xs font-bold uppercase border border-amber-100 italic">Discrepancy</button>
                    <button className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold uppercase border border-red-100 italic">Critical Only</button>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Item Details</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">System SOH</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Physical Count</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Variance</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-20 text-slate-400">Loading variance data...</td></tr>
                        ) : variances.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-20 text-slate-400 italic">No data available for this audit session.</td></tr>
                        ) : (
                            variances.map((v) => (
                                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-800">{v.item.name}</p>
                                        <p className="text-xs font-mono text-slate-400">SKU: {v.item.sku}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-600">{v.sohQuantity}</td>
                                    <td className="px-6 py-4 text-right font-bold text-primary-dark">{v.countedQuantity}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${v.variance < 0 ? 'text-red-500' : v.variance > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {v.variance > 0 ? `+${v.variance}` : v.variance}
                                    </td>
                                    <td className="px-6 py-4">
                                        {v.variance === 0 ? (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase border border-emerald-100 italic">Match</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase border border-red-100 italic">Discrepancy</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;

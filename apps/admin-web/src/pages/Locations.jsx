import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, ChevronRight, ChevronDown, Plus, QrCode } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const LocationNode = ({ node, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="ml-4 border-l border-slate-100 pl-4 py-2">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                {hasChildren ? (
                    isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />
                ) : <div className="w-3.5" />}
                <MapPin size={16} className={level === 0 ? "text-primary-brand" : "text-slate-400"} />
                <span className="text-sm font-medium text-slate-700">{node.code}</span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 rounded hidden group-hover:block">QR: {node.qrValue}</span>
            </div>
            {isOpen && hasChildren && (
                <div className="mt-1">
                    {node.children.map(child => <LocationNode key={child.id} node={child} level={level + 1} />)}
                </div>
            )}
        </div>
    );
};

const Locations = () => {
    const [tree, setTree] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTree = async () => {
        try {
            const response = await axios.get(`${API}/locations/tree?branchId=DEFAULT`);
            setTree(response.data);
        } catch (error) {
            console.error('Error fetching tree', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTree();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Hierarchical Locations</h1>
                    <p className="text-slate-500">Design aisles, shelves, and bin configurations</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50">
                        <QrCode size={18} /> Print All QR
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus size={18} /> New Root
                    </button>
                </div>
            </div>

            <div className="glass-card p-8 min-h-[400px]">
                {loading ? (
                    <div className="text-center py-20 text-slate-400 italic">Building location tree...</div>
                ) : tree.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 italic">
                        <p className="mb-4">No locations defined for this branch.</p>
                        <button className="btn-primary text-xs py-2 px-4">Generate Base Layout</button>
                    </div>
                ) : (
                    <div className="max-w-xl">
                        {tree.map(node => <LocationNode key={node.id} node={node} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Locations;

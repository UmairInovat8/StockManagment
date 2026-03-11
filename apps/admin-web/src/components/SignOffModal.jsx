import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, PenTool, User, Briefcase, MessageSquare } from 'lucide-react';
import ModalPortal from './ModalPortal';

const SignOffModal = ({ isOpen, onClose, onConfirm, auditName }) => {
    const [formData, setFormData] = useState({
        auditorTitle: 'Lead Auditor',
        clientName: '',
        clientTitle: 'Branch Manager',
        comments: '',
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 bg-[#0f172a]/70 backdrop-blur-md flex items-center justify-center p-4 z-[9999] overflow-y-auto">
                <div
                    className="w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] overflow-hidden my-auto animate-fade-up border border-white/20"
                    onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); handleSubmit(e); } }}
                >
                    {/* Header */}
                    <div className="bg-[#0f172a] p-8 text-white relative">
                        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                                <ShieldCheck size={24} className="text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Final Protocol Sign-off</h2>
                                <p className="text-slate-400 text-sm font-medium">Certification of {auditName}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Internal Sign-off */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <PenTool size={16} className="text-violet-500" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Internal Audit Lead</h3>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Official Designation</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input
                                            className="clean-input !pl-12"
                                            value={formData.auditorTitle}
                                            onChange={e => setFormData({ ...formData, auditorTitle: e.target.value })}
                                            placeholder="e.g. Senior Auditor"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* External Sign-off */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <User size={16} className="text-[#38bdf8]" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client Representative</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name *</label>
                                        <input
                                            className="clean-input"
                                            value={formData.clientName}
                                            onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                                            placeholder="Enter client's legal name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Designation</label>
                                        <input
                                            className="clean-input"
                                            value={formData.clientTitle}
                                            onChange={e => setFormData({ ...formData, clientTitle: e.target.value })}
                                            placeholder="e.g. Branch Supervisor"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquare size={16} className="text-slate-400" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit Remarks & Certification</h3>
                            </div>
                            <textarea
                                className="clean-input min-h-[100px] resize-none pt-4"
                                value={formData.comments}
                                onChange={e => setFormData({ ...formData, comments: e.target.value })}
                                placeholder="Provide any critical observation or variance justification here..."
                            />
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-500 font-black uppercase tracking-widest text-xs border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all">
                                Review More
                            </button>
                            <button type="submit" className="flex-[2] bg-[#0f172a] text-white font-black py-4 rounded-3xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs hover:bg-black transition-all shadow-2xl shadow-slate-200 group">
                                <CheckCircle2 size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                                Certify & Close Audit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
};

export default SignOffModal;

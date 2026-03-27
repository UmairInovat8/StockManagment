import React from 'react';
import { Lock, LogIn, ShieldAlert } from 'lucide-react';

const AuthAlert = ({ onLogin }) => {
    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[10000] flex items-center justify-center p-6 animate-fade-in">
            <div className="max-w-md w-full bg-[#0f172a]/80 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-12 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden animate-fade-up text-center border-t-white/10">
                {/* Background Decor */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[100px] rounded-full" />
                
                <div className="relative z-10 space-y-8">
                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20 transform rotate-3">
                        <Lock className="text-white transform -rotate-3" size={40} strokeWidth={2.5} />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-white tracking-tight font-display">
                            Session Expired
                        </h2>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed px-4 font-sans">
                            Your secure session has reached its limit. Please log in again to continue your catalog audit.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={onLogin}
                            className="w-full bg-white text-[#0f172a] font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-50 transition-all active:scale-95 shadow-xl uppercase tracking-[0.2em] text-[10px]"
                        >
                            <LogIn size={18} />
                            Log In Again
                        </button>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest pt-4">
                        <ShieldAlert size={12} />
                        Secured by StockCount Audit
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthAlert;

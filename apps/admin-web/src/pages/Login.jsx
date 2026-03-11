import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import loginHero from '../assets/branding/login_hero.png';
import logoWide from '../assets/branding/logo-wide.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 lg:p-10 font-sans">
            <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 flex flex-col overflow-hidden min-h-[700px] animate-fade-up border border-slate-50">

                <div className="w-full p-10 lg:p-16 flex flex-col justify-center text-center">
                    <div className="mb-10 flex flex-col items-center">
                        <img src={logoWide} alt="athgadlang" className="h-10 object-contain mb-8 opacity-90" />
                        <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-3">Login</h1>
                        <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">If you are already a member, easily log in</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[11px] font-bold italic animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 text-left max-w-md mx-auto w-full">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                className="clean-input !bg-slate-50 border-transparent focus:!bg-white focus:!border-slate-100 transition-all rounded-2xl"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="clean-input !bg-slate-50 border-transparent focus:!bg-white focus:!border-slate-100 transition-all rounded-2xl"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0f172a] hover:bg-black text-white font-black py-4.5 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 mt-4 h-14 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <ShieldCheck className="animate-pulse" size={18} />
                                    Authorizing...
                                </span>
                            ) : (
                                <>
                                    Login
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-10 flex items-center max-w-md mx-auto w-full">
                        <div className="flex-1 h-[1px] bg-slate-100" />
                        <span className="px-5 text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span>
                        <div className="flex-1 h-[1px] bg-slate-100" />
                    </div>

                    <div className="max-w-md mx-auto w-full space-y-6">
                        <button className="btn-google w-full rounded-2xl border-slate-100 hover:bg-slate-50 transition-all py-3.5 flex items-center justify-center gap-3">
                            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Login with Google</span>
                        </button>

                        <div className="flex flex-col items-center gap-4">
                            <button className="text-[10px] font-black text-slate-400 hover:text-[#0f172a] transition-all uppercase tracking-widest">Forgot your password?</button>
                            <div className="pt-6 border-t border-slate-50 w-full flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No account?</span>
                                <Link to="/register" className="text-[10px] font-black text-[#38bdf8] uppercase tracking-widest hover:underline">Join Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

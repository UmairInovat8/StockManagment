import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building, ArrowRight, ShieldCheck } from 'lucide-react';
import logoWide from '../assets/branding/logo-wide.jpg';

const Register = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const success = await register(formData);
            if (success) {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please check your details and try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 lg:p-10 font-sans">
            <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 flex flex-col overflow-hidden min-h-[800px] animate-fade-up border border-slate-50">

                <div className="w-full p-10 lg:p-16 flex flex-col justify-center text-center">
                    <div className="mb-8 flex flex-col items-center">
                        <img src={logoWide} alt="athgadlang" className="h-10 object-contain mb-8 opacity-90" />
                        <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-3">Get Started</h1>
                        <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">Create your company account and start auditing</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[11px] font-bold italic animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 text-left max-w-md mx-auto w-full">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 text-nowrap">First Name</label>
                                <input
                                    name="firstName"
                                    className="clean-input !bg-slate-50 border-transparent focus:!bg-white focus:!border-slate-100 transition-all rounded-2xl"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 text-nowrap">Last Name</label>
                                <input
                                    name="lastName"
                                    className="clean-input !bg-slate-50 border-transparent focus:!bg-white focus:!border-slate-100 transition-all rounded-2xl"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                            <input
                                name="companyName"
                                className="clean-input !bg-slate-50 border-transparent focus:!bg-white focus:!border-slate-100 transition-all rounded-2xl"
                                placeholder="Acme Corp"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                className="clean-input !bg-slate-50 border-transparent focus:!bg-white focus:!border-slate-100 transition-all rounded-2xl"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-1 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                className="clean-input !bg-slate-50 border-transparent focus:!bg-white focus:!border-slate-100 transition-all rounded-2xl"
                                placeholder="••••••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0f172a] hover:bg-black text-white font-black py-4.5 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 mt-4 h-14 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <ShieldCheck className="animate-pulse" size={18} />
                                    Creating Account...
                                </span>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-50 max-w-md mx-auto w-full flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Already have an account?</span>
                        <Link to="/login" className="text-[10px] font-black text-[#38bdf8] uppercase tracking-widest hover:underline">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

import React from 'react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error(' [Global Error Caught]:', error, errorInfo);
        // Future-Proof: Integrate with Sentry or LogRocket here
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/'; // Hard reset for safety
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[9999] bg-[#0f172a] flex items-center justify-center p-6 font-sans">
                    {/* Glassmorphic Container */}
                    <div className="relative w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 text-center shadow-2xl overflow-hidden group">
                        {/* Animated Glow Effect */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-500/20 rounded-full blur-[80px] animate-pulse group-hover:bg-red-500/30 transition-all duration-700"></div>
                        
                        {/* Error Icon */}
                        <div className="relative mb-8 flex justify-center">
                            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20 animate-fade-down">
                                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>

                        {/* Text Gradient */}
                        <h1 className="text-3xl font-black text-white mb-4 tracking-tight animate-fade-up">
                            Something Went <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-600">Wrong</span>
                        </h1>
                        
                        <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed max-w-sm mx-auto animate-fade-up delay-100">
                            We've encountered an unexpected issue while processing your request. Our team has been notified.
                        </p>

                        <button 
                            onClick={this.handleReset}
                            className="relative group/btn inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0f172a] font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/10 animate-fade-up delay-200"
                        >
                            <span>Return to Safety</span>
                            <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>

                        {import.meta.env.DEV && (
                            <div className="mt-8 pt-8 border-t border-white/5 text-left overflow-auto max-h-32">
                                <p className="text-[10px] font-mono text-slate-500 lowercase opacity-50">
                                    {this.state.error?.toString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;

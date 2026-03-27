import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import ModalPortal from './ModalPortal';

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Delete", 
    cancelText = "Cancel",
    confirmLabel, // Optional alias for confirmText
    type = "danger", // danger, warning, info
    loading = false
}) => {
    if (!isOpen) return null;

    const actualConfirmText = confirmLabel || confirmText;

    const colors = {
        danger: {
            bg: 'bg-red-50',
            icon: 'text-red-500',
            button: 'bg-red-500 hover:bg-red-600 shadow-red-200',
            border: 'border-red-100'
        },
        warning: {
            bg: 'bg-amber-50',
            icon: 'text-amber-500',
            button: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200',
            border: 'border-amber-100'
        },
        info: {
            bg: 'bg-blue-50',
            icon: 'text-blue-500',
            button: 'bg-blue-500 hover:bg-blue-600 shadow-blue-200',
            border: 'border-blue-100'
        }
    }[type];

    return (
        <ModalPortal>
            <div className={`fixed inset-0 bg-[#0f172a]/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in ${loading ? 'pointer-events-none' : ''}`}>
                <div className={`w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl text-center space-y-8 animate-fade-up border ${colors.border}`}>
                    <div className={`w-20 h-20 ${colors.bg} rounded-3xl flex items-center justify-center mx-auto shadow-inner relative overflow-hidden`}>
                        {loading ? <Loader2 className={`animate-spin ${colors.icon}`} size={32} /> : (type === 'danger' ? <Trash2 className={colors.icon} size={32} /> : <AlertTriangle className={colors.icon} size={32} />)}
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-[#0f172a]">{title}</h3>
                        <p className="text-slate-400 text-xs font-medium px-4 leading-relaxed">{message}</p>
                    </div>

                    <div className="flex gap-4">
                        {!loading && (
                            <button 
                                onClick={onClose}
                                className="flex-1 py-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button 
                            disabled={loading}
                            onClick={onConfirm}
                            className={`flex-[2] text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${colors.button} ${loading ? 'opacity-80' : ''}`}
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />}
                            {actualConfirmText}
                        </button>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
};

export default ConfirmModal;

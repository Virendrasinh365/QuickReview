import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = "success", duration = 3500) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    const success = (msg, dur) => addToast(msg, "success", dur);
    const error = (msg, dur) => addToast(msg, "error", dur);
    const info = (msg, dur) => addToast(msg, "info", dur);

    return (
        <ToastContext.Provider value={{ addToast, success, error, info, removeToast }}>
            {children}
            <div className="toast-container" aria-live="polite">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast-item toast-${toast.type} animate-slide-in`}>
                        <div className="toast-icon">
                            {toast.type === "success" && <CheckCircle2 size={18} />}
                            {toast.type === "error" && <AlertCircle size={18} />}
                            {toast.type === "info" && <Info size={18} />}
                        </div>
                        <div className="toast-message">{toast.message}</div>
                        <button
                            className="toast-close-btn"
                            onClick={() => removeToast(toast.id)}
                            aria-label="Close notification"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

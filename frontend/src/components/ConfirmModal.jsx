import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({
    isOpen,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    isDestructive = true,
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay animate-fade-in" onClick={onCancel}>
            <div className="modal-card modal-confirm animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="confirm-icon-badge">
                        <AlertTriangle size={22} className="text-warning" />
                    </div>
                    <button className="modal-close" onClick={onCancel} aria-label="Close">
                        <X size={18} />
                    </button>
                </div>
                <div className="modal-body">
                    <h3 className="confirm-title">{title}</h3>
                    <p className="confirm-message">{message}</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="admin-btn outline" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`admin-btn ${isDestructive ? "destructive" : "primary"}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

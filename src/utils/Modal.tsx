import React, { useEffect } from "react";

type propTypes = {
    open?: boolean;
    onClose?: () => void;
    children: React.ReactNode
};

const Modal: React.FC<propTypes> = ({ open, onClose, children }) => {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    if (!open) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl p-6  relative transform transition-all duration-300 animate-in slide-in-from-bottom-4"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    className="absolute top-3 right-3  hover:text-gray-600"
                    onClick={onClose}
                    aria-label="Fechar modal"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="pr-8">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
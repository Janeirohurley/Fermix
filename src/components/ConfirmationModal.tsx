import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    onConfirm,
    onCancel,
    type = 'danger'
}) => {
    if (!isOpen) return null;

    const getIconColor = () => {
        switch (type) {
            case 'danger':
                return 'text-red-400';
            case 'warning':
                return 'text-yellow-400';
            case 'info':
                return 'text-blue-400';
            default:
                return 'text-red-400';
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case 'danger':
                return 'bg-red-600 hover:bg-red-700';
            case 'warning':
                return 'bg-yellow-600 hover:bg-yellow-700';
            case 'info':
                return 'bg-blue-600 hover:bg-blue-700';
            default:
                return 'bg-red-600 hover:bg-red-700';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl max-w-md w-full mx-4"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-6 h-6 ${getIconColor()}`} />
                        <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-200 rounded-md hover:bg-gray-700 transition-colors p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t border-gray-700 bg-gray-900 rounded-b-lg">
                    <motion.button
                        onClick={onCancel}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        {cancelLabel}
                    </motion.button>
                    <motion.button
                        onClick={onConfirm}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 text-white rounded-md transition-colors ${getButtonColor()}`}
                    >
                        {confirmLabel}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default ConfirmationModal;

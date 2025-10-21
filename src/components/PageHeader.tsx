import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageHeaderProps = {
    /** Titre principal de la page */
    title: string;

    /** Sous-titre descriptif */
    subtitle?: string;

    /** Texte du bouton d’action */
    actionLabel?: string;

    /** Icône à afficher avant le texte du bouton */
    actionIcon?: ReactNode;

    /** Fonction à exécuter quand on clique sur le bouton */
    onActionClick?: () => void;

    /** Désactive le bouton d’action */
    disabled?: boolean;
};

export default function PageHeader({
    title,
    subtitle,
    actionLabel,
    actionIcon,
    onActionClick,
    disabled = false,
}: PageHeaderProps) {
    return (
        <div className="shadow-md border-b border-gray-700 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    {/* Left side */}
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
                        {subtitle && (
                            <p className="text-gray-400 text-sm">{subtitle}</p>
                        )}
                    </div>

                    {/* Right side: Action button */}
                    {actionLabel && onActionClick && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onActionClick}
                            disabled={disabled}
                            className={`flex items-center px-4 py-2 rounded-md transition-colors shadow-sm ${disabled
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                        >
                            {actionIcon && <span className="w-4 h-4 mr-2">{actionIcon}</span>}
                            {actionLabel}
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}

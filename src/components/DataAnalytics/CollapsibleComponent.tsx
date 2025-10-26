import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CollapsibleComponentProps {
    title: string;
    children: React.ReactNode;
    defaultCollapsed?: boolean;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
}

function CollapsibleComponent({
    title,
    children,
    defaultCollapsed = false,
    className = "",
    headerClassName = "",
    contentClassName = "",
}: CollapsibleComponentProps) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    return (
        <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
            <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-700 transition-colors ${headerClassName}`}
            >
                <h3 className="text-lg font-base ">{title}</h3>
                <motion.div
                    animate={{ rotate: isCollapsed ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </button>
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`border-t border-gray-700 overflow-hidden ${contentClassName}`}
                    >
                        <div className="pt-3">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default CollapsibleComponent;

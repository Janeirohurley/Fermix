import React, { useState, useEffect } from 'react';
import { Minus, X, Maximize2, Minimize2 } from 'lucide-react';

declare global {
    interface Window {
        electronAPI?: {
            minimizeWindow: () => Promise<void>;
            maximizeWindow: () => Promise<void>;
            closeWindow: () => Promise<void>;
            isMaximized: () => Promise<boolean>;
            onMaximizeChange: (callback: (isMaximized: boolean) => void) => void;
            exportData: (data: unknown) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>;
            importData: () => Promise<{ success: boolean; data?: unknown; filePath?: string; canceled?: boolean; error?: string }>;
            selectFile: (options: { title?: string; buttonLabel?: string; filters?: Array<{ name: string; extensions: string[] }> }) => Promise<{ canceled: boolean; filePaths: string[] }>;
            saveFile: (options: { title?: string; buttonLabel?: string; filters?: Array<{ name: string; extensions: string[] }> }) => Promise<{ canceled: boolean; filePath?: string }>;
        };
    }
}

const CustomTitleBar: React.FC = () => {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        // Vérifier l'état initial de maximisation
        const checkMaximized = async () => {
            if (window.electronAPI) {
                const maximized = await window.electronAPI.isMaximized();
                setIsMaximized(maximized);
            }
        };

        checkMaximized();

        // Écouter les changements de maximisation
        if (window.electronAPI) {
            window.electronAPI.onMaximizeChange((maximized: boolean) => {
                setIsMaximized(maximized);
            });
        }
    }, []);

    const handleMinimize = async () => {
        if (window.electronAPI) {
            await window.electronAPI.minimizeWindow();
        }
    };

    const handleMaximize = async () => {
        if (window.electronAPI) {
            await window.electronAPI.maximizeWindow();
        }
    };

    const handleClose = async () => {
        if (window.electronAPI) {
            await window.electronAPI.closeWindow();
        }
    };

    return (
        <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 select-none drag-handle">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-sm font-medium">Fermix - Admin Panel</span>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={handleMinimize}
                    className="p-1 hover:bg-gray-700 rounded transition-colors no-drag"
                    title="Minimiser"
                >
                    <Minus className="w-4 h-4" />
                </button>

                <button
                    onClick={handleMaximize}
                    className="p-1 hover:bg-gray-700 rounded transition-colors no-drag"
                    title={isMaximized ? "Restaurer" : "Maximiser"}
                >
                    {isMaximized ? (
                        <Minimize2 className="w-4 h-4" />
                    ) : (
                        <Maximize2 className="w-4 h-4" />
                    )}
                </button>

                <button
                    onClick={handleClose}
                    className="p-1 hover:bg-red-600 rounded transition-colors no-drag"
                    title="Fermer"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default CustomTitleBar;

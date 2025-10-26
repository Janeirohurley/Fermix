
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Settings,
    Menu,
    X,
    Download,
    Upload,
    BarChart3
} from "lucide-react";
import CustomTitleBar from "./CustomTitleBar";
import ExportImportModal from "./ExportImportModal";

export default function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isExportImportModalOpen, setIsExportImportModalOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const openExportImportModal = () => {
        setIsExportImportModalOpen(true);
    };

    const closeExportImportModal = () => {
        setIsExportImportModalOpen(false);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
            {/* Barre de titre personnalisée */}
            <CustomTitleBar />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`${isSidebarCollapsed ? "w-16" : "w-64"
                        } bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out`}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                        {!isSidebarCollapsed && (
                            <div className="flex items-center gap-2">
                                <LayoutDashboard className="w-6 h-6 text-blue-400" />
                                <span className="text-xl font-bold">Admin Panel</span>
                            </div>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700"
                        >
                            {isSidebarCollapsed ? (
                                <Menu className="w-5 h-5" />
                            ) : (
                                <X className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-blue-700 hover:text-white"
                                } `
                            }
                            title="Dashboard"
                        >
                            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                            {!isSidebarCollapsed && <span>Dashboard</span>}
                        </NavLink>
                        <NavLink
                            to="/data-visualization"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-blue-700 hover:text-white"
                                } `
                            }
                            title="Data Visualization"
                        >
                            <BarChart3 className="w-5 h-5 flex-shrink-0" />
                            {!isSidebarCollapsed && <span>Data Visualization</span>}
                        </NavLink>

                        <NavLink
                            to="/forms"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-blue-700 hover:text-white"
                                } `
                            }
                            title="Forms"
                        >
                            <FileText className="w-5 h-5 flex-shrink-0" />
                            {!isSidebarCollapsed && <span>Forms</span>}
                        </NavLink>

                        <NavLink
                            to="/form-types"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-blue-700 hover:text-white"
                                } `
                            }
                            title="Form Types"
                        >
                            <FolderOpen className="w-5 h-5 flex-shrink-0" />
                            {!isSidebarCollapsed && <span>Form Types</span>}
                        </NavLink>

                     

                        <NavLink
                            to="/settings"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-blue-700 hover:text-white"
                                } `
                            }
                            title="Settings"
                        >
                            <Settings className="w-5 h-5 flex-shrink-0" />
                            {!isSidebarCollapsed && <span>Settings</span>}
                        </NavLink>
                    </nav>

                    {/* Footer */}
                    <footer
                        className={`p-4 text-sm text-gray-400 border-t border-gray-700 ${isSidebarCollapsed ? "text-center" : ""
                            } `}
                    >
                        {!isSidebarCollapsed && (
                            <div className="space-y-2">
                                <button
                                    onClick={openExportImportModal}
                                    className="flex items-center gap-2 px-3 py-2 w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                                    title="Import/Export"
                                >
                                    <Download className="w-4 h-4" />
                                    <Upload className="w-4 h-4" />
                                    <span>Import/Export</span>
                                </button>
                                <div className="text-xs text-gray-500">
                                    © 2025 — Fermix
                                </div>
                            </div>
                        )}
                        {isSidebarCollapsed && (
                            <div className="space-y-2">
                                <button
                                    onClick={openExportImportModal}
                                    className="flex items-center justify-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                                    title="Import/Export"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <div className="text-xs text-gray-500 text-center">
                                    © 2025
                                </div>
                            </div>
                        )}
                    </footer>
                </aside>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-900 scrollbar-custom">
                    <Outlet />
                </main>
            </div>

            {/* Modal Import/Export */}
            <ExportImportModal
                isOpen={isExportImportModalOpen}
                onClose={closeExportImportModal}
            />
        </div>
    );
}

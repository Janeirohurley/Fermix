import React, { useState, useRef } from 'react';
import { Download, Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import {
    downloadExportData,
    importData,
    exportToCSV,
    clearAllData,
    getDataStats,
    exportDataElectron,
    importDataElectron,
    type ImportResult
} from '../utils/exportImport';

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

interface ExportImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExportImportModal: React.FC<ExportImportModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
    const [isLoading, setIsLoading] = useState(false);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const [stats, setStats] = useState<{
        formTypes: number;
        formTemplates: number;
        formSubmissions: number;
        total: number;
    } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isOpen) {
            loadStats();
        }
    }, [isOpen]);

    const loadStats = async () => {
        try {
            const dataStats = await getDataStats();
            setStats(dataStats);
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        }
    };

    const handleExportJSON = async () => {
        setIsLoading(true);
        try {
            // Vérifier si on est dans Electron ou dans le navigateur
            if (window.electronAPI?.exportData) {
                await exportDataElectron();
            } else {
                await downloadExportData();
            }
            onClose();
        } catch (error) {
            alert(`Erreur lors de l'export: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportCSV = async () => {
        setIsLoading(true);
        try {
            await exportToCSV();
            onClose();
        } catch (error) {
            alert(`Erreur lors de l'export CSV: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            alert('Veuillez sélectionner un fichier JSON valide.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await importData(file);
            setImportResult(result);
            await loadStats(); // Recharger les statistiques
        } catch (error) {
            setImportResult({
                success: false,
                imported: { formTypes: 0, formTemplates: 0, formSubmissions: 0 },
                errors: [`Erreur lors de l'import: ${error instanceof Error ? error.message : 'Erreur inconnue'}`],
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImportElectron = async () => {
        setIsLoading(true);
        try {
            const result = await importDataElectron();
            setImportResult(result);
            await loadStats(); // Recharger les statistiques
        } catch (error) {
            setImportResult({
                success: false,
                imported: { formTypes: 0, formTemplates: 0, formSubmissions: 0 },
                errors: [`Erreur lors de l'import: ${error instanceof Error ? error.message : 'Erreur inconnue'}`],
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearData = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
            return;
        }

        setIsLoading(true);
        try {
            await clearAllData();
            await loadStats();
            alert('Toutes les données ont été supprimées.');
        } catch (error) {
            alert(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Import/Export des données</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="px-6 py-4 bg-gray-700">
                        <h3 className="text-sm font-medium text-gray-300 mb-2">Statistiques actuelles</h3>
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="bg-gray-600 rounded p-2">
                                <div className="text-lg font-bold text-blue-400">{stats.formTypes}</div>
                                <div className="text-xs text-gray-300">Types</div>
                            </div>
                            <div className="bg-gray-600 rounded p-2">
                                <div className="text-lg font-bold text-green-400">{stats.formTemplates}</div>
                                <div className="text-xs text-gray-300">Templates</div>
                            </div>
                            <div className="bg-gray-600 rounded p-2">
                                <div className="text-lg font-bold text-yellow-400">{stats.formSubmissions}</div>
                                <div className="text-xs text-gray-300">Soumissions</div>
                            </div>
                            <div className="bg-gray-600 rounded p-2">
                                <div className="text-lg font-bold text-purple-400">{stats.total}</div>
                                <div className="text-xs text-gray-300">Total</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab('export')}
                        className={`flex-1 px-6 py-3 text-center transition-colors ${activeTab === 'export'
                            ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                    >
                        <Download className="w-4 h-4 inline mr-2" />
                        Exporter
                    </button>
                    <button
                        onClick={() => setActiveTab('import')}
                        className={`flex-1 px-6 py-3 text-center transition-colors ${activeTab === 'import'
                            ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                    >
                        <Upload className="w-4 h-4 inline mr-2" />
                        Importer
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'export' && (
                        <div className="space-y-4">
                            <div className="text-gray-300">
                                <p className="mb-4">
                                    Exportez toutes vos données (types de formulaires, templates et soumissions) dans un fichier JSON ou CSV.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={handleExportJSON}
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    <Download className="w-5 h-5" />
                                    {isLoading ? 'Export en cours...' : 'Exporter en JSON'}
                                </button>

                                <button
                                    onClick={handleExportCSV}
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-3 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    <FileText className="w-5 h-5" />
                                    {isLoading ? 'Export en cours...' : 'Exporter en CSV'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'import' && (
                        <div className="space-y-4">
                            <div className="text-gray-300">
                                <p className="mb-4">
                                    Importez des données depuis un fichier JSON exporté précédemment.
                                </p>
                                <div className="bg-yellow-900 border border-yellow-600 rounded p-3">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <p className="font-medium text-yellow-200">Attention</p>
                                            <p className="text-yellow-300">
                                                L'import ajoutera les nouvelles données sans supprimer les existantes.
                                                En cas de conflit d'ID, certaines données pourraient être ignorées.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors w-full"
                                >
                                    <Upload className="w-5 h-5" />
                                    {isLoading ? 'Import en cours...' : 'Sélectionner un fichier JSON'}
                                </button>

                                {/* Bouton d'import Electron si disponible */}
                                {window.electronAPI?.importData && (
                                    <button
                                        onClick={handleImportElectron}
                                        disabled={isLoading}
                                        className="flex items-center justify-center gap-3 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white rounded-lg transition-colors w-full"
                                    >
                                        <Upload className="w-5 h-5" />
                                        {isLoading ? 'Import en cours...' : 'Importer depuis le système de fichiers'}
                                    </button>
                                )}

                                <button
                                    onClick={handleClearData}
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors w-full"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    Supprimer toutes les données
                                </button>
                            </div>

                            {/* Résultat de l'import */}
                            {importResult && (
                                <div className={`p-4 rounded-lg ${importResult.success ? 'bg-green-900 border border-green-600' : 'bg-red-900 border border-red-600'}`}>
                                    <div className="flex items-start gap-2">
                                        {importResult.success ? (
                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="text-sm">
                                            <p className={`font-medium ${importResult.success ? 'text-green-200' : 'text-red-200'}`}>
                                                {importResult.success ? 'Import réussi' : 'Erreur lors de l\'import'}
                                            </p>
                                            <div className="mt-2 space-y-1">
                                                <p className="text-gray-300">
                                                    Types de formulaires: {importResult.imported.formTypes}
                                                </p>
                                                <p className="text-gray-300">
                                                    Templates: {importResult.imported.formTemplates}
                                                </p>
                                                <p className="text-gray-300">
                                                    Soumissions: {importResult.imported.formSubmissions}
                                                </p>
                                            </div>
                                            {importResult.errors.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-red-300 font-medium">Erreurs:</p>
                                                    <ul className="list-disc list-inside text-red-300 text-xs mt-1">
                                                        {importResult.errors.map((error, index) => (
                                                            <li key={index}>{error}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExportImportModal;

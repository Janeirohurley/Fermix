import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, FileText, AlertCircle, Loader2 } from 'lucide-react';
import type { FormType } from '../components/forms/types/formTypes';
import { getDynamicIconComponent } from '../utils/getDynamicIconComponent';
import PageHeader from '../components/PageHeader';
import FormTypeCard from '../components/forms/FormTypeCard';
import apiService from '../services/api';
import ViewFormTypeCard from '../components/forms/ViewFormTypeCard';
import ConfirmationModal from '../components/ConfirmationModal';

const FormTypesManagement: React.FC = () => {
    const [formTypes, setFormTypes] = useState<FormType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCard, setActiveCard] = useState<{ type: 'add' | 'edit'; id?: string } | null>(null);
    const [isLoadingCreatingUpdating, setIsLoadingCreatingUpdating] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [formTypeToDelete, setFormTypeToDelete] = useState<string | null>(null);

    // Options de couleurs
    const colorOptions = [
        '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];

    // Charger les types de formulaires
    useEffect(() => {
        loadFormTypes();
    }, []);

    const loadFormTypes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.getFormTypes();
            setFormTypes(response);
        } catch (err) {
            setError('Erreur lors du chargement des types de formulaires');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    // Créer ou mettre à jour un FormType
    const handleSaveFormType = async (formData: Partial<FormType>, id?: string) => {
        setIsLoadingCreatingUpdating(true);
        try {
            setError(null);
            if (id) {
                // Mode édition
                const response = await apiService.updateFormType(id, formData);
                setFormTypes(prev => prev.map(ft => ft.id === id ? (response ?? ft) : ft));
            } else {
                // Mode création
                const response = await apiService.createFormType(formData);
                setFormTypes(prev => [...prev, response]);
            }
            setActiveCard(null);
        } catch (err) {
            setError(id ? 'Erreur lors de la mise à jour du type de formulaire' : 'Erreur lors de la création du type de formulaire');
            console.error('Erreur:', err);
        } finally {
            setIsLoadingCreatingUpdating(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setFormTypeToDelete(id);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirm = async () => {
        if (!formTypeToDelete) return;

        try {
            setError(null);
            await apiService.deleteFormType(formTypeToDelete);
            setFormTypes(prev => prev.filter(ft => ft.id !== formTypeToDelete));
        } catch (err) {
            setError('Erreur lors de la suppression du type de formulaire');
            console.error('Erreur:', err);
        } finally {
            setShowDeleteConfirmation(false);
            setFormTypeToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false);
        setFormTypeToDelete(null);
    };

    const handleToggleActive = async (formType: FormType) => {
        setToggling(true);
        try {
            await handleSaveFormType({ ...formType, actif: !formType.actif }, formType.id);
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            setToggling(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 scrollbar-custom">
            {/* Header */}
            <PageHeader
                title="Form Types"
                subtitle="Manage the different types of forms available in your system"
                actionLabel="New Type"
                actionIcon={<Plus className="w-5 h-5" />}
                onActionClick={() => setActiveCard({ type: 'add' })}
                disabled={!!activeCard}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Message d'erreur */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-950 border border-red-800 rounded-md flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <div>
                            <p className="text-red-300 font-medium">Erreur</p>
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto p-1 text-red-400 hover:text-red-300"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}

                {/* Chargement */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                            <span className="text-gray-400">Chargement des types de formulaires...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Carte ajout / édition */}
                        <AnimatePresence>
                            {activeCard && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mb-6"
                                >
                                    <FormTypeCard
                                        formType={activeCard.type === 'edit' ? formTypes.find(ft => ft.id === activeCard.id) : undefined}
                                        colorOptions={colorOptions}
                                        onSave={(updates) => handleSaveFormType(updates, activeCard.type === 'edit' ? activeCard.id : undefined)}
                                        onCancel={() => setActiveCard(null)}
                                        isLoading={isLoadingCreatingUpdating}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {formTypes.map(ft => {
                                    const IconComponent = getDynamicIconComponent(ft.icone ?? 'FileText');
                                    return (
                                        <motion.div
                                            key={ft.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                                        >
                                            <ViewFormTypeCard
                                                formType={ft}
                                                IconComponent={IconComponent}
                                                onEdit={() => setActiveCard({ type: 'edit', id: ft.id })}
                                                onToggleActive={() => handleToggleActive(ft)}
                                                onDelete={() => handleDeleteClick(ft.id)}
                                                toggling={toggling}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Empty State */}
                        {formTypes.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-200 mb-2">Aucun type de formulaire</h3>
                                <p className="text-gray-400 mb-6">Commencez par créer votre premier type de formulaire</p>
                                <button
                                    onClick={() => setActiveCard({ type: 'add' })}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Créer un type
                                </button>
                            </div>
                        )}


                    </>
                )}
            </div>
            <ConfirmationModal
                isOpen={showDeleteConfirmation}
                title="Delete Type Form"
                message="Are you sure you want to delete this type of form? This action cannot be undone."
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
};

export default FormTypesManagement;

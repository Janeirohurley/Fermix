
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    X,
    FileText,
    Users,
    Calendar,
    MessageSquare,
    ShoppingCart,
    Star,
    Heart,
    Zap,
    Target,
    Award,
    Briefcase,
    Home,
    Car,
    Plane,
    Camera,
    Music,
    Book,
    Coffee,
    Gift,
    Palette,
    Settings,
    AlertCircle,
    Loader2
} from 'lucide-react';
import type { FormType } from '../components/forms/types/formTypes';
import { apiService } from '../services/api';
import ColorPicker from 'react-pick-color';
import { getDynamicIconComponent } from '../utils/getDynamicIconComponent';
import IconPicker from '../components/forms/utils/IconPicker';
import PageHeader from '../components/PageHeader';

const FormTypesManagement: React.FC = () => {
    const [formTypes, setFormTypes] = useState<FormType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isloadingcreatingUpdating, setisloadingcreatingUpdating] = useState(false);
    const [toggling, settoggling] = useState(false);

    // Options d'icônes disponibles
    const iconOptions = [
        { name: 'FileText', component: FileText },
        { name: 'Users', component: Users },
        { name: 'Calendar', component: Calendar },
        { name: 'MessageSquare', component: MessageSquare },
        { name: 'ShoppingCart', component: ShoppingCart },
        { name: 'Star', component: Star },
        { name: 'Heart', component: Heart },
        { name: 'Zap', component: Zap },
        { name: 'Target', component: Target },
        { name: 'Award', component: Award },
        { name: 'Briefcase', component: Briefcase },
        { name: 'Home', component: Home },
        { name: 'Car', component: Car },
        { name: 'Plane', component: Plane },
        { name: 'Camera', component: Camera },
        { name: 'Music', component: Music },
        { name: 'Book', component: Book },
        { name: 'Coffee', component: Coffee },
        { name: 'Gift', component: Gift },
        { name: 'Palette', component: Palette },
        { name: 'Settings', component: Settings }
    ];

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

    const handleCreateFormType = async (newFormType: Omit<FormType, 'id' | 'created_at' | 'updated_at'>) => {
        setisloadingcreatingUpdating(true);
        try {
            setError(null);
            if (isloadingcreatingUpdating) return;
            const response = await apiService.createFormType(newFormType);
            setFormTypes(prev => [...prev, response]);
            setIsAddingNew(false);
        } catch (err) {
            setError('Erreur lors de la création du type de formulaire');
            console.error('Erreur:', err);
        } finally {
            setisloadingcreatingUpdating(false);
        }
    };

    const handleUpdateFormType = async (id: string, updates: Partial<FormType>) => {
        setisloadingcreatingUpdating(true);
        try {
            setError(null);
            if (isloadingcreatingUpdating) return;
            const response = await apiService.updateFormType(id, updates);
            setFormTypes(prev => prev.map(ft => ft.id === id ? (response ?? ft) : ft));
            setEditingId(null);
        } catch (err) {
            setError('Erreur lors de la mise à jour du type de formulaire');
            console.error('Erreur:', err);
        } finally {
            setisloadingcreatingUpdating(false);
        }
    };

    const handleDeleteFormType = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce type de formulaire ?')) {
            return;
        }

        try {
            setError(null);
            await apiService.deleteFormType(id);
            setFormTypes(prev => prev.filter(ft => ft.id !== id));
        } catch (err) {
            setError('Erreur lors de la suppression du type de formulaire');
            console.error('Erreur:', err);
        }
    };

    const handleToggleActive = async (formType: FormType) => {
        settoggling(true);
        try {
            await handleUpdateFormType(formType.id, {
                ...formType,
                actif: !formType.actif,
            });
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            settoggling(false);
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
                onActionClick={() => setIsAddingNew(true)}
                disabled={isAddingNew}
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

                {/* État de chargement */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                            <span className="text-gray-400">Chargement des types de formulaires...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Add New Form Type */}
                        {isAddingNew && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6"
                            >
                                <AddFormTypeCard
                                    iconOptions={iconOptions}
                                    colorOptions={colorOptions}
                                    onSave={handleCreateFormType}
                                    onCancel={() => setIsAddingNew(false)}
                                    isloadingcreatingUpdating={isloadingcreatingUpdating}
                                />
                            </motion.div>
                        )}



                        {/* Form Types Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {formTypes.map((formType) => {
                                    const IconComponent = getDynamicIconComponent(formType.icone ?? "FileText");

                                    return (
                                        <motion.div
                                            key={formType.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                                        >
                                            {editingId === formType.id && (
                                                <EditFormTypeCard
                                                    formType={formType}
                                                    iconOptions={iconOptions}
                                                    colorOptions={colorOptions}
                                                    onSave={(updates) => handleUpdateFormType(formType.id, updates)}
                                                    onCancel={() => setEditingId(null)}
                                                    isloadingcreatingUpdating={isloadingcreatingUpdating}
                                                />
                                            )}
                                            <ViewFormTypeCard
                                                formType={formType}
                                                IconComponent={IconComponent}
                                                onEdit={() => setEditingId(formType.id)}
                                                onToggleActive={() => handleToggleActive(formType)}
                                                onDelete={() => handleDeleteFormType(formType.id)}
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
                                <h3 className="text-lg font-medium text-gray-200 mb-2">
                                    Aucun type de formulaire
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Commencez par créer votre premier type de formulaire
                                </p>
                                <button
                                    onClick={() => setIsAddingNew(true)}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Créer un type
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const ViewFormTypeCard: React.FC<{
    formType: FormType;
    IconComponent: React.ElementType;
    onEdit: () => void;
    onToggleActive: () => void;
    onDelete: () => void;
    toggling: boolean;
}> = ({ formType, IconComponent, onEdit, onToggleActive, onDelete, toggling }) => (
    <div className="p-4 sm:p-6 border rounded-xl border-gray-700 bg-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            {/* Icon */}
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: formType.couleur }}
            >
                <IconComponent className="w-6 h-6" />
            </div>

            {/* Name & description */}
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-100 truncate">{formType.nom}</h4>
                <p className="text-sm text-gray-400 truncate">{formType.description}</p>
            </div>

            {/* Edit & Delete buttons */}
            <div className="flex gap-2 self-start sm:self-auto">
                <button
                    onClick={onEdit}
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Status & Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span
                className={`py-0.5 px-2 rounded-md text-sm  ${formType.actif ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-200'
                    } `}
            >
                {formType.actif ? 'actif' : 'inactif'}
            </span>

            <button
                onClick={onToggleActive}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100 transition-colors"
                disabled={toggling}
            >
                {toggling ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                ) : (
                    <>
                        {formType.actif ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                        {formType.actif ? 'Désactiver' : 'Activer'}
                    </>
                )}
            </button>
        </div>
    </div>
);

const EditFormTypeCard: React.FC<{
    formType: FormType;
    iconOptions: Array<{ name: string; component: React.ComponentType<any> }>;
    colorOptions: string[];
    onSave: (updates: Partial<FormType>) => void;
    onCancel: () => void;
    isloadingcreatingUpdating: boolean;
}> = ({ formType, iconOptions, colorOptions, onSave, onCancel, isloadingcreatingUpdating }) => {
    const [editData, setEditData] = useState({
        nom: formType.nom,
        description: formType.description,
        icone: formType.icone,
        couleur: formType.couleur
    });

    return (
        <div className="p-6 bg-gray-800 fixed top-0 right-0 w-1/2 h-full z-50 overflow-y-auto scrollbar-custom">
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Nom du type"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                    value={editData.nom}
                    onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                />

                <textarea
                    placeholder="Description"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 resize-none"
                    rows={2}
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />

                {/* Sélection d'icône */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Icône</label>
                    <IconPicker
                        selectedIcon={editData.icone}
                        onSelect={(icon) => setEditData({ ...editData, icone: icon })}
                        color={editData.couleur}
                        className="grid-cols-5 bg-gray-700 rounded-md p-2"
                    />
                </div>

                {/* Sélection de couleur */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Couleur</label>
                    <div className="flex gap-2 flex-wrap">
                        {colorOptions.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setEditData({ ...editData, couleur: color })}
                                className={`w - 8 h - 8 rounded - full border - 2 transition - transform ${editData.couleur === color
                                    ? 'border-gray-400 scale-110'
                                    : 'border-gray-600 hover:scale-105'
                                    } `}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    <ColorPicker
                        color={editData.couleur}
                        onChange={(color: { hex: any }) => setEditData({ ...editData, couleur: color.hex })}
                        theme={{
                            background: '#1F2937', // gray-800
                            borderColor: '#374151', // gray-700
                            width: '100%'
                        }}
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(editData)}
                        disabled={isloadingcreatingUpdating}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isloadingcreatingUpdating ? 'En attente...' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddFormTypeCard: React.FC<{
    iconOptions: Array<{ name: string; component: React.ComponentType<any> }>;
    colorOptions: string[];
    onSave: (formType: Omit<FormType, 'id' | 'created_at' | 'updated_at'>) => void;
    onCancel: () => void;
    isloadingcreatingUpdating: boolean;
}> = ({ iconOptions, colorOptions, onSave, onCancel, isloadingcreatingUpdating }) => {
    const [newFormType, setNewFormType] = useState({
        nom: '',
        description: '',
        icone: 'FileText',
        couleur: '#3B82F6', // Default to blue-600
        actif: true
    });

    const handleSave = () => {
        if (!newFormType.nom.trim()) return;
        onSave(newFormType);
    };

    return (
        <div className="bg-gray-800 rounded-md border border-gray-700 p-6 w-2/3 mx-auto">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Nouveau Type de Formulaire</h3>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Nom du type"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                    value={newFormType.nom}
                    onChange={(e) => setNewFormType({ ...newFormType, nom: e.target.value })}
                />

                <textarea
                    placeholder="Description"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 resize-none"
                    rows={2}
                    value={newFormType.description}
                    onChange={(e) => setNewFormType({ ...newFormType, description: e.target.value })}
                />

                {/* Sélection d'icône */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Icône</label>
                    <IconPicker
                        selectedIcon={newFormType.icone}
                        onSelect={(icon) => setNewFormType({ ...newFormType, icone: icon })}
                        color={newFormType.couleur}
                        className="grid-cols-7 bg-gray-700 rounded-md p-2"
                    />
                </div>

                {/* Sélection de couleur */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Couleur</label>
                    <div className="flex gap-2 flex-wrap px-2">
                        {colorOptions.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setNewFormType({ ...newFormType, couleur: color })}
                                className={`w-8 h-8 rounded-full border-2 transition-transform ${newFormType.couleur === color
                                    ? 'border-gray-400 scale-110'
                                    : 'border-gray-600 hover:scale-105'
                                    } `}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    <ColorPicker
                        color={newFormType.couleur}
                        onChange={(color: { hex: any }) => setNewFormType({ ...newFormType, couleur: color.hex })}
                        theme={{
                            background: '#1F2937', // gray-800
                            borderColor: '#374151', // gray-700
                            width: '100%'
                        }}
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!newFormType.nom.trim() || isloadingcreatingUpdating}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isloadingcreatingUpdating ? 'Création...' : 'Créer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormTypesManagement;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
    Plus,
    Edit3,
    Trash2,
    Save,
    X,
    FileText,
    AlertTriangle,
    Shield,
    Calculator,
    ClipboardList,
    Settings,
    Eye,
    EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FormType } from './types/formTypes';
import ColorPicker from 'react-pick-color';
import IconPicker from './utils/IconPicker';

interface FormTypeManagerProps {
    formTypes: FormType[];
    onAdd: (formType: Omit<FormType, 'id' | 'created_at' | 'updated_at'>) => void;
    onUpdate: (id: string, formType: Partial<FormType>) => void;
    onDelete: (id: string) => void;
}

const FormTypeManager: React.FC<FormTypeManagerProps> = ({
    formTypes,
    onAdd,
    onUpdate,
    onDelete
}) => {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newFormType, setNewFormType] = useState({
        nom: '',
        description: '',
        couleur: '#10B981',
        icone: 'FileText',
        actif: true
    });

    const iconOptions = [
        { name: 'FileText', icon: FileText, label: 'Document' },
        { name: 'AlertTriangle', icon: AlertTriangle, label: 'Réclamation' },
        { name: 'Shield', icon: Shield, label: 'Assurance' },
        { name: 'Calculator', icon: Calculator, label: 'Calcul' },
        { name: 'ClipboardList', icon: ClipboardList, label: 'Liste' },
        { name: 'Settings', icon: Settings, label: 'Configuration' }
    ];

    const colorOptions = [
        '#10B981', // Vert BIC
        '#3B82F6', // Bleu
        '#8B5CF6', // Violet
        '#F59E0B', // Orange
        '#EF4444', // Rouge
        '#6B7280', // Gris
        '#EC4899', // Rose
        '#14B8A6'  // Teal
    ];

    const handleAddFormType = () => {
        if (newFormType.nom.trim() && newFormType.description.trim()) {
            onAdd(newFormType);
            setNewFormType({
                nom: '',
                description: '',
                couleur: '#10B981',
                icone: 'FileText',
                actif: true
            });
            setIsAddingNew(false);
        }
    };

    const handleUpdateFormType = (id: string, updates: Partial<FormType>) => {
        onUpdate(id, updates);
        setEditingId(null);
    };

    const getIconComponent = (iconName: string) => {
        const iconOption = iconOptions.find(opt => opt.name === iconName);
        return iconOption ? iconOption.icon : FileText;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Types de formulaires</h3>
                    <p className="text-sm text-gray-600">
                        Gérez les différents types de formulaires disponibles
                    </p>
                </div>
                <button
                    onClick={() => setIsAddingNew(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-bic-green text-white rounded-lg hover:bg-bic-green-dark transition-colors duration-200"
                >
                    <Plus className="w-4 h-4" />
                    Nouveau type
                </button>
            </div>

            {/* Add New Form Type */}
            <AnimatePresence>
                {isAddingNew && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                    >
                        <h4 className="text-md font-medium text-gray-900 mb-4">Nouveau type de formulaire</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom du type
                                </label>
                                <input
                                    type="text"
                                    value={newFormType.nom}
                                    onChange={(e) => setNewFormType({ ...newFormType, nom: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bic-green/20 focus:border-bic-green"
                                    placeholder="Ex: Demande de remboursement"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={newFormType.description}
                                    onChange={(e) => setNewFormType({ ...newFormType, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bic-green/20 focus:border-bic-green"
                                    placeholder="Description du type de formulaire"
                                />
                            </div>
{/* 
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Icône
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {iconOptions.map((option) => {
                                        const IconComponent = option.icon;
                                        return (
                                            <button
                                                key={option.name}
                                                type="button"
                                                onClick={() => setNewFormType({ ...newFormType, icone: option.name })}
                                                className={`p-3 border rounded-lg flex flex-col items-center gap-1 transition-all duration-200 ${newFormType.icone === option.name
                                                    ? 'border-bic-green bg-bic-green/10 text-bic-green'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <IconComponent className="w-4 h-4" />
                                                <span className="text-xs">{option.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Couleur
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewFormType({ ...newFormType, couleur: color })}
                                            className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${newFormType.couleur === color
                                                ? 'border-gray-400 scale-110'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div> */}

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">Icône</label>
                                <IconPicker
                                    selectedIcon={newFormType.icone}
                                    onSelect={(icon) => setNewFormType({ ...newFormType, icone: icon })}
                                    color={newFormType.couleur}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">Couleur</label>
                                <div className="border border-gray-300 rounded-md p-2 w-full">
                                    <ColorPicker
                                        color={newFormType.couleur}
                                        onChange={(color) => setNewFormType({ ...newFormType, couleur: color.hex })}
                                        theme={{
                                            width: '100%'
                                        }}
                                    />
                                </div>
                            </div>F
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsAddingNew(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleAddFormType}
                                disabled={!newFormType.nom.trim() || !newFormType.description.trim()}
                                className="flex items-center gap-2 px-4 py-2 bg-bic-green text-white rounded-lg hover:bg-bic-green-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                <Save className="w-4 h-4" />
                                Créer
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Form Types List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formTypes.map((formType) => {
                    const IconComponent = getIconComponent(formType.icone);
                    const isEditing = editingId === formType.id;

                    return (
                        <motion.div
                            key={formType.id}
                            layout
                            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            {isEditing ? (
                                <EditFormTypeCard
                                    formType={formType}
                                    iconOptions={iconOptions}
                                    colorOptions={colorOptions}
                                    onSave={(updates) => handleUpdateFormType(formType.id, updates)}
                                    onCancel={() => setEditingId(null)}
                                />
                            ) : (
                                <ViewFormTypeCard
                                    formType={formType}
                                    IconComponent={IconComponent}
                                    onEdit={() => setEditingId(formType.id)}
                                    onToggleActive={() => onUpdate(formType.id, { actif: !formType.actif })}
                                    onDelete={() => onDelete(formType.id)}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {formTypes.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun type de formulaire</h3>
                    <p className="text-gray-600 mb-4">
                        Commencez par créer votre premier type de formulaire
                    </p>
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-bic-green text-white rounded-lg hover:bg-bic-green-dark transition-colors duration-200 mx-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Créer un type
                    </button>
                </div>
            )}
        </div>
    );
};

// Composant pour afficher un type de formulaire
const ViewFormTypeCard: React.FC<{
    formType: FormType;
    IconComponent: React.ComponentType<any>;
    onEdit: () => void;
    onToggleActive: () => void;
    onDelete: () => void;
}> = ({ formType, IconComponent, onEdit, onToggleActive, onDelete }) => (
    <>
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: formType.couleur }}
                >
                    <IconComponent className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">{formType.nom}</h4>
                    <p className="text-sm text-gray-600">{formType.description}</p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={onEdit}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>

        <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${formType.actif
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
                }`}>
                {formType.actif ? 'Actif' : 'Inactif'}
            </span>
            <button
                onClick={onToggleActive}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
                {formType.actif ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
    </>
);

// Composant pour éditer un type de formulaire
const EditFormTypeCard: React.FC<{
    formType: FormType;
    iconOptions: any[];
    colorOptions: string[];
    onSave: (updates: Partial<FormType>) => void;
    onCancel: () => void;
}> = ({ formType, iconOptions, colorOptions, onSave, onCancel }) => {
    const [editData, setEditData] = useState({
        nom: formType.nom,
        description: formType.description,
        couleur: formType.couleur,
        icone: formType.icone
    });

    return (
        <div className="space-y-3">
            <input
                type="text"
                value={editData.nom}
                onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-bic-green/20 focus:border-bic-green"
            />

            <input
                type="text"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-bic-green/20 focus:border-bic-green"
            />

            <div className="grid grid-cols-3 gap-1">
                {iconOptions.slice(0, 6).map((option) => {
                    const IconComponent = option.icon;
                    return (
                        <button
                            key={option.name}
                            type="button"
                            onClick={() => setEditData({ ...editData, icone: option.name })}
                            className={`p-2 border rounded flex items-center justify-center transition-all duration-200 ${editData.icone === option.name
                                ? 'border-bic-green bg-bic-green/10 text-bic-green'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <IconComponent className="w-3 h-3" />
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-4 gap-1">
                {colorOptions.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setEditData({ ...editData, couleur: color })}
                        className={`w-6 h-6 rounded border transition-all duration-200 ${editData.couleur === color
                            ? 'border-gray-400 scale-110'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>

            <div className="flex items-center justify-end gap-2">
                <button
                    onClick={onCancel}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                    <X className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onSave(editData)}
                    className="p-1 text-bic-green hover:text-bic-green-dark transition-colors duration-200"
                >
                    <Save className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default FormTypeManager;
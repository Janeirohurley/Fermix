/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Type,
  FileText,
  ChevronDown,
  CheckSquare,
  Circle,
  Upload,
  Calendar,
  Hash,
  Mail,
  Phone,
  Plus,
  Settings,
  GripVertical,
  Copy,
  Lock
} from 'lucide-react';
import type { FormField, ChampType, Option } from './types/formTypes';

interface FieldEditorProps {
  field: FormField;
  index: number;
  onUpdate: (index: number, updated: FormField) => void;
  onRemove: (index: number) => void;
}

const availableTypes: ChampType[] = [
  'text', 'textarea', 'select', 'checkbox', 'radio', 'file', 'date', 'number', 'email', 'tel', 'password'
];

// Système d'icônes pour chaque type de champ
const getFieldTypeIcon = (type: ChampType) => {
  const iconMap = {
    text: Type,
    textarea: FileText,
    select: ChevronDown,
    checkbox: CheckSquare,
    radio: Circle,
    file: Upload,
    date: Calendar,
    number: Hash,
    email: Mail,
    tel: Phone,
    password: Lock
  };
  return iconMap[type] || Type;
};

// Couleurs pour chaque type de champ
const getFieldTypeColor = (type: ChampType) => {
  const colorMap = {
    text: 'text-blue-600 bg-blue-50',
    textarea: 'text-purple-600 bg-purple-50',
    select: 'text-green-600 bg-green-50',
    checkbox: 'text-orange-600 bg-orange-50',
    radio: 'text-pink-600 bg-pink-50',
    file: 'text-indigo-600 bg-indigo-50',
    date: 'text-red-600 bg-red-50',
    number: 'text-teal-600 bg-teal-50',
    email: 'text-cyan-600 bg-cyan-50',
    tel: 'text-emerald-600 bg-emerald-50',
    password: 'text-yellow-600 bg-yellow-50'
  };
  return colorMap[type] || 'text-gray-600 bg-gray-50';
};

// Labels français pour les types
const getFieldTypeLabel = (type: ChampType) => {
  const labelMap = {
    text: 'Texte',
    textarea: 'Zone de texte',
    select: 'Liste déroulante',
    checkbox: 'Cases à cocher',
    radio: 'Boutons radio',
    file: 'Fichier',
    date: 'Date',
    number: 'Nombre',
    email: 'Email',
    tel: 'Téléphone',
    password: 'Mot de passe'
  };
  return labelMap[type] || type;
};

const FieldEditor: React.FC<FieldEditorProps> = ({ field, index, onUpdate, onRemove }) => {
  const [localField, setLocalField] = useState<FormField>(field);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onUpdate(index, localField);
  }, [localField]);

  // Update helpers
  const updateField = (key: keyof FormField, value: any) => {
    setLocalField(prev => ({ ...prev, [key]: value }));
  };

  // For options editing (select, radio, checkbox)
  const updateOptionLabel = (optIndex: number, newLabel: string) => {
    if (!localField.options) return;
    const updatedOptions = [...localField.options];
    updatedOptions[optIndex].label = newLabel;
    updatedOptions[optIndex].value = newLabel.toLowerCase().replace(/\s+/g, '_');
    updateField('options', updatedOptions);
  };

  const addOption = () => {
    const newOption: Option = { label: 'Nouvelle option', value: 'nouvelle_option' };
    updateField('options', [...(localField.options ?? []), newOption]);
  };

  const removeOption = (optIndex: number) => {
    if (!localField.options) return;
    const updatedOptions = localField.options.filter((_, i) => i !== optIndex);
    updateField('options', updatedOptions);
  };

  const duplicateField = () => {
    // Cette fonction sera appelée par le parent pour dupliquer le champ
    console.log('Duplicate field:', localField);
  };

  // Get dynamic values for current field type
  const FieldIcon = getFieldTypeIcon(localField.type);
  const fieldTypeColor = getFieldTypeColor(localField.type);
  const fieldTypeLabel = getFieldTypeLabel(localField.type);

  // Render options editor only for select, checkbox, radio
  const renderOptionsEditor = () => {
    if (!['select', 'checkbox', 'radio'].includes(localField.type)) return null;
    return (
      <div className="ml-6 mt-4 p-4 bg-gray-50/50 border-l-4 border-bic-green/20 rounded-lg animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Options disponibles
          </label>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
            {(localField.options ?? []).length} option(s)
          </span>
        </div>
        
        <div className="space-y-3">
          {(localField.options ?? []).map((opt, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <div className="w-2 h-2 rounded-full bg-bic-green/40"></div>
              <input
                type="text"
                value={opt.label}
                onChange={(e) => updateOptionLabel(i, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bic-green/20 focus:border-bic-green transition-all duration-200 hover:border-gray-300"
                placeholder="Libellé de l'option"
              />
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Supprimer option"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={addOption}
          className="mt-3 flex items-center gap-2 text-bic-green text-sm font-medium hover:text-bic-green-dark transition-colors duration-200 hover:bg-bic-green/5 px-3 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Ajouter une option
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group animate-fade-in">
      {/* Header Section - Style Facebook */}
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Type Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${fieldTypeColor} transition-all duration-200`}>
              <FieldIcon className="w-6 h-6" />
            </div>
            
            {/* Field Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <input
                  type="text"
                  value={localField.label}
                  onChange={(e) => updateField('label', e.target.value)}
                  className="text-lg font-semibold text-bic-black bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-bic-green/20 rounded-lg px-2 py-1 hover:bg-gray-50 transition-all duration-200"
                  placeholder="Nom du champ"
                />
                {localField.obligatoire && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    Obligatoire
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${fieldTypeColor}`}>
                  {fieldTypeLabel}
                </span>
                <span>•</span>
                <span>Champ #{index + 1}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-bic-green hover:bg-bic-green/5 rounded-lg transition-all duration-200"
              aria-label="Configurer le champ"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={duplicateField}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              aria-label="Dupliquer le champ"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing rounded-lg transition-all duration-200"
              aria-label="Déplacer le champ"
            >
              <GripVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Configuration */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de champ b</label>
            <select
              value={localField.type}
              onChange={(e) => updateField('type', e.target.value as ChampType)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bic-green/20 focus:border-bic-green transition-all duration-200 hover:border-gray-300"
            >
              {availableTypes.map((t) => (
                <option key={t} value={t}>
                  {getFieldTypeLabel(t)}
                </option>
              ))}
            </select>
          </div>

          {/* Placeholder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Texte d'aide</label>
            <input
              type="text"
              value={localField.placeholder || ''}
              onChange={(e) => updateField('placeholder', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bic-green/20 focus:border-bic-green transition-all duration-200 hover:border-gray-300"
              placeholder="Ex: Saisissez votre nom..."
            />
          </div>

          {/* Required Toggle */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localField.obligatoire}
                onChange={(e) => updateField('obligatoire', e.target.checked)}
                className="w-5 h-5 text-bic-green focus:ring-bic-green/20 border-gray-300 rounded transition-all duration-200"
              />
              <span className="text-sm font-medium text-gray-700">Champ obligatoire</span>
            </label>
          </div>
        </div>

        {/* Options Editor - Indented */}
        {renderOptionsEditor()}
      </div>

      {/* Actions Bar */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default FieldEditor;

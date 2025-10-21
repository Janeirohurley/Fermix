
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Hash,
  Calendar,
  Mail,
  Phone,
  Upload,
  ChevronDown,
  Plus,
  Trash2,
  Info,
} from 'lucide-react';
import type { ValidationRules, ChampType } from './types/formTypes';

interface ValidationEditorProps {
  fieldType: ChampType;
  validation: ValidationRules;
  onUpdate: (validation: ValidationRules) => void;
}

const ValidationEditor: React.FC<ValidationEditorProps> = ({ fieldType, validation, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateValidation = (key: keyof ValidationRules, value: any) => {
    onUpdate({ ...validation, [key]: value });
  };

  // Composants de validation spécifiques par type
  const renderTextValidation = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Longueur minimale
          </label>
          <input
            type="number"
            value={validation.minLength || ''}
            onChange={(e) => updateValidation('minLength', parseInt(e.target.value) || undefined)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
            placeholder="Ex: 3"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Longueur maximale
          </label>
          <input
            type="number"
            value={validation.maxLength || ''}
            onChange={(e) => updateValidation('maxLength', parseInt(e.target.value) || undefined)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
            placeholder="Ex: 100"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">
          Expression régulière (pattern)
        </label>
        <input
          type="text"
          value={validation.pattern || ''}
          onChange={(e) => updateValidation('pattern', e.target.value)}
          className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
          placeholder="Ex: ^[A-Za-z]+$"
        />
        <p className="text-xs text-gray-400 mt-1">
          Utilisez une regex pour valider le format du texte
        </p>
      </div>
    </div>
  );

  const renderNumberValidation = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Valeur minimale
          </label>
          <input
            type="number"
            value={validation.min || ''}
            onChange={(e) => updateValidation('min', parseFloat(e.target.value) || undefined)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
            placeholder="Ex: 0"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Valeur maximale
          </label>
          <input
            type="number"
            value={validation.max || ''}
            onChange={(e) => updateValidation('max', parseFloat(e.target.value) || undefined)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
            placeholder="Ex: 100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Pas (step)
          </label>
          <input
            type="number"
            step="0.01"
            value={validation.step || ''}
            onChange={(e) => updateValidation('step', parseFloat(e.target.value) || undefined)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
            placeholder="Ex: 0.5"
          />
        </div>
      </div>
    </div>
  );

  const renderEmailValidation = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">
          Domaines autorisés
        </label>
        <div className="space-y-2">
          {(validation.emailDomains || []).map((domain, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={domain}
                onChange={(e) => {
                  const newDomains = [...(validation.emailDomains || [])];
                  newDomains[index] = e.target.value;
                  updateValidation('emailDomains', newDomains);
                }}
                className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
                placeholder="Ex: gmail.com"
              />
              <button
                type="button"
                onClick={() => {
                  const newDomains = (validation.emailDomains || []).filter((_, i) => i !== index);
                  updateValidation('emailDomains', newDomains);
                }}
                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950 rounded-md transition-all duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newDomains = [...(validation.emailDomains || []), ''];
              updateValidation('emailDomains', newDomains);
            }}
            className="flex items-center gap-1.5 text-blue-400 text-xs font-medium hover:text-blue-300 hover:bg-gray-700 px-2 py-1 rounded-md transition-all duration-200"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter un domaine
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Laissez vide pour autoriser tous les domaines
        </p>
      </div>
    </div>
  );

  const renderFileValidation = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Taille max (MB)
          </label>
          <input
            type="number"
            step="0.1"
            value={validation.maxFileSize || ''}
            onChange={(e) => updateValidation('maxFileSize', parseFloat(e.target.value) || undefined)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
            placeholder="Ex: 5"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Nombre max de fichiers
          </label>
          <input
            type="number"
            value={validation.maxFiles || ''}
            onChange={(e) => updateValidation('maxFiles', parseInt(e.target.value) || undefined)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
            placeholder="Ex: 3"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">
          Types de fichiers autorisés
        </label>
        <div className="space-y-2">
          {(validation.allowedFileTypes || []).map((type, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={type}
                onChange={(e) => {
                  const newTypes = [...(validation.allowedFileTypes || [])];
                  newTypes[index] = e.target.value;
                  updateValidation('allowedFileTypes', newTypes);
                }}
                className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
                placeholder="Ex: .pdf, .jpg, .png"
              />
              <button
                type="button"
                onClick={() => {
                  const newTypes = (validation.allowedFileTypes || []).filter((_, i) => i !== index);
                  updateValidation('allowedFileTypes', newTypes);
                }}
                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950 rounded-md transition-all duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newTypes = [...(validation.allowedFileTypes || []), ''];
              updateValidation('allowedFileTypes', newTypes);
            }}
            className="flex items-center gap-1.5 text-blue-400 text-xs font-medium hover:text-blue-300 hover:bg-gray-700 px-2 py-1 rounded-md transition-all duration-200"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter un type
          </button>
        </div>
        <div className="mt-2 p-2 bg-gray-900 rounded-md border border-gray-700">
          <p className="text-xs text-gray-300 font-medium mb-1">Types courants :</p>
          <div className="flex flex-wrap gap-1">
            {['.pdf', '.jpg', '.png', '.doc', '.docx', '.xls', '.xlsx'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  const currentTypes = validation.allowedFileTypes || [];
                  if (!currentTypes.includes(type)) {
                    updateValidation('allowedFileTypes', [...currentTypes, type]);
                  }
                }}
                className="px-2 py-1 bg-gray-800 text-blue-400 text-xs rounded border border-gray-600 hover:bg-gray-700 transition-colors duration-200"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDateValidation = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Date minimale
          </label>
          <input
            type="date"
            value={validation.minDate || ''}
            onChange={(e) => updateValidation('minDate', e.target.value)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Date maximale
          </label>
          <input
            type="date"
            value={validation.maxDate || ''}
            onChange={(e) => updateValidation('maxDate', e.target.value)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={validation.allowWeekends !== false}
            onChange={(e) => updateValidation('allowWeekends', e.target.checked)}
            className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
          />
          <span className="text-xs font-medium text-gray-300">Autoriser les week-ends</span>
        </label>
      </div>
    </div>
  );

  const renderPhoneValidation = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">
          Format du téléphone
        </label>
        <select
          value={validation.phoneFormat || 'international'}
          onChange={(e) => updateValidation('phoneFormat', e.target.value as any)}
          className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm"
        >
          <option value="international">International (+257...)</option>
          <option value="national">National (79...)</option>
          <option value="custom">Format personnalisé</option>
        </select>
      </div>

      {validation.phoneFormat === 'custom' && (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Indicatif (préfixe personnalisé)
            </label>
            <input
              type="text"
              value={validation.customPrefix || ''}
              onChange={(e) => updateValidation('customPrefix', e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
              placeholder="Ex: +238"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Nombre de chiffres après l’indicatif
            </label>
            <input
              type="number"
              value={validation.customLength || ''}
              onChange={(e) => updateValidation('customLength', Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
              placeholder="Ex: 7"
              min={1}
            />
          </div>
        </>
      )}
    </div>
  );

  const renderSelectValidation = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Sélections minimales
          </label>
          <input
            type="number"
            value={validation.minSelections || ''}
            onChange={(e) => updateValidation('minSelections', parseInt(e.target.value) || undefined)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
            placeholder="Ex: 1"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Sélections maximales
          </label>
          <input
            type="number"
            value={validation.maxSelections || ''}
            onChange={(e) => updateValidation('maxSelections', parseInt(e.target.value) || undefined)}
            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
            placeholder="Ex: 3"
          />
        </div>
      </div>
    </div>
  );

  const getValidationIcon = () => {
    const iconMap = {
      text: FileText,
      textarea: FileText,
      password: Shield,
      number: Hash,
      email: Mail,
      tel: Phone,
      file: Upload,
      date: Calendar,
      select: ChevronDown,
      checkbox: ChevronDown,
      radio: ChevronDown,
    };
    return iconMap[fieldType] || Shield;
  };

  const getValidationContent = () => {
    switch (fieldType) {
      case 'text':
      case 'textarea':
      case 'password':
        return renderTextValidation();
      case 'number':
        return renderNumberValidation();
      case 'email':
        return renderEmailValidation();
      case 'tel':
        return renderPhoneValidation();
      case 'file':
        return renderFileValidation();
      case 'date':
        return renderDateValidation();
      case 'select':
      case 'checkbox':
      case 'radio':
        return renderSelectValidation();
      default:
        return null;
    }
  };

  const ValidationIcon = getValidationIcon();

  return (
    <div className="mt-3  bg-gray-900 rounded-md overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-gray-800 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
            <ValidationIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-medium text-gray-100">Règles de validation</h4>
            <p className="text-xs text-gray-400">
              Configurez les contraintes pour ce champ
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${ isExpanded ? 'rotate-180' : '' } `}
        />
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-3 pt-0 space-y-3">
          {getValidationContent()}

          {/* Message d'erreur personnalisé */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Message d'erreur personnalisé
            </label>
            <input
              type="text"
              value={validation.customErrorMessage || ''}
              onChange={(e) => updateValidation('customErrorMessage', e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 text-sm placeholder-gray-500"
              placeholder="Ex: Veuillez saisir une valeur valide"
            />
            <p className="text-xs text-gray-400 mt-1">
              Message affiché en cas d'erreur de validation
            </p>
          </div>

          {/* Info sur les validations actives */}
          <div className="p-2 bg-gray-800 rounded-md border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-medium text-gray-100">Validations actives</span>
            </div>
            <div className="space-y-1">
              {Object.entries(validation).map(([key, value]) => {
                if (value !== undefined && value !== null && value !== '' && key !== 'customErrorMessage') {
                  return (
                    <div key={key} className="text-xs text-gray-300">
                      <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(', ') : String(value)}
                    </div>
                  );
                }
                return null;
              })}
              {Object.keys(validation).length === 0 && (
                <p className="text-xs text-gray-400">Aucune validation configurée</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationEditor;
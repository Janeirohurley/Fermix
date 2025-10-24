/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Eye, Download, CheckCircle, AlertCircle, Info, Upload, Link } from 'lucide-react';
import type { FormTemplate, FormField } from './types/formTypes';
import { shouldShowField } from './shouldShowField';
import { getFieldTypeIcon } from './utils/utils';

interface FormPreviewProps {
  form: FormTemplate;
  onClose: () => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ form, onClose }) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateFormData = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateField = (field: FormField, value: any): string => {
    if (field.obligatoire && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} est obligatoire`;
    }

    if (!value) return '';

    const validation = field.validation;
    if (!validation) return '';

    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'password':
        if (validation.minLength && value.length < validation.minLength) {
          return `${field.label} doit contenir au moins ${validation.minLength} caractères`;
        }
        if (validation.maxLength && value.length > validation.maxLength) {
          return `${field.label} ne peut pas dépasser ${validation.maxLength} caractères`;
        }
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
          return validation.customErrorMessage || `${field.label} ne respecte pas le format requis`;
        }
        break;

      case 'number':
        const numValue = parseFloat(value);
        if (validation.min !== undefined && numValue < validation.min) {
          return `${field.label} doit être supérieur ou égal à ${validation.min}`;
        }
        if (validation.max !== undefined && numValue > validation.max) {
          return `${field.label} doit être inférieur ou égal à ${validation.max}`;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return `${field.label} doit être une adresse email valide`;
        }
        if (validation.emailDomains && validation.emailDomains.length > 0) {
          const domain = value.split('@')[1];
          if (!validation.emailDomains.includes(domain)) {
            return `${field.label} doit utiliser un domaine autorisé: ${validation.emailDomains.join(', ')}`;
          }
        }
        break;

      case 'file':
        const files = value instanceof FileList ? Array.from(value) : Array.isArray(value) ? value : [value];
        if (validation.allowedFileTypes && validation.allowedFileTypes.length > 0) {
          for (const file of files) {
            if (file instanceof File) {
              const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
              if (!validation.allowedFileTypes.includes(fileExtension)) {
                return `${field.label} doit être de type: ${validation.allowedFileTypes.join(', ')}`;
              }
            }
          }
        }
        if (validation.maxFiles && files.length > validation.maxFiles) {
          return `${field.label} ne peut pas dépasser ${validation.maxFiles} fichier(s)`;
        }
        break;

      case 'checkbox':
        if (validation.minSelections && value.length < validation.minSelections) {
          return `${field.label} doit avoir au moins ${validation.minSelections} sélection(s)`;
        }
        if (validation.maxSelections && value.length > validation.maxSelections) {
          return `${field.label} ne peut pas dépasser ${validation.maxSelections} sélection(s)`;
        }
        break;
    }

    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    form.champs.forEach((field) => {
      if (shouldShowField(field, formData)) {
        const error = validateField(field, formData[field.id]);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitted(true);
      console.log('Preview form submitted:', formData);
    }
  };

  const handleRemoveFile = (fieldId: string, fileName: string) => {
    const files = formData[fieldId];
    let fileArray: File[] = [];

    if (Array.isArray(files)) {
      fileArray = files.flatMap((file) => (file instanceof FileList ? Array.from(file) : [file]));
    } else if (files instanceof FileList) {
      fileArray = Array.from(files);
    } else if (files instanceof File) {
      fileArray = [files];
    }

    const filtered = fileArray.filter((file) => file.name !== fileName);
    updateFormData(fieldId, filtered.length > 0 ? filtered : null);
  };

  const renderField = (field: FormField) => {
    const isVisible = shouldShowField(field, formData);
    if (!isVisible) return null;

    const hasError = !!errors[field.id];
    const fieldValue = formData[field.id] || (field.type === 'checkbox' ? [] : '');
    const baseInputClasses = `w-full px-3 py-2 bg-gray-700 border ${hasError ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-1 ${hasError ? 'focus:ring-red-400' : 'focus:ring-blue-500'} focus:border-transparent text-gray-100 placeholder-gray-500 transition-all duration-200`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'password':
        return (
          <input
            type={field.type}
            id={field.id}
            value={fieldValue}
            onChange={(e) => updateFormData(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
            required={field.obligatoire}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={fieldValue}
            onChange={(e) => updateFormData(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`${baseInputClasses} resize-none`}
            required={field.obligatoire}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={fieldValue}
            onChange={(e) => updateFormData(field.id, e.target.value === '' ? '' : parseFloat(e.target.value))}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            step={field.validation?.step}
            className={baseInputClasses}
            required={field.obligatoire}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={fieldValue}
            onChange={(e) => updateFormData(field.id, e.target.value)}
            min={field.validation?.minDate}
            max={field.validation?.maxDate}
            className={baseInputClasses}
            required={field.obligatoire}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={fieldValue}
            onChange={(e) => updateFormData(field.id, e.target.value)}
            className={baseInputClasses}
            required={field.obligatoire}
          >
            <option value="">Sélectionner une option</option>
            {(field.options || []).map((option, index) => (
              <option key={index} value={typeof option === 'string' ? option : option.value}>
                {typeof option === 'string' ? option : option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        const radioLayout = field.layout || 'vertical';
        return (
          <div className={`gap-3 ${radioLayout === 'horizontal' ? 'flex flex-wrap' : 'space-y-2'}`}>
            {(field.options || []).map((option, index) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              return (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={field.id}
                    value={optionValue}
                    checked={fieldValue === optionValue}
                    onChange={(e) => updateFormData(field.id, e.target.value)}
                    className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                    required={field.obligatoire}
                  />
                  <span className="text-gray-300">{optionLabel}</span>
                </label>
              );
            })}
          </div>
        );

      case 'checkbox':
        const checkboxLayout = field.layout || 'vertical';
        return (
          <div className={`gap-3 ${checkboxLayout === 'horizontal' ? 'flex flex-wrap' : 'space-y-2'}`}>
            {(field.options || []).map((option, index) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              return (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={optionValue}
                    checked={(fieldValue || []).includes(optionValue)}
                    onChange={(e) => {
                      const currentValues = fieldValue || [];
                      const newValues = e.target.checked
                        ? [...currentValues, optionValue]
                        : currentValues.filter((v: string) => v !== optionValue);
                      updateFormData(field.id, newValues);
                    }}
                    className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                  />
                  <span className="text-gray-300">{optionLabel}</span>
                </label>
              );
            })}
          </div>
        );

      case 'file':
        const rawFiles = formData[field.id];
        let fileList: File[] = [];
        if (Array.isArray(rawFiles)) {
          fileList = rawFiles.flatMap((file) => (file instanceof FileList ? Array.from(file) : [file]));
        } else if (rawFiles instanceof FileList) {
          fileList = Array.from(rawFiles);
        } else if (rawFiles instanceof File) {
          fileList = [rawFiles];
        }

        return (
          <div className="border-2 border-dashed border-gray-600 rounded-md p-4 text-center hover:border-blue-500 transition-colors duration-200">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              id={field.id}
              onChange={(e) => updateFormData(field.id, e.target.files)}
              className="hidden"
              multiple={!!(field.validation?.maxFiles && field.validation.maxFiles > 1)}
              accept={field.validation?.allowedFileTypes?.join(',')}
            />
            <label htmlFor={field.id} className="cursor-pointer block">
              <span className="text-blue-400 font-medium">Cliquez pour sélectionner</span>
              <span className="text-gray-400"> ou glissez vos fichiers ici</span>
            </label>
            {field.validation?.allowedFileTypes && (
              <p className="text-xs text-gray-400 mt-2">
                Formats acceptés : {field.validation.allowedFileTypes.join(', ')}
              </p>
            )}
            {fileList.length > 0 && (
              <div className="mt-2 space-y-1">
                {fileList.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm text-gray-300 bg-gray-700 rounded-md px-2 py-1">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(field.id, file.name)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // === NOUVEAU : Gestion des groupes nommés ===
  const renderGroupedFields = () => {
    if (!form.groupes || form.groupes.length === 0) return null;

    return form.groupes.map((group, groupIndex) => {
      const groupFields = form.champs.filter(f => group.fields.includes(f.id));
      if (groupFields.length === 0) return null;

      return (
        <div key={group.id} className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium">
            <Link className="w-4 h-4" />
            {group.name}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-900/50 border border-indigo-700 rounded-md">
            {groupFields.map((field, index) => {
              const FieldIcon = getFieldTypeIcon(field.type);
              return (
                <>
                  {renderField(field) !== null &&
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (groupIndex * 3 + index) * 0.05 }}
                      className="space-y-2"
                    >
                      <label htmlFor={field.id} className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-indigo-600">
                          <FieldIcon className="w-4 h-4 text-white" />
                        </div>
                        {field.label}
                        {field.obligatoire && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      {renderField(field)}
                      {errors[field.id] && (
                        <div className="flex items-center gap-2 text-red-400 text-xs">
                          <AlertCircle className="w-4 h-4" />
                          {errors[field.id]}
                        </div>
                      )}
                    </motion.div>
                  }
                </>

              );
            })}
          </div>
        </div>
      );
    });
  };

  // === Champs non groupés ===
  const ungroupedFields = form.champs.filter(f =>
    !form.groupes?.some(g => g.fields.includes(f.id))
  );

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-gray-800 rounded-md shadow-xl max-w-md w-full p-6 text-center border border-gray-700"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">Formulaire envoyé !</h3>
          <p className="text-gray-300 mb-4">
            Votre {form.type} a été simulé avec succès pour {form.email_destination}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Fermer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 w-2/3 flex items-start justify-end z-50 h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-gray-800 rounded-md border border-gray-700 shadow-lg w-full h-screen max-w-3xl max-h-screen overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-900 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">{form.nom}</h2>
            <p className="text-gray-400 text-sm mt-1">{form.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 text-gray-400 hover:text-gray-200 rounded-md hover:bg-gray-700 transition-colors"
              title="Imprimer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-200 rounded-md hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-custom">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* === GROUPES NOMMÉS === */}
            {renderGroupedFields()}

            {/* === CHAMPS NON GROUPÉS === */}
            {ungroupedFields.map((field, index) => {
              const FieldIcon = getFieldTypeIcon(field.type);
              const fieldTypeColor = 'bg-blue-600';

              return (
                <>
                  {renderField(field) !== null &&
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <label htmlFor={field.id} className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${fieldTypeColor}`}>
                          <FieldIcon className="w-4 h-4 text-white" />
                        </div>
                        {field.label}
                        {field.obligatoire && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      {renderField(field)}
                      {errors[field.id] && (
                        <div className="flex items-center gap-2 text-red-400 text-xs">
                          <AlertCircle className="w-4 h-4" />
                          {errors[field.id]}
                        </div>
                      )}
                      {field.validation?.customErrorMessage && !errors[field.id] && (
                        <div className="flex items-center gap-2 text-blue-400 text-xs">
                          <Info className="w-4 h-4" />
                          {field.validation.customErrorMessage}
                        </div>
                      )}
                    </motion.div>
                  }
                </>

              );
            })}
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Mode prévisualisation
              </div>
              <p className="mt-1">Les données ne seront pas réellement envoyées</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                Fermer
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Tester l'envoi
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FormPreview;
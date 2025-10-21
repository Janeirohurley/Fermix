/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { Send, Upload, Link } from 'lucide-react';
import { validateField } from './validateField';
import { shouldShowField } from './shouldShowField';
import type { FormField, FormGroup } from './types/formTypes';
import FilePreviewList from './FilePreviewList';
import { getFieldTypeIcon } from './utils/utils';

type FormFieldEntry = {
  id: string;
  nom: string;
  value: any;
};

interface Props {
  formFields: FormField[];
  groupes?: FormGroup[];
  formData: FormFieldEntry[];
  setFormData: React.Dispatch<React.SetStateAction<FormFieldEntry[]>>;
  handleSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  setSelectedForm?: (val: any) => void;
  errors: Record<string, string | null>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
  isPreview?: boolean; // Added to disable submission in preview mode
}

const FormRenderer: React.FC<Props> = ({
  formFields,
  groupes,
  formData,
  setFormData,
  handleSubmit,
  isSubmitting = false,
  setSelectedForm,
  errors,
  setErrors,
  isPreview = false,
}) => {
  const handleInputChange = (fieldId: string, fieldLabel: string, value: any) => {
    setFormData((prev) => {
      const existingIndex = prev.findIndex((f) => f.id === fieldId);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].value = value;
        return updated;
      }
      return [...prev, { id: fieldId, nom: fieldLabel, value }];
    });
  };

  const handleRemoveFile = (fieldId: string, fileName: string) => {
    const field = formData.find((f) => f.id === fieldId);
    if (!field) return;

    let fileArray: File[] = [];
    const files = field.value;

    if (Array.isArray(files)) {
      fileArray = files.flatMap((file) => (file instanceof FileList ? Array.from(file) : [file]));
    } else if (files instanceof FileList) {
      fileArray = Array.from(files);
    } else if (files instanceof File) {
      fileArray = [files];
    }

    const filtered = fileArray.filter((file) => file.name !== fileName);
    if (filtered.length === 0) {
      setFormData((prev) => prev.filter((f) => f.id !== fieldId));
    } else {
      handleInputChange(fieldId, field.nom, filtered);
    }
  };

  useEffect(() => {
    const newErrors: Record<string, string | null> = {};
    formFields.forEach((field) => {
      if (!shouldShowField(field, formData.reduce((acc, f) => ({ ...acc, [f.id]: f.value }), {}))) {
        newErrors[field.id] = null;
        return;
      }
      const value = formData.find((f) => f.id === field.id)?.value;
      const { valid, error } = validateField(field, value);
      newErrors[field.id] = valid ? null : error || 'Erreur inconnue';
    });
    setErrors(newErrors);
  }, [formData, formFields, setErrors]);

  const renderField = (field: FormField) => {
    const isVisible = shouldShowField(field, formData.reduce((acc, f) => ({ ...acc, [f.id]: f.value }), {}));
    if (!isVisible) return null;

    const value = formData.find((entry) => entry.id === field.id)?.value || '';
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'password':
        return (
          <div key={field.id} className="mb-4">
            <input
              type={field.type}
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, field.label, e.target.value)}
              className={`w - full px - 3 py - 2 bg - gray - 700 border ${error ? 'border-red-500' : 'border-gray-600'} rounded - md focus: outline - none focus: ring - 2 ${error ? 'focus:ring-red-400' : 'focus:ring-blue-500'} focus: border - transparent text - gray - 100 placeholder - gray - 500 transition - all duration - 200`}
              placeholder={field.placeholder}
              required={field.obligatoire}
              disabled={isPreview}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="mb-4">
            <textarea
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, field.label, e.target.value)}
              rows={4}
              className={`w - full px - 3 py - 2 bg - gray - 700 border ${error ? 'border-red-500' : 'border-gray-600'} rounded - md focus: outline - none focus: ring - 2 ${error ? 'focus:ring-red-400' : 'focus:ring-blue-500'} focus: border - transparent text - gray - 100 placeholder - gray - 500 transition - all duration - 200 resize - none`}
              placeholder={field.placeholder}
              required={field.obligatoire}
              disabled={isPreview}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="mb-4">
            <input
              type="number"
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, field.label, e.target.value === '' ? '' : parseInt(e.target.value))}
              className={`w - full px - 3 py - 2 bg - gray - 700 border ${error ? 'border-red-500' : 'border-gray-600'} rounded - md focus: outline - none focus: ring - 2 ${error ? 'focus:ring-red-400' : 'focus:ring-blue-500'} focus: border - transparent text - gray - 100 placeholder - gray - 500 transition - all duration - 200`}
              placeholder={field.placeholder}
              required={field.obligatoire}
              min={field.validation?.min}
              max={field.validation?.max}
              step={field.validation?.step}
              disabled={isPreview}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="mb-4">
            <input
              type="date"
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, field.label, e.target.value)}
              className={`w - full px - 3 py - 2 bg - gray - 700 border ${error ? 'border-red-500' : 'border-gray-600'} rounded - md focus: outline - none focus: ring - 2 ${error ? 'focus:ring-red-400' : 'focus:ring-blue-500'} focus: border - transparent text - gray - 100 transition - all duration - 200`}
              required={field.obligatoire}
              max={field.validation?.maxDate}
              min={field.validation?.minDate}
              disabled={isPreview}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="mb-4">
            <select
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, field.label, e.target.value)}
              className={`w - full px - 3 py - 2 bg - gray - 700 border ${error ? 'border-red-500' : 'border-gray-600'} rounded - md focus: outline - none focus: ring - 2 ${error ? 'focus:ring-red-400' : 'focus:ring-blue-500'} focus: border - transparent text - gray - 100 transition - all duration - 200`}
              required={field.obligatoire}
              disabled={isPreview}
            >
              <option value="">Sélectionnez une option</option>
              {field.options?.map((option, index) => (
                <option key={index} value={typeof option === 'string' ? option : option.value}>
                  {typeof option === 'string' ? option : option.label}
                </option>
              ))}
            </select>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'radio':
        const radioLayout = field.layout || 'vertical';
        return (
          <div className={`gap-3 ${radioLayout === 'horizontal' ? 'flex flex-wrap' : 'space-y-2'}`}>
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={typeof option === 'string' ? option : option.value}
                  checked={value === (typeof option === 'string' ? option : option.value)}
                  onChange={(e) => handleInputChange(field.id, field.label, e.target.value)}
                  className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                  required={field.obligatoire}
                  disabled={isPreview}
                />
                <span className="text-gray-300">{typeof option === 'string' ? option : option.label}</span>
              </label>
            ))}
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'checkbox':
        const checkboxLayout = field.layout || 'vertical';
        return (
          <div className={`gap-3 ${checkboxLayout === 'horizontal' ? 'flex flex-wrap' : 'space-y-2'}`}>
            {field.options?.map((option, index) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const checkedValues = value || [];
              return (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={optionValue}
                    checked={checkedValues.includes(optionValue)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange(field.id, field.label, [...checkedValues, optionValue]);
                      } else {
                        handleInputChange(field.id, field.label, checkedValues.filter((v: any) => v !== optionValue));
                      }
                    }}
                    className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                    disabled={isPreview}
                  />
                  <span className="text-gray-300">{typeof option === 'string' ? option : option.label}</span>
                </label>
              );
            })}
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'file':
        const rawFiles = formData.find((f) => f.id === field.id)?.value;
        let fileList: File[] = [];

        if (Array.isArray(rawFiles)) {
          fileList = rawFiles.flatMap((file) => (file instanceof FileList ? Array.from(file) : [file]));
        } else if (rawFiles instanceof FileList) {
          fileList = Array.from(rawFiles);
        } else if (rawFiles instanceof File) {
          fileList = [rawFiles];
        }

        return (
          <div key={field.id} className="mb-4 border-2 border-dashed border-gray-600 rounded-md p-4 text-center hover:border-blue-500 transition-colors duration-200">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              id={field.id}
              onChange={(e) => handleInputChange(field.id, field.label, e.target.files)}
              className="hidden"
              multiple={!!(field.validation?.maxFiles && field.validation.maxFiles > 1)}
              accept={field.validation?.allowedFileTypes?.join(',')}
              disabled={isPreview}
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
            <FilePreviewList fieldId={field.id} files={fileList} onRemove={isPreview ? () => { } : handleRemoveFile} />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const renderGroupedFields = () => {
    if (!groupes || groupes.length === 0) {
      // Render fields without groups
      return formFields.map((field) => {
        const FieldIcon = getFieldTypeIcon(field.type);
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className=" text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-600">
                <FieldIcon className="w-4 h-4 text-white" />
              </div>
              {field.label}
              {field.obligatoire && <span className="text-red-400 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        );
      });
    }

    // Render fields grouped
    const groupedElements: React.ReactElement[] = [];
    const processedFields = new Set<string>();

    groupes.forEach((group) => {
      const groupFields = formFields.filter((field) =>
        group.fields.includes(field.id) && !processedFields.has(field.id)
      );

      if (groupFields.length > 0) {
        groupedElements.push(
          <div key={group.id} className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium">
              <Link className="w-4 h-4" />
              {group.name}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-900/50 border border-indigo-700 rounded-md">
              {groupFields.map((field) => {
                processedFields.add(field.id);
                const FieldIcon = getFieldTypeIcon(field.type);
                return (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center bg-indigo-600">
                        <FieldIcon className="w-4 h-4 text-white" />
                      </div>
                      {field.label}
                      {field.obligatoire && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
    });

    // Add any remaining fields not in groups
    const remainingFields = formFields.filter((field) => !processedFields.has(field.id));
    if (remainingFields.length > 0) {
      remainingFields.forEach((field) => {
        const FieldIcon = getFieldTypeIcon(field.type);
        groupedElements.push(
          <div key={field.id}>
            <label htmlFor={field.id} className=" text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-600">
                <FieldIcon className="w-4 h-4 text-white" />
              </div>
              {field.label}
              {field.obligatoire && <span className="text-red-400 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        );
      });
    }

    return groupedElements;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 rounded-lg shadow-md p-4"
    >
      <div className="space-y-4">
        {renderGroupedFields()}
      </div>
      {!isPreview && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={() => setSelectedForm && setSelectedForm(null)}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors text-sm"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Envoyer le formulaire
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default FormRenderer;
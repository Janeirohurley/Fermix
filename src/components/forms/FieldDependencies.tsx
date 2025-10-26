/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import {
  Link,
  ChevronDown,
  Trash2,
  Eye,
  ArrowRight,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FormField } from './types/formTypes';

type ConditionType =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'greater_than'
  | 'less_than'
  | 'equals_with_specific_value';

interface ShowIfCondition {
  fieldId: string;
  value: any;
  condition: ConditionType;
}

interface Dependencies {
  dependsOn?: string;
  showIf?: ShowIfCondition;
}

interface FieldDependenciesProps {
  currentField: FormField;
  allFields: FormField[];
  dependencies: Dependencies;
  onUpdate: (dependencies: Dependencies) => void;
}

const FieldDependencies: React.FC<FieldDependenciesProps> = ({
  currentField,
  allFields,
  dependencies,
  onUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const availableFields = useMemo(
    () => allFields.filter((field) => field.id !== currentField.id),
    [allFields, currentField.id]
  );

  const hasDependencies =
    !!dependencies.dependsOn || !!dependencies.showIf?.fieldId;

  // Update handlers
  const updateShowIf = (key: keyof ShowIfCondition, value: any) => {
    const showIf = dependencies.showIf || {
      fieldId: '',
      value: '',
      condition: 'equals',
    };
    onUpdate({
      ...dependencies,
      showIf: { ...showIf, [key]: value },
    });
  };

  const removeDependency = () => onUpdate({});

  // Helpers
  const getConditionLabel = (condition: ConditionType): string => {
    const labels: Record<ConditionType, string> = {
      equals: 'is equal to',
      not_equals: 'is not equal to',
      contains: 'contains',
      greater_than: 'is greater than',
      less_than: 'is less than',
      equals_with_specific_value: 'is equal to specific value',
    };
    return labels[condition];
  };

  const getAvailableConditions = (): { value: ConditionType; label: string }[] => {
    const fieldId = dependencies.showIf?.fieldId;
    const targetField = allFields.find((f) => f.id === fieldId);

    if (!targetField) return [];

    const base: { value: ConditionType; label: string }[] = [
      { value: 'equals', label: 'is equal to' },
      { value: 'not_equals', label: 'is not equal to' },
    ];

    if (targetField.type === 'number') {
      return [
        ...base,
        { value: 'greater_than', label: 'is greater than' },
        { value: 'less_than', label: 'is less than' },
      ];
    }

    if (['text', 'textarea'].includes(targetField.type)) {
      return [...base, { value: 'contains', label: 'contains' }];
    }
    if (['checkbox', 'radio', 'select'].includes(targetField.type) && targetField.options && targetField.options.length > 0 && ['checkbox', 'radio', 'select'].includes(currentField.type)) {
      return [...base, { value: 'equals_with_specific_value', label: 'equals with specific value to' }];
    }

    return base;
  };

  const renderValueInput = () => {
    const showIf = dependencies.showIf;
    if (!showIf?.fieldId) return null;
    const targetField = allFields.find((f) => f.id === showIf.fieldId);
    if (!targetField) return null;

    if (['select', 'radio', 'checkbox'].includes(targetField.type)) {
      const options = targetField.options || [];
      return (
        <select
          value={showIf.value || ''}
          onChange={(e) => updateShowIf('value', e.target.value)}
          className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-100 text-sm"
        >
          <option value="">Select a value</option>
          {options.map((opt, i) => {
            const value = typeof opt === 'string' ? opt : opt.value;
            const label = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={i} value={value}>
                {label}
              </option>
            );
          })}
        </select>
      );
    }

    const inputType = targetField.type === 'number' ? 'number' : 'text';
    const placeholder =
      targetField.type === 'number'
        ? 'Numeric value'
        : 'Comparison value';

    return (
      <input
        type={inputType}
        value={showIf.value || ''}
        onChange={(e) => updateShowIf('value', e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-100 text-sm placeholder-gray-500"
      />
    );
  };
  console.log(currentField)
  return (
    <div className="mt-3 border border-gray-800 rounded-lg bg-gray-900 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center p-3 hover:bg-gray-800 transition"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
            <Link className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-medium text-gray-100">
              Field Dependencies
            </h4>
            <p className="text-xs text-gray-400">
              {hasDependencies
                ? 'Dependencies configured'
                : 'Configure field relationships'}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''
            }`}
        />
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="p-4 space-y-4 border-t border-gray-800"
          >
            {availableFields.length === 0 ? (
              <div className="text-center py-4">
                <Info className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400">
                  No other fields available for dependencies.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <h5 className="text-xs font-medium text-gray-100">
                      Conditional Display
                    </h5>
                  </div>

                  <div className="p-3 bg-gray-800 rounded-md border border-gray-700 space-y-3">
                    <p className="text-xs text-gray-300">
                      This field will appear only if a specific condition is met.
                    </p>

                    {/* Select reference field */}
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">
                        Show this field if
                      </label>
                      <select
                        value={dependencies.showIf?.fieldId || ''}
                        onChange={(e) =>
                          updateShowIf('fieldId', e.target.value)
                        }
                        className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-100 text-sm"
                      >
                        <option value="">Select a field</option>
                        {availableFields.map((field) => (
                          <option key={field.id} value={field.id}>
                            {field.label} ({field.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    {dependencies.showIf?.fieldId && (
                      <>
                        {/* Condition */}
                        <div>
                          <label className="block text-xs text-gray-300 mb-1">
                            Condition
                          </label>
                          <select
                            value={dependencies.showIf?.condition || 'equals'}
                            onChange={(e) =>
                              updateShowIf('condition', e.target.value)
                            }
                            className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-100 text-sm"
                          >
                            {getAvailableConditions().map((condition) => (
                              <option
                                key={condition.value}
                                value={condition.value}
                              >
                                {condition.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Value */}
                        <div>
                          <label className="block text-xs text-gray-300 mb-1">
                            Value
                          </label>
                          {renderValueInput()}
                        </div>

                        {/* Rule Preview */}
                        <div className="p-2 bg-gray-900 rounded-md border border-gray-700">
                          <div className="flex items-center gap-2 mb-1">
                            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs font-medium text-gray-100">
                              Configured Rule
                            </span>
                          </div>
                          <p className="text-xs text-gray-300">

                            Show "<strong>{currentField.label}</strong>" if "
                            <strong>
                              {
                                availableFields.find(
                                  (f) => f.id === dependencies.showIf?.fieldId
                                )?.label
                              }
                            </strong>"{' '}
                            {getConditionLabel(
                              dependencies.showIf?.condition || 'equals'
                            )}{' '}
                            "<strong>{dependencies.showIf?.value}</strong>"
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Delete dependencies */}
                {hasDependencies && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={removeDependency}
                      className="flex items-center gap-1.5 px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-950 rounded-md transition-all duration-200 text-xs font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove Dependencies
                    </button>
                  </div>
                )}

                {/* Remove individual dependency */}
                {dependencies.showIf?.fieldId && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onUpdate({ ...dependencies, showIf: undefined })}
                      className="flex items-center gap-1.5 px-3 py-1 text-orange-400 hover:text-orange-300 hover:bg-orange-950 rounded-md transition-all duration-200 text-xs font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove Show If Condition
                    </button>
                  </div>
                )}
               

                {/* Examples */}
                <div className="p-2 bg-gray-800 rounded-md border border-gray-700">
                  <h6 className="text-xs font-medium text-gray-100 mb-1">
                    Examples
                  </h6>
                  <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                    <li>Show "License Number" if "Has License" = "Yes"</li>
                    <li>
                      Show "Accident Details" if "Claim Type" = "Accident"
                    </li>
                    <li>Show "Annual Income" if "Age" {'>'} 18</li>
                  </ul>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FieldDependencies;

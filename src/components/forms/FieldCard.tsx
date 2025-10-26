/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { FormField, FormGroup } from "./types/formTypes";
import { GripVertical, Settings, Trash2, Link } from "lucide-react";
import ValidationEditor from "./ValidationEditor";
import FieldDependencies from "./FieldDependencies";
import { getFieldTypeIcon, getFieldTypeLabel } from "./utils/utils";
import FieldOptionsEditor from "./FieldOptionsEditor";

interface FieldCardProps {
  field: FormField;
  index: number;
  allFields: FormField[];
  templateId: string | number;
  groupes: FormGroup[];
  onUpdate: (index: number, updatedField: FormField) => void;
  onRemove: (index: number) => void;

}

const FieldCard: React.FC<FieldCardProps> = ({
  field,
  index,
  allFields,
  groupes,
  onUpdate,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);


  const FieldIcon = getFieldTypeIcon(field.type);
  const fieldTypeLabel = getFieldTypeLabel(field.type);
  const fieldTypeColor = "bg-blue-600";

  const handleTypeChange = (newType: string) => {
    const updatedField = { ...field, type: newType as any };
    if (["select", "checkbox", "radio"].includes(newType)) {
      if (!updatedField.options || updatedField.options.length === 0) {
        updatedField.options = [
          { label: "Option 1", value: "option_1" },
          { label: "Option 2", value: "option_2" },
        ];
      }
      
    } 
    onUpdate(index, updatedField);
  };

  // === Groupes du champ ===
  const fieldGroups = groupes.filter(g => g.fields.includes(field.id));

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${fieldTypeColor}`}>
              <FieldIcon className="w-4 h-4 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => onUpdate(index, { ...field, label: e.target.value })}
                  className="text-sm font-semibold text-gray-100 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 hover:bg-gray-700 transition-all duration-200"
                  placeholder="Nom du champ"
                />
                {field.obligatoire && (
                  <span className="px-2 py-0.5 bg-red-950 text-red-400 text-xs font-medium rounded-full">
                    Obligatoire
                  </span>
                )}
                {fieldGroups.map((group) => (
                  <span
                    key={group.id}
                    className="px-2 py-0.5 bg-indigo-900 text-indigo-300 text-xs font-medium rounded-full flex items-center gap-1"
                  >
                    <Link className="w-3 h-3" />
                    {group.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${fieldTypeColor}`}>
                  {fieldTypeLabel}
                </span>
                <span>•</span>
                <span>Champ #{index + 1}</span>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-md"
              aria-label="Configurer"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-md cursor-grab active:cursor-grabbing"
              aria-label="Déplacer"
            >
              <GripVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Configuration étendue */}
      {isExpanded && (
        <div className="p-3 space-y-4">
          {/* Type + Obligatoire */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Type de champ</label>
              <select
                value={field.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-100 text-sm"
              >
                <option value="text">Texte</option>
                <option value="textarea">Zone de texte</option>
                <option value="select">Liste déroulante</option>
                <option value="checkbox">Cases à cocher</option>
                <option value="radio">Boutons radio</option>
                <option value="file">Fichier</option>
                <option value="date">Date</option>
                <option value="number">Nombre</option>
                <option value="email">Email</option>
                <option value="tel">Téléphone</option>
                <option value="password">Mot de passe</option>
              </select>
            </div>
            <div className="flex items-center justify-start pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.obligatoire}
                  onChange={(e) => onUpdate(index, { ...field, obligatoire: e.target.checked })}
                  className="w-4 h-4 text-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <span className="text-xs font-medium text-gray-300">Champ obligatoire</span>
              </label>
            </div>
          </div>

          {/* Options */}

          <FieldOptionsEditor
            field={field}
            onChange={(updatedField) => onUpdate(index, updatedField)}
          />


          {/* Validation */}
          {!["select", "radio"].includes(field.type) && (
            <ValidationEditor
              fieldType={field.type}
              validation={field.validation || {}}
              onUpdate={(validation) => onUpdate(index, { ...field, validation })}
            />
          )}

          {/* Dépendances */}
          <FieldDependencies
            currentField={field}
            allFields={allFields}
            dependencies={{
              dependsOn: field.validation?.dependsOn,
              showIf: field.validation?.showIf,
            }}
            onUpdate={(dependencies) => {
              const updatedValidation = { ...field.validation, ...dependencies };
              if (!dependencies.dependsOn) delete updatedValidation.dependsOn;
              if (!dependencies.showIf) delete updatedValidation.showIf;
              onUpdate(index, { ...field, validation: updatedValidation });
            }}
          />
        </div>
      )}

      {/* Pied de carte */}
      <div className="px-3 py-2 bg-gray-900 border-t border-gray-700 flex justify-end">
        <button
          onClick={() => onRemove(index)}
          className="flex items-center gap-1.5 px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-950 rounded-md text-xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default FieldCard;
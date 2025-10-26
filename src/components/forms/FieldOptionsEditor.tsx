import React from "react";
import { Settings, Trash2, Plus } from "lucide-react";
import type { FormField } from "./types/formTypes";

interface FieldOptionsEditorProps {
    field: FormField;
    onChange: (updatedField: FormField) => void;
}

const FieldOptionsEditor: React.FC<FieldOptionsEditorProps> = ({ field, onChange }) => {
    const showOptions = ["select", "checkbox", "radio"].includes(field.type);

    if (!showOptions) return null;

    // === Gestion locale des options ===
    const addOption = () => {
        const newOptions = [
            ...(field.options || []),
            {
                label: `Option ${(field.options?.length || 0) + 1}`,
                value: `option_${(field.options?.length || 0) + 1}`,
            },
        ];
        onChange({ ...field, options: newOptions });
    };

    const updateOption = (index: number, newLabel: string) => {
        if (!field.options) return;
        const updated = [...field.options];
        updated[index] = {
            ...updated[index],
            label: newLabel,
            value: newLabel.toLowerCase().replace(/\s+/g, "_"),
        };
        onChange({ ...field, options: updated });
    };

    const removeOption = (index: number) => {
        if (!field.options) return;
        const filtered = field.options.filter((_, i) => i !== index);
        onChange({ ...field, options: filtered });
    };

    const updateLayout = (layout: "vertical" | "horizontal") => {
        onChange({ ...field, layout });
    };

    return (
        <div className="p-3 bg-gray-900 rounded-md space-y-2">
            {/* En-tête */}
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5" />
                    Options
                </label>
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                    {(field.options || []).length} option(s)
                </span>
            </div>

            {/* Direction d'affichage pour checkbox/radio */}
            {(field.type === "checkbox" || field.type === "radio") && (
                <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                        Direction d'affichage
                    </label>
                    <div className="flex gap-4">
                        {["vertical", "horizontal"].map((layout) => (
                            <label key={layout} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name={`layout-${field.id}`}
                                    checked={field.layout === layout || (!field.layout && layout === "vertical")}
                                    onChange={() => updateLayout(layout as "vertical" | "horizontal")}
                                    className="w-4 h-4 text-blue-500 border-gray-600 bg-gray-700"
                                />
                                <span className="text-xs text-gray-300 capitalize">{layout}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Liste d'options */}
            {(field.options || []).map((option, i) => (
                <div key={i} className="flex items-center gap-2 group/option">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <input
                        type="text"
                        value={option.label}
                        onChange={(e) => updateOption(i, e.target.value)}
                        className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-100 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="p-1 text-red-400 hover:text-red-300 opacity-0 group-hover/option:opacity-100"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}

            {/* Ajouter une option */}
            <button
                onClick={addOption}
                type="button"
                className="mt-2 flex items-center gap-1.5 text-blue-400 text-xs hover:text-blue-300"
            >
                <Plus className="w-3.5 h-3.5" />
                Ajouter une option
            </button>
        </div>
    );
};

export default FieldOptionsEditor;

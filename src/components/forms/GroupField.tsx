import React from "react";
import type { FormField, FormGroup } from "./types/formTypes";
import { Trash2, Link, X, Plus, Edit2, ChevronDown, ChevronUp } from "lucide-react";

interface GroupFieldProps {
    champs: FormField[];
    groupes: FormGroup[];
    onGroupCreate: (name: string) => string;
    onGroupUpdate: (groupId: string, name: string) => void;
    onGroupAdd: (groupId: string, fieldId: string) => void;
    onGroupRemove: (groupId: string, fieldId: string) => void;
    onGroupDelete: (groupId: string) => void;
}

const GroupField: React.FC<GroupFieldProps> = ({
    champs,
    groupes,
    onGroupCreate,
    onGroupUpdate,
    onGroupAdd,
    onGroupRemove,
    onGroupDelete,
}) => {
    const [editingGroupId, setEditingGroupId] = React.useState<string | null>(null);
    const [editName, setEditName] = React.useState("");
    const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

    const allFieldIds = champs.map(f => f.id);

    const toggleGroupExpansion = (groupId: string) => {
        setExpandedGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(groupId)) {
                newSet.delete(groupId);
            } else {
                newSet.add(groupId);
            }
            return newSet;
        });
    };

    return (
        <div className="space-y-4">
            {/* Bouton Créer un groupe */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => onGroupCreate("Nouveau groupe")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Créer un groupe
                </button>
            </div>

            {/* Liste des groupes */}
            {groupes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Link className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                    <p>Aucun groupe créé</p>
                    <p className="text-xs mt-1">Cliquez sur "Créer un groupe" pour commencer</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {groupes.map((group) => {
                        const groupFields = champs.filter(f => group.fields.includes(f.id));
                        const isEditing = editingGroupId === group.id;

                        return (
                            <div
                                key={group.id}
                                className="border border-indigo-700/50 rounded-lg p-4 bg-gray-900/60 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* En-tête du groupe */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleGroupExpansion(group.id)}
                                            className="p-1 text-gray-400 hover:text-indigo-300"
                                        >
                                            {expandedGroups.has(group.id) ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && editName.trim()) {
                                                        onGroupUpdate(group.id, editName.trim());
                                                        setEditingGroupId(null);
                                                    }
                                                    if (e.key === "Escape") {
                                                        setEditingGroupId(null);
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (editName.trim()) {
                                                        onGroupUpdate(group.id, editName.trim());
                                                    }
                                                    setEditingGroupId(null);
                                                }}
                                                className="px-2 py-1 bg-gray-800 border border-indigo-600 rounded text-sm text-white"
                                                autoFocus
                                            />
                                        ) : (
                                            <h3 className="text-base font-semibold text-indigo-300 flex items-center gap-2">
                                                <Link className="w-4 h-4" />
                                                    <span className="text-sm" onClick={() => {
                                                        setEditingGroupId(group.id);
                                                        setEditName(group.name);
                                                    }}>{group.name}</span>
                                                <span className="text-xs text-indigo-400">({group.fields.length})</span>
                                            </h3>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {!isEditing && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingGroupId(group.id);
                                                        setEditName(group.name);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-indigo-300"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onGroupDelete(group.id)}
                                                    className="p-1 text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Contenu expansible */}
                                {expandedGroups.has(group.id) && (
                                    <>
                                        {/* Champs dans le groupe */}
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {groupFields.length > 0 ? (
                                                groupFields.map((field) => (
                                                    <span
                                                        key={field.id}
                                                        className="flex items-center gap-1 px-2 py-0.5 bg-indigo-800/50 text-indigo-200 text-xs rounded-full"
                                                    >
                                                        {field.label || field.nom}
                                                        <button
                                                            type="button"
                                                            onClick={() => onGroupRemove(group.id, field.id)}
                                                            className="hover:text-red-400"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-500 italic">Aucun champ</p>
                                            )}
                                        </div>

                                        {/* Ajouter un champ */}
                                        <div className="flex items-center gap-2">
                                            <select
                                                className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        onGroupAdd(group.id, e.target.value);
                                                        e.target.value = "";
                                                    }
                                                }}
                                                value=""
                                            >
                                                <option value="" disabled>
                                                    + Ajouter un champ
                                                </option>
                                                {allFieldIds
                                                    // Exclure les champs déjà dans n’importe quel groupe
                                                    .filter(id => !groupes.some(g => g.fields.includes(id)))
                                                    // Exclure ceux déjà dans le groupe actuel (par sécurité)
                                                    .filter(id => !group.fields.includes(id))
                                                    .map(id => {
                                                        const field = champs.find(f => f.id === id);
                                                        return field ? (
                                                            <option key={id} value={id}>
                                                                {field.label || field.nom}
                                                            </option>
                                                        ) : null;
                                                    })}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GroupField;
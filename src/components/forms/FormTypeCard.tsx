/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect } from "react";
import IconPicker from "./utils/IconPicker";
import ColorPicker from "react-pick-color";


interface FormType {
    id?: string;
    nom: string;
    description: string;
    icone: string;
    couleur: string;
    actif?: boolean;
    created_at?: string;
    updated_at?: string;
}

interface FormTypeCardProps {
    formType?: FormType; // si présent, mode édition
    colorOptions: string[];
    onSave: (updates: Partial<FormType>) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const FormTypeCard: React.FC<FormTypeCardProps> = ({
    formType,
    colorOptions,
    onSave,
    onCancel,
    isLoading,
}) => {
    const [formData, setFormData] = useState({
        nom: formType?.nom || "",
        description: formType?.description || "",
        icone: formType?.icone || "FileText",
        couleur: formType?.couleur || "#3B82F6",
        actif: formType?.actif ?? true,
    });

    useEffect(() => {
        // si le prop formType change, on met à jour le state
        if (formType) setFormData({
            nom: formType.nom,
            description: formType.description,
            icone: formType.icone,
            couleur: formType.couleur,
            actif: formType.actif ?? true
        });
    }, [formType]);

    const handleIconSelect = useCallback((icon: { name: string; lib: any }) => {
        setFormData(prev => ({ ...prev, icone: icon.name }));
    }, []);

    const handleColorChange = useCallback((color: { hex: string }) => {
        setFormData(prev => ({ ...prev, couleur: color.hex }));
    }, []);

    const handleSave = () => {
        if (!formData.nom.trim()) return;
        onSave(formData);
    };

    const isEditMode = !!formType;

    return (
        <div className={`p-6 bg-gray-800 rounded-md border border-gray-700 w-1/3 mx-auto  fixed top-0 right-0 h-full  overflow-y-auto scrollbar-custom`}>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
                {isEditMode ? "Modifier Type de Formulaire" : "Nouveau Type de Formulaire"}
            </h3>

            <div className="space-y-4">
                {/* Nom */}
                <input
                    type="text"
                    placeholder="Nom du type"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />

                {/* Description */}
                <textarea
                    placeholder="Description"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 resize-none"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                {/* Icône */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Icône</label>
                    <IconPicker
                        {...({
                            selectedIcon: formData.icone,
                            onSelect: handleIconSelect,
                            color: formData.couleur,
                            className: "grid-cols-7 bg-gray-700 rounded-md p-2",
                        } as any)}
                    />
                </div>

                {/* Couleur */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Couleur</label>
                    <div className="flex gap-2 flex-wrap px-2">
                        {colorOptions.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setFormData({ ...formData, couleur: color })}
                                className={`w-8 h-8 rounded-full border-2 transition-transform ${formData.couleur === color ? "border-gray-400 scale-110" : "border-gray-600 hover:scale-105"
                                    }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    <ColorPicker
                    
                        color={formData.couleur}
                        onChange={handleColorChange}
                        theme={{
                            background: "#1F2937",
                            borderColor: "#374151",
                            width: "100%",
                        }}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!formData.nom.trim() || isLoading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (isEditMode ? "Mise à jour..." : "Création...") : (isEditMode ? "Sauvegarder" : "Créer")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormTypeCard;

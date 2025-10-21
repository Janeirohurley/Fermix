import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import type { FormField, FormTemplate, FormType, FormGroup } from "./types/formTypes";
import FieldCard from "./FieldCard";
import GroupField from "./GroupField";

const FormModal = ({
  form,
  formTypes,
  onClose,
  onSave,
  onUpdate,
  submitingForm,
}: {
  form: FormTemplate | null;
  formTypes: FormType[];
  onClose: () => void;
  onSave: (form: FormTemplate) => void;
  onUpdate: (form: FormTemplate) => void;
  submitingForm: boolean;
}) => {
  // État du formulaire
  const [formData, setFormData] = useState({
    nom: form?.nom || "",
    type: form?.type || (formTypes.length > 0 ? formTypes[0].id : ""),
    description: form?.description || "",
    email_destination: form?.email_destination || "",
    actif: form?.actif !== undefined ? form.actif : true,
  });

  const [fields, setFields] = useState<FormField[]>(form?.champs || []);
  const [groupes, setGroupes] = useState<FormGroup[]>(form?.groupes || []);

  // ID du template (généré si création)
  const templateId = form?.id || `temp_${Date.now()}`;

  // === Prévisualisation en temps réel ===
  // === Prévisualisation en temps réel ===
  useEffect(() => {
    const timeout = setTimeout(() => {
      const updatedForm: FormTemplate = {
        id: templateId,
        ...formData,
        champs: fields,
        groupes,               // <-- groupes nommés
        actif: formData.actif,
        created_at: form?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      onUpdate(updatedForm);
    }, 300);

    return () => clearTimeout(timeout);
  }, [
    formData,
    fields,
    groupes,          // <-- indispensable
    templateId,
    onUpdate,
  ]);

  // === Gestion des champs ===
  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      nom: `champ_${fields.length + 1}`,
      type: "text",
      label: `Nouveau champ ${fields.length + 1}`,
      obligatoire: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updatedField: FormField) => {
    setFields(fields.map((field, i) => (i === index ? updatedField : field)));
  };

  const removeField = (index: number) => {
    const fieldToRemove = fields[index];
    setFields(fields.filter((_, i) => i !== index));
    // Retirer le champ de tous les groupes
    setGroupes(groupes.map(g => ({
      ...g,
      fields: g.fields.filter(id => id !== fieldToRemove.id)
    })));
  };

  // === Gestion des groupes ===
  const handleGroupCreate = (name: string): string => {
    const newGroup: FormGroup = {
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name,
      fields: [],
    };
    setGroupes([...groupes, newGroup]);
    return newGroup.id;
  };

  const handleGroupAdd = (groupId: string, fieldId: string) => {
    setGroupes(groupes.map(g =>
      g.id === groupId
        ? { ...g, fields: [...new Set([...g.fields, fieldId])] }
        : g
    ));
  };

  const handleGroupRemove = (groupId: string, fieldId: string) => {
    setGroupes(groupes.map(g =>
      g.id === groupId
        ? { ...g, fields: g.fields.filter(id => id !== fieldId) }
        : g
    ));
  };

  const handleGroupUpdate = (groupId: string, name: string) => {
    setGroupes(groupes.map(g => (g.id === groupId ? { ...g, name } : g)));
  };

  const handleGroupDelete = (groupId: string) => {
    setGroupes(groupes.filter(g => g.id !== groupId));
  };

  // === Soumission ===
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newForm: FormTemplate = {
      id: templateId,
      ...formData,
      champs: fields,
      groupes,
      actif: formData.actif,
      created_at: form?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onSave(newForm);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-start z-40">
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-gray-800 rounded-r-lg border-r border-y border-gray-700 shadow-lg w-full max-w-[33.3333vw] sm:w-1/3 h-full overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-900 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">
              {form ? "Modifier le Formulaire" : "Nouveau Formulaire"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Configurez les champs, validations et groupes
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-200 rounded-md hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-custom">
          <form id="form-modal" onSubmit={handleSubmit} className="space-y-4">
            {/* Métadonnées */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nom du formulaire *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type de formulaire
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-100"
                >
                  {formTypes
                    .filter((type) => type.actif)
                    .map((type) => (
                      <option key={type.id} value={type.id} className="bg-gray-800 text-gray-100">
                        {type.nom}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email de destination *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email_destination}
                  onChange={(e) => setFormData({ ...formData, email_destination: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-500"
                  placeholder="exemple@domaine.com"
                />
              </div>

              {/* Gestion des champs */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="text-base font-semibold text-gray-100">
                    Champs du formulaire
                  </h3>
                  <motion.button
                    type="button"
                    onClick={addField}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter un champ
                  </motion.button>
                </div>

                {/* Liste des FieldCard avec groupes */}
                <div className="space-y-3 max-h-[50vh] overflow-y-auto scrollbar-custom">
                  {fields.map((field, index) => (
                    <FieldCard
                      key={field.id}
                      field={field}
                      index={index}
                      allFields={fields}
                      templateId={templateId}
                      groupes={groupes}
                      onUpdate={updateField}
                      onRemove={removeField}
                    />
                  ))}
                </div>
                <div className="mt-6">
                  <h3 className="text-gray-200 font-semibold text-sm mb-2">Groupes existants</h3>
                  <GroupField
                    champs={fields}
                    groupes={groupes}
                    onGroupCreate={handleGroupCreate}
                    onGroupUpdate={handleGroupUpdate}
                    onGroupAdd={handleGroupAdd}
                    onGroupRemove={handleGroupRemove}
                    onGroupDelete={handleGroupDelete}
                  />
                </div>

                {/* Indicateur global des groupes */}
                {groupes.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs text-indigo-300 font-medium">
                      {groupes.length} groupe{groupes.length > 1 ? "s" : ""} défini{groupes.length > 1 ? "s" : ""}
                    </p>
                    {groupes.map((group) => (
                      <div
                        key={group.id}
                        className="p-3 bg-indigo-900/20 border border-indigo-700 rounded-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-indigo-200">{group.name}</span>
                          <span className="text-xs text-indigo-300">
                            {group.fields.length} champ{group.fields.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {group.fields.map((fieldId) => {
                            const f = fields.find((field) => field.id === fieldId);
                            if (!f) return null;
                            return (
                              <span
                                key={fieldId}
                                className="px-2 py-0.5 bg-indigo-800 text-indigo-200 text-xs rounded-full"
                              >
                                {f.label || f.nom}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actif */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="actif"
                  checked={formData.actif}
                  onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                  className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="actif" className="ml-2 text-sm text-gray-300">
                  Formulaire actif
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <div className="flex justify-end gap-3">
            <motion.button
              type="submit"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
            >
              Annuler
            </motion.button>
            <motion.button
              type="submit"
              form="form-modal"
              disabled={submitingForm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {form
                ? submitingForm
                  ? "Mise à jour..."
                  : "Mettre à jour"
                : submitingForm
                  ? "Création..."
                  : "Créer"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FormModal;
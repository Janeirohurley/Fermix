
import type { FormType, FormTemplate } from '../components/forms/types/formTypes';
import type { FormSubmission } from '../db/db';
import { db } from '../db/db';

export const apiService = {
  // ---------- FormType ----------
  getFormTypes: async (): Promise<FormType[]> => db.formTypes.toArray(),
  getFormType: async (id: string): Promise<FormType | undefined> => db.formTypes.get(id),
  createFormType: async (data: Partial<FormType>): Promise<FormType> => {
    const newType: FormType = {
      id: String(Date.now()),
      nom: data.nom || "Nouveau Type",
      description: data.description || "",
      couleur: data.couleur || "#ffffff",
      icone: data.icone || "",
      actif: data.actif !== undefined ? data.actif : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await db.formTypes.add(newType);
    return newType;
  },
  updateFormType: async (id: string, data: Partial<FormType>): Promise<FormType | undefined> => {
    await db.formTypes.update(id, { ...data, updated_at: new Date().toISOString() });
    return db.formTypes.get(id);
  },
  deleteFormType: async (id: string): Promise<void> => {
    await db.formTypes.delete(id);
  },

  // ---------- FormTemplate (Forms dynamiques) ----------
  getForms: async (): Promise<FormTemplate[]> => db.formTemplates.toArray(),
  getForm: async (id: number): Promise<FormTemplate | undefined> => db.formTemplates.get(id),
  createForm: async (data: Partial<FormTemplate>): Promise<FormTemplate> => {
    const newFormData = {
      id: data.id || Date.now(),
      nom: data.nom || "Nouveau Formulaire",
      type: data.type || "",
      description: data.description || "",
      champs: data.champs || [],
      groupes: data.groupes || [],
      actif: data.actif !== undefined ? data.actif : true,
      email_destination: data.email_destination || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const id = await db.formTemplates.add(newFormData);
    const newForm = await db.formTemplates.get(id);
    if (!newForm) {
      throw new Error("Failed to create form");
    }
    return newForm;
  },
  updateForm: async (id: number, data: Partial<FormTemplate>): Promise<FormTemplate | undefined> => {
    await db.formTemplates.update(id, { ...data, updated_at: new Date().toISOString() });
    return db.formTemplates.get(id);
  },
  deleteForm: async (id: number): Promise<void> => {
    await db.formTemplates.delete(id);
  },

  // ---------- FormSubmissions ----------
  getFormSubmissions: async (): Promise<FormSubmission[]> => db.formSubmissions.toArray(),
  getFormSubmission: async (id: number): Promise<FormSubmission | undefined> => db.formSubmissions.get(id),
  createFormSubmission: async (data: Omit<FormSubmission, 'id' | 'submittedAt'>): Promise<FormSubmission> => {
    const newSubmission: FormSubmission = {
      ...data,
      submittedAt: new Date().toISOString(),
    };
    const id = await db.formSubmissions.add(newSubmission);
    return { ...newSubmission, id };
  },
  updateFormSubmission: async (id: number, data: Partial<FormSubmission>): Promise<FormSubmission | undefined> => {
    await db.formSubmissions.update(id, data);
    return db.formSubmissions.get(id);
  },
  deleteFormSubmission: async (id: number): Promise<void> => {
    await db.formSubmissions.delete(id);
  },
};

export default apiService;

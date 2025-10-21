import Dexie from "dexie";
import type { FormType, FormTemplate } from '../components/forms/types/formTypes';

export interface FormSubmission {
    id?: number;
    formId: number;
    formName: string;
    data: Record<string, unknown>;
    submittedAt: string;
    status: 'pending' | 'processed' | 'failed';
}

export class LocalDB extends Dexie {
    formTypes!: Dexie.Table<FormType, string>;
    formTemplates!: Dexie.Table<FormTemplate, number>;
    formSubmissions!: Dexie.Table<FormSubmission, number>;

    constructor() {
        super("FormsDB");

        this.version(2).stores({
            formTypes: "id,nom,actif,created_at,updated_at",
            formTemplates: "++id,nom,type,actif,created_at,updated_at",
            formSubmissions: "++id,formId,formName,submittedAt,status",
        });
    }
}

export const db = new LocalDB();

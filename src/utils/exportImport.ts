import { db } from '../db/db';
import type { FormType, FormTemplate, FormSubmission } from '../db/db';

export interface ExportData {
    formTypes: FormType[];
    formTemplates: FormTemplate[];
    formSubmissions: FormSubmission[];
    exportDate: string;
    version: string;
}

export interface ImportResult {
    success: boolean;
    imported: {
        formTypes: number;
        formTemplates: number;
        formSubmissions: number;
    };
    errors: string[];
}

/**
 * Exporte toutes les données de la base de données
 */
export async function exportData(): Promise<ExportData> {
    try {
        const [formTypes, formTemplates, formSubmissions] = await Promise.all([
            db.formTypes.toArray(),
            db.formTemplates.toArray(),
            db.formSubmissions.toArray(),
        ]);

        return {
            formTypes,
            formTemplates,
            formSubmissions,
            exportDate: new Date().toISOString(),
            version: '1.0.0',
        };
    } catch (error) {
        throw new Error(`Erreur lors de l'export: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
}

/**
 * Télécharge les données exportées sous forme de fichier JSON (navigateur)
 */
export async function downloadExportData(): Promise<void> {
    try {
        const data = await exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fermix-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        throw new Error(`Erreur lors du téléchargement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
}

/**
 * Exporte les données via Electron (pour l'exécutable)
 */
export async function exportDataElectron(): Promise<void> {
    try {
        const data = await exportData();
        const result = await window.electronAPI?.exportData(data);

        if (!result?.success) {
            if (result?.canceled) {
                throw new Error('Export annulé par l\'utilisateur');
            } else {
                throw new Error(result?.error || 'Erreur lors de l\'export');
            }
        }
    } catch (error) {
        throw new Error(`Erreur lors de l'export: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
}

/**
 * Importe les données depuis un fichier JSON (navigateur)
 */
export async function importData(file: File): Promise<ImportResult> {
    const result: ImportResult = {
        success: false,
        imported: { formTypes: 0, formTemplates: 0, formSubmissions: 0 },
        errors: [],
    };

    try {
        const text = await file.text();
        const data: ExportData = JSON.parse(text);

        // Validation de base
        if (!data.formTypes || !data.formTemplates || !data.formSubmissions) {
            throw new Error('Format de fichier invalide');
        }

        // Import des types de formulaires
        if (data.formTypes.length > 0) {
            try {
                await db.formTypes.bulkAdd(data.formTypes);
                result.imported.formTypes = data.formTypes.length;
            } catch (error) {
                result.errors.push(`Erreur lors de l'import des types de formulaires: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            }
        }

        // Import des templates de formulaires
        if (data.formTemplates.length > 0) {
            try {
                await db.formTemplates.bulkAdd(data.formTemplates);
                result.imported.formTemplates = data.formTemplates.length;
            } catch (error) {
                result.errors.push(`Erreur lors de l'import des templates: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            }
        }

        // Import des soumissions
        if (data.formSubmissions.length > 0) {
            try {
                await db.formSubmissions.bulkAdd(data.formSubmissions);
                result.imported.formSubmissions = data.formSubmissions.length;
            } catch (error) {
                result.errors.push(`Erreur lors de l'import des soumissions: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            }
        }

        result.success = result.errors.length === 0;
        return result;
    } catch (error) {
        result.errors.push(`Erreur lors de l'import: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        return result;
    }
}

/**
 * Exporte les données dans un format CSV pour Excel (navigateur)
 */
export async function exportToCSV(): Promise<void> {
    try {
        const [formTypes, formTemplates, formSubmissions] = await Promise.all([
            db.formTypes.toArray(),
            db.formTemplates.toArray(),
            db.formSubmissions.toArray(),
        ]);

        // Créer le contenu CSV
        let csvContent = 'Type de Données,Nom,Description,Statut,Date de création\n';

        // Types de formulaires
        formTypes.forEach(type => {
            csvContent += `Type de formulaire,"${type.nom}","${type.description}",${type.actif ? 'Actif' : 'Inactif'},"${type.created_at}"\n`;
        });

        // Templates
        formTemplates.forEach(template => {
            csvContent += `Template,"${template.nom}","${template.description}",${template.actif ? 'Actif' : 'Inactif'},"${template.created_at}"\n`;
        });

        // Soumissions
        formSubmissions.forEach(submission => {
            csvContent += `Soumission,"${submission.formName}","Données soumises",${submission.status},"${submission.submittedAt}"\n`;
        });

        // Télécharger le fichier CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fermix-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        throw new Error(`Erreur lors de l'export CSV: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
}

/**
 * Importe les données depuis un fichier via Electron (pour l'exécutable)
 */
export async function importDataElectron(): Promise<ImportResult> {
    const result: ImportResult = {
        success: false,
        imported: { formTypes: 0, formTemplates: 0, formSubmissions: 0 },
        errors: [],
    };

    try {
        const importResult = await window.electronAPI?.importData();

        if (!importResult?.success) {
            if (importResult?.canceled) {
                throw new Error('Import annulé par l\'utilisateur');
            } else {
                throw new Error(importResult?.error || 'Erreur lors de l\'import');
            }
        }

        const data: ExportData = importResult?.data as ExportData;

        // Validation de base
        if (!data.formTypes || !data.formTemplates || !data.formSubmissions) {
            throw new Error('Format de fichier invalide');
        }

        // Import des types de formulaires
        if (data.formTypes.length > 0) {
            try {
                await db.formTypes.bulkAdd(data.formTypes);
                result.imported.formTypes = data.formTypes.length;
            } catch (error) {
                result.errors.push(`Erreur lors de l'import des types de formulaires: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            }
        }

        // Import des templates de formulaires
        if (data.formTemplates.length > 0) {
            try {
                await db.formTemplates.bulkAdd(data.formTemplates);
                result.imported.formTemplates = data.formTemplates.length;
            } catch (error) {
                result.errors.push(`Erreur lors de l'import des templates: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            }
        }

        // Import des soumissions
        if (data.formSubmissions.length > 0) {
            try {
                await db.formSubmissions.bulkAdd(data.formSubmissions);
                result.imported.formSubmissions = data.formSubmissions.length;
            } catch (error) {
                result.errors.push(`Erreur lors de l'import des soumissions: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            }
        }

        result.success = result.errors.length === 0;
        return result;
    } catch (error) {
        result.errors.push(`Erreur lors de l'import: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        return result;
    }
}

/**
 * Vide complètement la base de données
 */
export async function clearAllData(): Promise<void> {
    try {
        await Promise.all([
            db.formTypes.clear(),
            db.formTemplates.clear(),
            db.formSubmissions.clear(),
        ]);
    } catch (error) {
        throw new Error(`Erreur lors de la suppression des données: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
}

/**
 * Obtient des statistiques sur les données
 */
export async function getDataStats() {
    try {
        const [formTypesCount, formTemplatesCount, formSubmissionsCount] = await Promise.all([
            db.formTypes.count(),
            db.formTemplates.count(),
            db.formSubmissions.count(),
        ]);

        return {
            formTypes: formTypesCount,
            formTemplates: formTemplatesCount,
            formSubmissions: formSubmissionsCount,
            total: formTypesCount + formTemplatesCount + formSubmissionsCount,
        };
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des statistiques: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
}

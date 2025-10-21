/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormField } from './types/formTypes'; // Adapté selon ton chemin

type ValidationResult = {
    valid: boolean;
    error?: string;
};

export const validateField = (
    field: FormField,
    value: any,
): ValidationResult => {
    const rules = field.validation || {};
    const label = field.label;

    // Vérifie si le champ est requis
    if (field.obligatoire && (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))) {
        return {
            valid: false,
            error: rules.customErrorMessage || `Le champ "${label}" est requis.`,
        };
    }

    // Si vide mais pas requis => rien à valider
    if (!value) {
        if (rules.minLength) {
            return { valid: false, error: `Minimum ${rules.minLength} caractères.` };
        } else {
            return { valid: true };
        }
    }

    // Text et Textarea
    if (['text', 'textarea', 'email', 'tel', 'password'].includes(field.type)) {
        const stringVal = String(value);
        if (rules.minLength && stringVal.length < rules.minLength) {
            return { valid: false, error: `Minimum ${rules.minLength} caractères.` };
        }
        if (rules.maxLength && stringVal.length > rules.maxLength) {
            return { valid: false, error: `Maximum ${rules.maxLength} caractères.` };
        }
        if (rules.pattern && !new RegExp(rules.pattern).test(stringVal)) {
            return { valid: false, error: rules.customErrorMessage || `Format invalide.` };
        }
    }

    // Email
    if (field.type === 'email' && rules.emailDomains && rules.emailDomains?.length > 0) {
        const domain = String(value).split('@')[1];
        if (!rules.emailDomains.includes(domain)) {
            return { valid: false, error: rules.customErrorMessage || `Domaine non autorisé.` };
        }
    }

    // Numérique
    if (field.type === 'number') {
        const numberVal = Number(value);
        if (isNaN(numberVal)) {
            return { valid: false, error: `Nombre invalide.` };
        }

        if (rules.min !== undefined && numberVal < rules.min) {
            return { valid: false, error: `Minimum autorisé: ${rules.min}` };
        }

        if (rules.max !== undefined && numberVal > rules.max) {
            return { valid: false, error: `Maximum autorisé: ${rules.max}` };
        }

        if (rules.step !== undefined) {
            const base = rules.min ?? 0;
            const diff = numberVal - base;
            const remainder = diff % rules.step;

            // vérifier si le reste est proche de 0 avec tolérance pour les flottants
            const epsilon = 1e-8;
            if (Math.abs(remainder) > epsilon && Math.abs(rules.step - remainder) > epsilon) {
                return {
                    valid: false,
                    error: `La valeur doit respecter un pas de ${rules.step} à partir de ${base}`,
                };
            }
        }
    }


    // Date
    if (field.type === 'date') {
        const dateVal = new Date(value);
        if (rules.minDate && new Date(value) < new Date(rules.minDate)) {
            return { valid: false, error: `Date minimale: ${rules.minDate}` };
        }
        if (rules.maxDate && new Date(value) > new Date(rules.maxDate)) {
            return { valid: false, error: `Date maximale: ${rules.maxDate}` };
        }
        if (rules.excludeDates?.includes(value)) {
            return { valid: false, error: `Date exclue.` };
        }
        if (rules.allowWeekends === false) {
            const day = dateVal.getDay();
            if (day === 0 || day === 6) {
                return { valid: false, error: `Les week-ends sont interdits.` };
            }
        }
    }

    // Fichier
    // Fichier
    if (field.type === 'file') {
        if (!value || (Array.isArray(value) && value.length === 0)) {
            // Pas de fichiers à valider, on considère comme valide ici
            return { valid: true };
        }

        const files = value as FileList | File[];

        const list = files instanceof FileList ? Array.from(files) : files;

        if (rules.maxFiles && list.length > rules.maxFiles) {
            return { valid: false, error: `Max ${rules.maxFiles} fichiers autorisés.` };
        }

        for (const file of list) {
            // Vérifie que file.name est bien une string avant le .split
            if (typeof file.name !== 'string') continue;

            const ext = '.' + file.name.split('.').pop()?.toLowerCase();
            if (rules.allowedFileTypes && !rules.allowedFileTypes.includes(ext)) {
                return {
                    valid: false,
                    error: rules.customErrorMessage || `Format de fichier non autorisé (${ext})`,
                };
            }

            const sizeMB = file.size / (1024 * 1024);
            if (rules.maxFileSize && sizeMB > rules.maxFileSize) {
                return { valid: false, error: `Fichier trop grand (> ${rules.maxFileSize}MB)` };
            }
            if (rules.minFileSize && sizeMB < rules.minFileSize) {
                return { valid: false, error: `Fichier trop petit (< ${rules.minFileSize}MB)` };
            }
        }
    }

    // Checkbox
    if (field.type === 'checkbox') {
        const selected = Array.isArray(value) ? value : [];
        if (rules.minSelections !== undefined && selected.length < rules.minSelections) {
            return { valid: false, error: `Sélectionnez au moins ${rules.minSelections} option(s).` };
        }
        if (rules.maxSelections !== undefined && selected.length > rules.maxSelections) {
            return { valid: false, error: `Vous pouvez sélectionner au maximum ${rules.maxSelections} option(s).` };
        }
    }
    // telephone 
    if (field.type === 'tel') {
        const val = String(value || '').trim();
        const format = rules.phoneFormat || 'international';

        const patterns: Record<string, RegExp> = {
            international: /^\+\d{6,15}$/, // Ex: +25712345678
            national: /^\d{8}$/,           // Ex: 79123456
        };

        // Format standard
        if (patterns[format]) {
            if (!patterns[format].test(val)) {
                return {
                    valid: false,
                    error:
                        format === 'international'
                            ? 'Format international requis (ex: +25712345678)'
                            : 'Format national requis (ex: 79123456)',
                };
            }
        }

        // Format personnalisé
        if (format === 'custom') {
            const prefix = rules.customPrefix || '';
            const len = rules.customLength;

            const regex = new RegExp(`^${prefix.replace('+', '\\+')}\\d{${len}}$`);

            if (!regex.test(val)) {
                return {
                    valid: false,
                    error:
                        rules.customErrorMessage ||
                        `Le numéro doit commencer par ${prefix} et contenir ${len} chiffres après.`,
                };
            }
        }
    }





    return { valid: true };
};

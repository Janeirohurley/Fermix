export type ChampType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'date'
  | 'number'
  | 'email'
  | 'tel'
  | 'password';

export interface Option {
  label: string;
  value: string;
}

// types/formTypes.ts
export interface FormGroup {
  id: string;
  name: string;
  fields: string[]; // IDs des champs
}
export interface ValidationRules {
  // Validations communes
  required?: boolean;
  customErrorMessage?: string;

  // Validations pour texte et textarea
  minLength?: number;
  maxLength?: number;
  pattern?: string;

  // Validations pour number et date
  min?: number;
  max?: number;
  step?: number;

  // Validations pour email
  emailDomains?: string[]; // Domaines autorisés ex: ['gmail.com', 'company.com']

  // Validations pour tel
  phoneFormat?: 'international' | 'national' | 'custom';
  phonePattern?: string;
  customLength?: string;
  customPrefix?: string

  // Validations pour file
  allowedFileTypes?: string[]; // ex: ['.pdf', '.jpg', '.png']
  maxFileSize?: number; // en MB
  minFileSize?: number; // en MB
  maxFiles?: number; // nombre max de fichiers

  // Validations pour select/radio/checkbox
  minSelections?: number;
  maxSelections?: number;

  // Validations pour date
  minDate?: string;
  maxDate?: string;
  excludeDates?: string[]; // Dates à exclure
  allowWeekends?: boolean;

  // Validations avancées
  dependsOn?: string; // ID du champ dont dépend ce champ
  showIf?: {
    fieldId: string;
    value: unknown;
    condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'| 'equals_with_specific_value';
  };
}

export interface FormField {
  id: string;
  nom: string;
  label: string;
  type: ChampType;
  placeholder?: string;
  obligatoire: boolean;
  options?: Option[];
  validation?: ValidationRules;
  layout?: 'vertical' | 'horizontal'; // Pour checkbox et radio
}

export interface FormType {
  id: string;
  nom: string;
  description: string;
  couleur: string;
  icone: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormTemplate {
  id: number|string;
  nom: string;
  type: string;
  description: string;
  champs: FormField[];
  groupes: FormGroup[]; // <-- NOUVEAU
  actif: boolean;
  email_destination: string;
  created_at: string;
  updated_at: string;
}

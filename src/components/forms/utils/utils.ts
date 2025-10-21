/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FileText,
    Mail,
    Type,
    ChevronDown,
    CheckSquare,
    Circle,
    Upload,
    Calendar,
    Hash,
    Phone,
    Lock
  
} from 'lucide-react';
export const getFieldTypeIcon = (type: string) => {
    const iconMap: { [key: string]: any } = {
        text: Type,
        textarea: FileText,
        select: ChevronDown,
        checkbox: CheckSquare,
        radio: Circle,
        file: Upload,
        date: Calendar,
        number: Hash,
        email: Mail,
        tel: Phone,
        password:Lock
    };
    return iconMap[type] || Type;
};

// Couleurs pour chaque type de champ (inline style)
export const getFieldTypeColor = (type: string) => {
    const colorMap: { [key: string]: { color: string; backgroundColor: string } } = {
        text: { color: '#2563eb', backgroundColor: '#eff6ff' },       // blue-600 / blue-50
        textarea: { color: '#7c3aed', backgroundColor: '#f5f3ff' },   // purple-600 / purple-50
        select: { color: '#16a34a', backgroundColor: '#ecfdf5' },     // green-600 / green-50
        checkbox: { color: '#ea580c', backgroundColor: '#fff7ed' },   // orange-600 / orange-50
        radio: { color: '#db2777', backgroundColor: '#fdf2f8' },      // pink-600 / pink-50
        file: { color: '#4f46e5', backgroundColor: '#eef2ff' },       // indigo-600 / indigo-50
        date: { color: '#dc2626', backgroundColor: '#fef2f2' },       // red-600 / red-50
        number: { color: '#0d9488', backgroundColor: '#f0fdfa' },     // teal-600 / teal-50
        email: { color: '#0891b2', backgroundColor: '#ecfeff' },      // cyan-600 / cyan-50
        tel: { color: '#059669', backgroundColor: '#d1fae5' },        // emerald-600 / emerald-50
        password: { color: '#6b7280', backgroundColor: '#f3f4f6' },   // gray-600 / gray-50 (ajout pour password)
    };

    return colorMap[type] || { color: '#4b5563', backgroundColor: '#f9fafb' }; // fallback gray
};


// Labels français pour les types
export const getFieldTypeLabel = (type: string) => {
    const labelMap: { [key: string]: string } = {
        text: 'Texte',
        textarea: 'Zone de texte',
        select: 'Liste déroulante',
        checkbox: 'Cases à cocher',
        radio: 'Boutons radio',
        file: 'Fichier',
        date: 'Date',
        number: 'Nombre',
        email: 'Email',
        tel: 'Téléphone',
        password: "Mot de passe"
    };
    return labelMap[type] || type;
};


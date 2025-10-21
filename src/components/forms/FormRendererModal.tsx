import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import FormRenderer from './FormRenderer';
import type { FormTemplate, FormField } from './types/formTypes';
import { apiService } from '../../services/api';

interface FormRendererModalProps {
    form: FormTemplate;
    onClose: () => void;
}

type FormFieldEntry = {
    id: string;
    nom: string;
    value: unknown;
};

const FormRendererModal: React.FC<FormRendererModalProps> = ({ form, onClose }) => {
    const [formData, setFormData] = useState<FormFieldEntry[]>([]);
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Initialize form data with empty values for all fields
    useEffect(() => {
        const initialData = form.champs.map((field: FormField) => ({
            id: field.id,
            nom: field.label,
            value: field.type === 'checkbox' ? [] : '',
        }));
        setFormData(initialData);
    }, [form.champs]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Convert form data to submission format
            const submissionData: Record<string, unknown> = {};
            formData.forEach((entry) => {
                submissionData[entry.nom] = entry.value;
            });

            // Create submission
            await apiService.createFormSubmission({
                formId: typeof form.id === 'string' ? parseInt(form.id) : form.id,
                formName: form.nom,
                data: submissionData,
                status: 'pending',
            });

            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError('Erreur lors de la soumission du formulaire');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="bg-gray-800 rounded-md shadow-xl max-w-md w-full p-6 text-center border border-gray-700"
                >
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">Formulaire envoyé !</h3>
                    <p className="text-gray-300 mb-4">
                        Votre formulaire "{form.nom}" a été soumis avec succès.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Fermer
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-700 bg-gray-900 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-100">{form.nom}</h2>
                        <p className="text-gray-400 text-sm mt-1">{form.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-200 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {submitError && (
                        <div className="mb-4 p-3 bg-red-950 border border-red-800 rounded-md flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <p className="text-red-300 text-sm">{submitError}</p>
                        </div>
                    )}

                    <FormRenderer
                        formFields={form.champs}
                        groupes={form.groupes}
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        errors={errors}
                        setErrors={setErrors}
                        isPreview={false}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default FormRendererModal;

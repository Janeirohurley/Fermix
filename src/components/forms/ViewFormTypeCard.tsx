import { Edit2, Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
import type { FormType } from "./types/formTypes";

const ViewFormTypeCard: React.FC<{
    formType: FormType;
    IconComponent: React.ElementType;
    onEdit: () => void;
    onToggleActive: () => void;
    onDelete: () => void;
    toggling: boolean;
}> = ({ formType, IconComponent, onEdit, onToggleActive, onDelete, toggling }) => (
    <div className="p-4 sm:p-6 border rounded-xl border-gray-700 bg-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            {/* Icon */}
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: formType.couleur }}
            >
                <IconComponent className="w-6 h-6" />
            </div>

            {/* Name & description */}
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-100 truncate">{formType.nom}</h4>
                <p className="text-sm text-gray-400 truncate">{formType.description}</p>
            </div>

            {/* Edit & Delete buttons */}
            <div className="flex gap-2 self-start sm:self-auto">
                <button
                    onClick={onEdit}
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Status & Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span
                className={`py-0.5 px-2 rounded-md text-sm  ${formType.actif ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-200'
                    } `}
            >
                {formType.actif ? 'actif' : 'inactif'}
            </span>

            <button
                onClick={onToggleActive}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100 transition-colors"
                disabled={toggling}
            >
                {toggling ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                ) : (
                    <>
                        {formType.actif ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                        {formType.actif ? 'Désactiver' : 'Activer'}
                    </>
                )}
            </button>
        </div>
    </div>
);


export default ViewFormTypeCard;
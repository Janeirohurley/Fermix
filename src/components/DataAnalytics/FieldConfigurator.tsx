import { useMemo } from "react";
import { Settings, Save, Edit } from "lucide-react";
import type { FormSubmission } from "../../db/db";

// Sub-component: FieldConfigurator
function FieldConfigurator({
    selectedForm,
    submissionsForSelected,
    visibleFields,
    toggleField,
    viewName,
    setViewName,
    handleSaveView,
    loadedViewId,
    handleUpdateView,
}: {
    selectedForm: string | null;
    submissionsForSelected: FormSubmission[];
    visibleFields: Set<string>;
    toggleField: (field: string) => void;
    viewName: string;
    setViewName: (name: string) => void;
    handleSaveView: () => void;
    loadedViewId: string | null;
    handleUpdateView: (id: string) => void;
}) {
    const fieldCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        submissionsForSelected.forEach(s => Object.keys(s.data || {}).forEach(k => counts[k] = (counts[k] || 0) + 1));
        return counts;
    }, [submissionsForSelected]);

    const sortedFields = useMemo(() => Object.keys(fieldCounts).sort((a, b) => fieldCounts[b] - fieldCounts[a]), [fieldCounts]);

    return (
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-medium flex items-center gap-2">
                <Settings className="w-5 h-5" />
                View Configuration
            </h3>
            <p className="text-sm text-gray-400 mb-3">Check the columns you want to display in the table.</p>
            <div className="max-h-56 overflow-auto border border-gray-700 p-3 rounded-md bg-gray-900/20">
                {selectedForm ? (
                    sortedFields.length === 0 ? (
                        <div className="text-sm text-gray-400">No fields found in this form.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {sortedFields.map(k => (
                                <label key={k} className="inline-flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={visibleFields.has(k)}
                                        onChange={() => toggleField(k)}
                                        className="w-4 h-4 text-blue-500 rounded bg-gray-700 border-gray-600"
                                    />
                                    <span className="truncate">{k} <span className="text-xs text-gray-400">({fieldCounts[k]})</span></span>
                                </label>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="text-sm text-gray-400">Select a form to see its fields.</div>
                )}
            </div>
            <div className="mt-4 border-t border-gray-700 pt-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                    placeholder="View name (e.g., Name + Weight)"
                    value={viewName}
                    onChange={(e) => setViewName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100"
                />
                {loadedViewId ? (
                    <button
                        onClick={() => handleUpdateView(loadedViewId)}
                        className="px-3 py-2 bg-yellow-600 rounded-md hover:bg-yellow-500 flex items-center gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        Update View
                    </button>
                ) : (
                    <button
                        onClick={handleSaveView}
                        className="px-3 py-2 bg-green-600 rounded-md hover:bg-green-500 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save View
                    </button>
                )}
            </div>
        </div>
    );
}

export default FieldConfigurator;
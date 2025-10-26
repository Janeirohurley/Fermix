import type { SavedView } from "./types/types";
import { Eye, Plus, Trash, Bookmark, Edit } from "lucide-react";

// Sub-component: SavedViews
function SavedViewsPanel({
    savedViews,
    handleLoadView,
    handleAddView,
    handleDeleteView,
    handleUpdateView,
}: {
    savedViews: SavedView[];
    handleLoadView: (view: SavedView) => void;
    handleAddView: (view: SavedView) => void;
    handleDeleteView: (id: string) => void;
    handleUpdateView: (id: string) => void;
}) {
    return (
        <aside className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 className="text-md font-medium flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Saved Views
            </h4>
            <p className="text-sm text-gray-400 mb-2">Instantly recalls a configuration.</p>
            <div className="space-y-2 max-h-56 overflow-auto">
                {savedViews.length === 0 && <div className="text-sm text-gray-400">No saved views.</div>}
                {savedViews.map(v => (
                    <div key={v.id} className="flex flex-col items-start justify-between gap-2 bg-gray-900/30 p-2 rounded-md border border-gray-700">
                        <div className="flex-1 min-w-0">
                            <button onClick={() => handleLoadView(v)} className="text-sm text-left truncate font-medium">{v.name}</button>
                            <div className="text-xs text-gray-400">{v.formName} • {new Date(v.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleLoadView(v)} className="px-2 py-1 text-xs rounded bg-blue-600 flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                Load
                            </button>
                            <button onClick={() => handleAddView(v)} className="px-2 py-1 text-xs rounded bg-green-600 flex items-center gap-1">
                                <Plus className="w-3 h-3" />
                                Add
                            </button>
                            <button onClick={() => handleUpdateView(v.id)} className="px-2 py-1 text-xs rounded bg-yellow-600 flex items-center gap-1">
                                <Edit className="w-3 h-3" />
                                Update
                            </button>
                            <button onClick={() => handleDeleteView(v.id)} className="px-2 py-1 text-xs rounded bg-red-600 flex items-center gap-1">
                                <Trash className="w-3 h-3" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}

export default SavedViewsPanel;
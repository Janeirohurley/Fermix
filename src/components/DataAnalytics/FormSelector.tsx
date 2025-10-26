import { FileText } from 'lucide-react';

// Sub-component: FormSelector
function FormSelector({
    formNames,
    selectedForm,
    setSelectedForm,
    loading,
}: {
    formNames: string[];
    selectedForm: string | null;
    setSelectedForm: (form: string | null) => void;
    loading: boolean;
}) {
    return (
        <section className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <label className="text-sm text-gray-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Form
                </label>
                <select
                    value={selectedForm ?? ''}
                    onChange={(e) => setSelectedForm(e.target.value || null)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100"
                >
                    <option value="">-- Select a form --</option>
                    {formNames.map(fn => (
                        <option key={fn} value={fn}>{fn}</option>
                    ))}
                </select>
                <div className="flex-1 flex flex-wrap gap-2">
                    {formNames.slice(0, 6).map(fn => (
                        <button
                            key={fn}
                            onClick={() => setSelectedForm(fn)}
                            className={`px-3 py-2 rounded-md border ${selectedForm === fn ? 'border-blue-500 bg-blue-900/30' : 'border-gray-600 hover:border-gray-500'}`}
                        >
                            {fn}
                        </button>
                    ))}
                </div>
                <div className="ml-auto">
                    {loading && <span className="text-sm text-gray-400">Loading...</span>}
                </div>
            </div>
        </section>
    );
}

export default FormSelector
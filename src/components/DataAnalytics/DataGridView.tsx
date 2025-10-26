import { useMemo, type Dispatch, type SetStateAction } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { FormSubmission } from "../../db/db";

// Sub-component: DataGrid
function DataGridView({
    filteredSubmissions,
    visibleFieldsArray,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    searchTerm,
    setSearchTerm,
}: {
    filteredSubmissions: FormSubmission[];
    visibleFieldsArray: string[];
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    itemsPerPage: number;
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
}) {
    const paginated = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredSubmissions.slice(start, start + itemsPerPage);
    }, [filteredSubmissions, currentPage, itemsPerPage]);

    return (
        <section className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        placeholder="Global search across visible columns..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100"
                    />
                </div>
                <div className="text-sm text-gray-400">{filteredSubmissions.length} results</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginated.map((row, i) => (
                    <div key={row.id} className="bg-gray-900/30 p-4 rounded-md border border-gray-700">
                        <div className="text-sm font-medium text-gray-300 mb-2">#{(currentPage - 1) * itemsPerPage + i + 1}</div>
                        {visibleFieldsArray.map((f) => (
                            <div key={f} className="mb-1">
                                <span className="text-xs font-medium text-gray-400">{f}:</span>
                                <div className="text-sm text-gray-100 truncate">{String(row.data?.[f] ?? "-")}</div>
                            </div>
                        ))}
                        <div className="mt-2 text-xs text-gray-400">
                            Date: {new Date(row.submittedAt).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                    Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} of{" "}
                    {filteredSubmissions.length}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                    </button>
                    <div className="text-sm text-gray-300">
                        Page {currentPage} / {Math.max(1, Math.ceil(filteredSubmissions.length / itemsPerPage))}
                    </div>
                    <button
                        onClick={() =>
                            setCurrentPage((p) =>
                                Math.min(Math.max(1, Math.ceil(filteredSubmissions.length / itemsPerPage)), p + 1)
                            )
                        }
                        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 flex items-center gap-1"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default DataGridView;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import type { FormSubmission } from "../../db/db";

// Sub-component: DataTable
function DataTableView({
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
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const sortedSubmissions = useMemo(() => {
        if (!sortColumn) return filteredSubmissions;
        return [...filteredSubmissions].sort((a, b) => {
            let aVal: string | number, bVal: string | number;
            if (sortColumn === 'date') {
                aVal = new Date(a.submittedAt).getTime();
                bVal = new Date(b.submittedAt).getTime();
            } else {
                aVal = String(a.data?.[sortColumn] ?? '').toLowerCase();
                bVal = String(b.data?.[sortColumn] ?? '').toLowerCase();
            }
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredSubmissions, sortColumn, sortDirection]);

    const paginated = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedSubmissions.slice(start, start + itemsPerPage);
    }, [sortedSubmissions, currentPage, itemsPerPage]);

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

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
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="text-left text-xs font-medium text-gray-300 border-b border-gray-700">
                            <th className="px-3 py-2">#</th>
                            {visibleFieldsArray.map((f) => (
                                <th key={f} className="px-3 py-2">
                                    <button
                                        onClick={() => handleSort(f)}
                                        className="flex items-center gap-1 hover:text-white"
                                    >
                                        {f}
                                        {sortColumn === f && (
                                            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </button>
                                </th>
                            ))}
                            <th className="px-3 py-2">
                                <button
                                    onClick={() => handleSort('date')}
                                    className="flex items-center gap-1 hover:text-white"
                                >
                                    Date
                                    {sortColumn === 'date' && (
                                        sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                    )}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((row, i) => (
                            <tr key={row.id} className="odd:bg-gray-900/30 hover:bg-gray-700">
                                <td className="px-3 py-2 text-sm">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                {visibleFieldsArray.map((f) => (
                                    <td key={f} className="px-3 py-2 text-sm truncate max-w-xs">
                                        {String(row.data?.[f] ?? "-")}
                                    </td>
                                ))}
                                <td className="px-3 py-2 text-sm">{new Date(row.submittedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

export default DataTableView;
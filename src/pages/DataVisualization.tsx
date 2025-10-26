import React, { useState, useEffect } from 'react';
import { TrendingUp, Search, BarChart3, Settings, ChevronDown } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';
import { motion } from 'framer-motion';
import type { PieLabelRenderProps } from 'recharts';
import type { FormSubmission } from '../db/db';
import apiService from '../services/api';
import PageHeader from '../components/PageHeader';


interface FieldMapping {
    originalField: string;
    displayName: string;
}

const DataVisualization: React.FC = () => {
    const [formNames, setFormNames] = useState<string[]>([]);
    const [selectedFormName, setSelectedFormName] = useState<string | null>(null);
    const [allSubmissions, setAllSubmissions] = useState<FormSubmission[]>([]);
    const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
    const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());
    const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
    const [filters] = useState<Record<string, unknown>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(50);

    // Load submissions on mount
    useEffect(() => {
        loadSubmissions();
    }, []);

    // Filter submissions and initialize fields when form is selected
    useEffect(() => {
        if (selectedFormName) {
            const filtered = allSubmissions.filter(sub => sub.formName === selectedFormName);
            setSubmissions(filtered);
            // Merge duplicate field names and initialize visible fields
            const fieldCounts: Record<string, number> = {};
            filtered.forEach(sub => {
                Object.keys(sub.data).forEach(key => {
                    fieldCounts[key] = (fieldCounts[key] || 0) + 1;
                });
            });
            // Keep only fields that appear in at least one submission
            const allFields = new Set<string>();
            Object.keys(fieldCounts).forEach(key => {
                if (fieldCounts[key] > 0) {
                    allFields.add(key);
                }
            });
            setVisibleFields(allFields);
        } else {
            setSubmissions([]);
            setVisibleFields(new Set());
        }
    }, [selectedFormName, allSubmissions]);

    const loadSubmissions = async () => {
        try {
            setLoading(true);
            const submissionsData = await apiService.getFormSubmissions();
            setAllSubmissions(submissionsData);
            // Extract unique form names
            const uniqueFormNames = [...new Set(submissionsData.map(sub => sub.formName))];
            setFormNames(uniqueFormNames);
        } catch (error) {
            console.error('Error loading submissions:', error);
        } finally {
            setLoading(false);
        }
    };



    const filteredAndSortedSubmissions = () => {
        const filtered = submissions.filter(submission => {
            // Apply search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch = Object.values(submission.data).some(value =>
                    String(value).toLowerCase().includes(searchLower)
                );
                if (!matchesSearch) return false;
            }

            // Apply other filters
            for (const [field, filterValue] of Object.entries(filters)) {
                if (filterValue && submission.data[field] !== filterValue) {
                    return false;
                }
            }

            return true;
        });

        // Apply sorting
        if (sortField) {
            filtered.sort((a, b) => {
                const aValue = a.data[sortField] as string | number;
                const bValue = b.data[sortField] as string | number;

                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    };

    const paginatedSubmissions = () => {
        const filtered = filteredAndSortedSubmissions();
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filtered.slice(startIndex, startIndex + itemsPerPage);
    };

    const renderChart = () => {
        if (!selectedFormName || submissions.length === 0) return null;

        // Prepare data for charts - count occurrences of values in the first visible field
        const visibleFieldsArray = Array.from(visibleFields);
        if (visibleFieldsArray.length === 0) return null;

        const firstField = visibleFieldsArray[0];
        const valueCounts: Record<string, number> = {};

        submissions.forEach(sub => {
            const value = String(sub.data[firstField] || 'N/A');
            valueCounts[value] = (valueCounts[value] || 0) + 1;
        });

        const chartData = Object.entries(valueCounts).map(([name, value]) => ({
            name,
            value
        }));

        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

        return (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                    Data Visualization - {selectedFormName}
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' && (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        )}
                        {chartType === 'line' && (
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        )}
                        {chartType === 'pie' && (
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(props: PieLabelRenderProps) => `${props.name} ${((props.percent as number) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const renderDataTable = () => {
        if (!selectedFormName) return null;

        const visibleFieldsArray = Array.from(visibleFields);
        const paginatedData = paginatedSubmissions();
        const totalFiltered = filteredAndSortedSubmissions().length;

        return (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-100">
                            Form Data - {selectedFormName}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">
                                {totalFiltered} result{totalFiltered !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    #
                                </th>
                                {visibleFieldsArray.map(fieldName => (
                                    <th
                                        key={fieldName}
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                                        onClick={() => {
                                            if (sortField === fieldName) {
                                                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                            } else {
                                                setSortField(fieldName);
                                                setSortOrder('asc');
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-1">
                                            {fieldName}
                                            {sortField === fieldName && (
                                                <ChevronDown className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {paginatedData.map((submission, index) => (
                                <tr key={submission.id} className="hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-300">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </td>
                                    {visibleFieldsArray.map(fieldName => (
                                        <td key={fieldName} className="px-4 py-3 text-sm text-gray-300">
                                            {String(submission.data[fieldName] || '-')}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-sm text-gray-400">
                                        {new Date(submission.submittedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalFiltered > itemsPerPage && (
                    <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalFiltered)} of {totalFiltered} results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-400">
                                Page {currentPage} of {Math.ceil(totalFiltered / itemsPerPage)}
                            </span>
                            <button
                                onClick={() => setCurrentPage(Math.min(Math.ceil(totalFiltered / itemsPerPage), currentPage + 1))}
                                disabled={currentPage === Math.ceil(totalFiltered / itemsPerPage)}
                                className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <PageHeader
                title="Data Visualization"
                subtitle="Analyze and visualize your form data"
                actionLabel="Refresh"
                actionIcon={<TrendingUp className="w-5 h-5" />}
                onActionClick={loadSubmissions}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Form Selection */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-100 mb-4">Form Selection</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formNames.map(formName => (
                            <motion.div
                                key={formName}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedFormName === formName
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-gray-600 hover:border-gray-500'
                                    }`}
                                onClick={() => setSelectedFormName(formName)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                    <div>
                                        <h3 className="font-medium text-gray-100">{formName}</h3>
                                        <p className="text-sm text-gray-400">Form submissions</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {formNames.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-400">
                            No form submissions found. Create forms and submit data first.
                        </div>
                    )}
                </div>

                {selectedFormName && (
                    <>
                        {/* Controls */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                {/* Search */}
                                <div className="flex-1 min-w-64">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Chart Type */}
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-gray-400" />
                                    <select
                                        value={chartType}
                                        onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}
                                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="bar">Barres</option>
                                        <option value="line">Ligne</option>
                                        <option value="pie">Circulaire</option>
                                    </select>
                                </div>

                                {/* Field Visibility */}
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 hover:bg-gray-600"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Columns
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {/* Dropdown would go here */}
                                </div>
                            </div>

                            {/* Custom Table Configuration */}
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-100 mb-3">Configuration du Tableau Personnalisé</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Champ pour "Nom"
                                        </label>
                                        <select
                                            value={fieldMappings.find(m => m.displayName === 'Nom')?.originalField || ''}
                                            onChange={(e) => {
                                                const newMappings = fieldMappings.filter(m => m.displayName !== 'Nom');
                                                if (e.target.value) {
                                                    newMappings.push({ originalField: e.target.value, displayName: 'Nom' });
                                                }
                                                setFieldMappings(newMappings);
                                            }}
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner un champ</option>
                                            {Array.from(visibleFields).map(fieldName => (
                                                <option key={fieldName} value={fieldName}>{fieldName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Champ pour "Prénom"
                                        </label>
                                        <select
                                            value={fieldMappings.find(m => m.displayName === 'Prénom')?.originalField || ''}
                                            onChange={(e) => {
                                                const newMappings = fieldMappings.filter(m => m.displayName !== 'Prénom');
                                                if (e.target.value) {
                                                    newMappings.push({ originalField: e.target.value, displayName: 'Prénom' });
                                                }
                                                setFieldMappings(newMappings);
                                            }}
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner un champ</option>
                                            {Array.from(visibleFields).map(fieldName => (
                                                <option key={fieldName} value={fieldName}>{fieldName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Chart */}
                        {renderChart()}

                        {/* Data Table */}
                        {renderDataTable()}
                    </>
                )}
            </div>
        </div>
    );
};

export default DataVisualization;

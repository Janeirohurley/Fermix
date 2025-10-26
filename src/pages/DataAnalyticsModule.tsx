import { useEffect, useMemo, useState, type JSX } from 'react';
import { TrendingUp, Grid3X3, Table, X } from 'lucide-react';
import apiService from '../services/api';
import type { FormSubmission } from '../db/db';
import PageHeader from '../components/PageHeader';
import type { SavedView } from '../components/DataAnalytics/types/types';
import { loadSavedViews, saveSavedViews } from '../components/DataAnalytics/utils/storage';
import FormSelector from '../components/DataAnalytics/FormSelector';
import FieldConfigurator from '../components/DataAnalytics/FieldConfigurator';
import SavedViewsPanel from '../components/DataAnalytics/SavedViewsPanel';
import DataTableView from '../components/DataAnalytics/DataTableView';
import DataGridView from '../components/DataAnalytics/DataGridView';
import CollapsibleComponent from '../components/DataAnalytics/CollapsibleComponent';

type ActiveView = {
  view: SavedView;
  searchTerm: string;
  currentPage: number;
  viewMode: 'table' | 'grid';
};

// Main component
export default function DataAnalyticsModule(): JSX.Element {
  const [allSubmissions, setAllSubmissions] = useState<FormSubmission[]>([]);
  const [formNames, setFormNames] = useState<string[]>([]);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());
  const [savedViews, setSavedViews] = useState<SavedView[]>(() => loadSavedViews());
  const [viewName, setViewName] = useState('');
  const [loadedViewId, setLoadedViewId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeViews, setActiveViews] = useState<ActiveView[]>([]);
  const itemsPerPage = 50;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const subs = await apiService.getFormSubmissions();
        if (!mounted) return;
        setAllSubmissions(subs);
        const uniq = Array.from(new Set(subs.map(s => s.formName))).sort();
        setFormNames(uniq);
      } catch (e) {
        console.error('Error loading submissions', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedForm) {
      setVisibleFields(new Set());
      setLoadedViewId(null);
      return;
    }
    const subs = allSubmissions.filter(s => s.formName === selectedForm);
    const allKeys = new Set<string>();
    subs.forEach(s => Object.keys(s.data || {}).forEach(k => allKeys.add(k)));
    setVisibleFields(prev => {
      if (prev.size > 0) {
        const intersection = new Set<string>(Array.from(allKeys).filter(k => prev.has(k)));
        if (intersection.size > 0) return intersection;
      }
      const pick = Array.from(allKeys).slice(0, 6);
      return new Set(pick);
    });
    setCurrentPage(1);
  }, [selectedForm, allSubmissions]);

  const submissionsForSelected = useMemo(() => {
    if (!selectedForm) return [] as FormSubmission[];
    return allSubmissions.filter(s => s.formName === selectedForm);
  }, [selectedForm, allSubmissions]);

  const visibleFieldsArray = useMemo(() => Array.from(visibleFields), [visibleFields]);

  const toggleField = (field: string) => {
    setVisibleFields(prev => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  };

  const handleSaveView = () => {
    if (!selectedForm) return alert('Select a form before saving the view.');
    if (!viewName.trim()) return alert("Give this view a name (e.g., 'Name + Weight').");
    const newView: SavedView = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: viewName.trim(),
      formName: selectedForm,
      visibleFields: visibleFieldsArray,
      filters: {},
      createdAt: new Date().toISOString(),
    };
    const updated = [newView, ...savedViews];
    setSavedViews(updated);
    saveSavedViews(updated);
    setViewName('');
    setLoadedViewId(null);
    alert('View saved ✅');
  };

  const handleLoadView = (view: SavedView) => {
    setSelectedForm(view.formName);
    setVisibleFields(new Set(view.visibleFields));
    setViewName(view.name);
    setLoadedViewId(view.id);
    setCurrentPage(1);
  };

  const handleAddView = (view: SavedView) => {
    if (activeViews.some(av => av.view.id === view.id)) {
      return alert('This view is already added.');
    }
    setActiveViews(prev => [...prev, { view, searchTerm: '', currentPage: 1, viewMode: 'table' }]);
  };

  const handleDeleteView = (id: string) => {
    if (!confirm('Delete this view?')) return;
    const updated = savedViews.filter(v => v.id !== id);
    setSavedViews(updated);
    saveSavedViews(updated);
    // Also remove from active views if present
    setActiveViews(prev => prev.filter(av => av.view.id !== id));
  };

  const handleUpdateView = (id: string) => {
    if (!selectedForm) {
      alert('Please select a form first.');
      return;
    }
    const updatedViews = savedViews.map(v =>
      v.id === id
        ? { ...v, name: viewName.trim(), formName: selectedForm, visibleFields: Array.from(visibleFields) }
        : v
    );
    setSavedViews(updatedViews);
    saveSavedViews(updatedViews);
    alert('View updated successfully!');
  };

  const filteredSubmissions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const subs = submissionsForSelected;
    if (!q) return subs;
    return subs.filter(s => {
      for (const f of visibleFieldsArray) {
        const val = s.data?.[f];
        if (val == null) continue;
        if (String(val).toLowerCase().includes(q)) return true;
      }
      return false;
    });
  }, [searchTerm, submissionsForSelected, visibleFieldsArray]);

  const handleRefresh = () => {
    setLoading(true);
    apiService.getFormSubmissions()
      .then(s => {
        setAllSubmissions(s);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <PageHeader title='Data Exploration'
        subtitle='Select a form, choose columns and save your view.'
        actionLabel='Refresh'
        actionIcon={<TrendingUp className="w-4 h-4" />}
        onActionClick={handleRefresh}
        disabled={loading}
      />
      <main className="max-w-6xl mx-auto space-y-6 pt-6">
        <CollapsibleComponent title="Form Selector">
          <FormSelector
            formNames={formNames}
            selectedForm={selectedForm}
            setSelectedForm={setSelectedForm}
            loading={loading}
          />
        </CollapsibleComponent>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CollapsibleComponent title="Field Configurator">
            <FieldConfigurator
              selectedForm={selectedForm}
              submissionsForSelected={submissionsForSelected}
              visibleFields={visibleFields}
              toggleField={toggleField}
              viewName={viewName}
              setViewName={setViewName}
              handleSaveView={handleSaveView}
              loadedViewId={loadedViewId}
              handleUpdateView={handleUpdateView}
            />
          </CollapsibleComponent>
          <CollapsibleComponent title="Saved Views">
            <SavedViewsPanel
              savedViews={savedViews}
              handleLoadView={handleLoadView}
              handleAddView={handleAddView}
              handleDeleteView={handleDeleteView}
              handleUpdateView={handleUpdateView}
            />
          </CollapsibleComponent>
        </section>
        <CollapsibleComponent title="Data Table View">
          <DataTableView
            filteredSubmissions={filteredSubmissions}
            visibleFieldsArray={visibleFieldsArray}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </CollapsibleComponent>
        {/* Section for additional loaded views */}
        {activeViews.length > 0 && (
          <CollapsibleComponent title="Additional Views">
            <section className="space-y-8">
              {activeViews.map(av => {
                const subs = allSubmissions.filter(s => s.formName === av.view.formName);
                const vfa = av.view.visibleFields;
                const filtered = (() => {
                  const q = av.searchTerm.trim().toLowerCase();
                  if (!q) return subs;
                  return subs.filter(s => {
                    for (const f of vfa) {
                      const val = s.data?.[f];
                      if (val == null) continue;
                      if (String(val).toLowerCase().includes(q)) return true;
                    }
                    return false;
                  });
                })();

                return (
                  <div key={av.view.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">{av.view.name} ({av.view.formName})</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveViews(prev =>
                            prev.map(p =>
                              p.view.id === av.view.id
                                ? { ...p, viewMode: av.viewMode === 'table' ? 'grid' : 'table' }
                                : p
                            )
                          )}
                          className="px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500 flex items-center gap-1"
                        >
                          {av.viewMode === 'table' ? <Grid3X3 className="w-3 h-3" /> : <Table className="w-3 h-3" />}
                          {av.viewMode === 'table' ? 'Grid' : 'Table'}
                        </button>
                        <button
                          onClick={() => setActiveViews(prev => prev.filter(p => p.view.id !== av.view.id))}
                          className="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-500 flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Close
                        </button>
                      </div>
                    </div>
                    {av.viewMode === 'table' ? (
                      <DataTableView
                        filteredSubmissions={filtered}
                        visibleFieldsArray={vfa}
                        currentPage={av.currentPage}
                        setCurrentPage={(newPage) => {
                          setActiveViews(prev =>
                            prev.map(p =>
                              p.view.id === av.view.id
                                ? { ...p, currentPage: typeof newPage === 'function' ? newPage(p.currentPage) : newPage }
                                : p
                            )
                          );
                        }}
                        itemsPerPage={itemsPerPage}
                        searchTerm={av.searchTerm}
                        setSearchTerm={(newTerm) => {
                          setActiveViews(prev =>
                            prev.map(p =>
                              p.view.id === av.view.id
                                ? { ...p, searchTerm: typeof newTerm === 'function' ? newTerm(p.searchTerm) : newTerm }
                                : p
                            )
                          );
                        }}
                      />
                    ) : (
                      <DataGridView
                        filteredSubmissions={filtered}
                        visibleFieldsArray={vfa}
                        currentPage={av.currentPage}
                        setCurrentPage={(newPage) => {
                          setActiveViews(prev =>
                            prev.map(p =>
                              p.view.id === av.view.id
                                ? { ...p, currentPage: typeof newPage === 'function' ? newPage(p.currentPage) : newPage }
                                : p
                            )
                          );
                        }}
                        itemsPerPage={itemsPerPage}
                        searchTerm={av.searchTerm}
                        setSearchTerm={(newTerm) => {
                          setActiveViews(prev =>
                            prev.map(p =>
                              p.view.id === av.view.id
                                ? { ...p, searchTerm: typeof newTerm === 'function' ? newTerm(p.searchTerm) : newTerm }
                                : p
                            )
                          );
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </section>
          </CollapsibleComponent>
        )}
      </main>
    </div>
  );
}
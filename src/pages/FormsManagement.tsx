
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  FileText,
  Mail,
  X,
  Loader2,
  AlertCircle,
  Settings
} from 'lucide-react';
import FormPreview from '../components/forms/FormPreview';
import FormRendererModal from '../components/forms/FormRendererModal';
import type { FormTemplate, FormType } from '../components/forms/types/formTypes';
import { apiService } from '../services/api';
import { getDynamicIconComponent } from '../utils/getDynamicIconComponent';
import FormModal from '../components/forms/FormModal';
import PageHeader from '../components/PageHeader';

const FormsManagement = () => {
  const [formTypes, setFormTypes] = useState<FormType[]>([]);
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingForm, setEditingForm] = useState<FormTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewForm, setPreviewForm] = useState<FormTemplate | null>(null);
  const [showRenderer, setShowRenderer] = useState(false);
  const [rendererForm, setRendererForm] = useState<FormTemplate | null>(null);
  const [submitingForm, setSubmitingForm] = useState(false);
  const [isNewForm, setIsNewForm] = useState(false);

  // Statistiques du dashboard
  const stats = {
    totalForms: forms.length,
    activeForms: forms.filter(f => f.actif).length,
    totalFields: forms.reduce((acc, form) => acc + form.champs.length, 0),
    recentForms: forms.filter(f => {
      const createdDate = new Date(f.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }).length
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [types, forms] = await Promise.all([
        apiService.getFormTypes(),
        apiService.getForms()
      ]);

      const options = types.map((type: FormType) => ({
        ...type,
        label: type.nom,
        value: type.nom,
      }));

      setFormTypes(options);
      setForms(forms);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: 'all', label: 'Tous les types' },
    ...formTypes.filter(type => type.actif).map(type => ({
      value: type.id,
      label: type.nom
    }))
  ];

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || Number(form.type) === Number(selectedType);
    return matchesSearch && matchesType;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce formulaire ?')) {
      return;
    }

    try {
      setError(null);
      await apiService.deleteForm(id);
      setForms(forms => forms.filter(form => form.id !== id));
      if (editingForm?.id === id) {
        setShowModal(false);
        setEditingForm(null);
        setShowPreview(false);
        setPreviewForm(null);
        setIsNewForm(false);
      }
    } catch (err) {
      setError('Erreur lors de la suppression du formulaire');
      console.error('Erreur:', err);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      setError(null);
      const form = forms.find(f => f.id === id);
      if (!form) return;

      const updatedForm = await apiService.updateForm(id, { ...form, actif: !form.actif });
      if (!updatedForm) return;

      setForms(forms => forms.map(f => f.id === id ? updatedForm : f));
      if (editingForm?.id === id) {
        setEditingForm(updatedForm);
        setPreviewForm(updatedForm);
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du formulaire');
      console.error('Erreur:', err);
    }
  };

  const handleSaveForm = async (formData: FormTemplate) => {
    setSubmitingForm(true);
    try {
      setError(null);

      if (!isNewForm && formData.id && forms.some(f => f.id === formData.id)) {
        // Update existing form
        const updatedForm = await apiService.updateForm(Number(formData.id), formData);
        if (!updatedForm) throw new Error("Formulaire introuvable");

        setForms(forms => forms.map(f => f.id === formData.id ? updatedForm : f));
        setEditingForm(updatedForm);
        setPreviewForm(updatedForm);
      } else {
        // Create new form
        const newForm = await apiService.createForm(formData);
        setForms(forms => [...forms, newForm]);
        setEditingForm(newForm);
        setPreviewForm(newForm);
      }

      setShowModal(false);
      setIsNewForm(false);
    } catch (err) {
      setError('Erreur lors de la sauvegarde du formulaire');
      console.error('Erreur:', err);
    } finally {
      setSubmitingForm(false);
    }
  };

  const handleUpdateForm = useCallback((formData: FormTemplate) => {
    setPreviewForm(formData);
  }, []);

  const handleNewForm = () => {
    setEditingForm(null);
    setShowModal(true);
    setShowPreview(true);
    setIsNewForm(true);
    setPreviewForm({
      id: Date.now(),
      nom: "",
      type: formTypes.length > 0 ? formTypes[0].id : "",
      description: "",
      email_destination: "",
      actif: true,
      champs: [],
      groupes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  return (
    <div className="min-h-screen text-gray-100">
      {/* Header Dashboard */}
      <PageHeader
        title="Forms"
        subtitle="Streamlined form management"
        actionLabel="New Form"
        actionIcon={<Plus className="w-4 h-4" />}
        onActionClick={handleNewForm}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-gray-800 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-medium">Total Forms</p>
                <p className="text-xl font-semibold text-gray-100">{stats.totalForms}</p>
              </div>
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gray-800 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-medium">Active Forms</p>
                <p className="text-xl font-semibold text-gray-100">{stats.activeForms}</p>
              </div>
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-gray-800 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-medium">Total Fields</p>
                <p className="text-xl font-semibold text-gray-100">{stats.totalFields}</p>
              </div>
              <Settings className="w-6 h-6 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-gray-800 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-medium">New (7d)</p>
                <p className="text-xl font-semibold text-gray-100">{stats.recentForms}</p>
              </div>
              <Plus className="w-6 h-6 text-blue-400" />
            </div>
          </motion.div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-950 border border-red-800 rounded-md flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-red-300 font-medium">Error</p>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto p-1 text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="text-gray-400">Loading forms...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Search and Filter */}
            <div className="bg-gray-800 rounded-md border border-gray-700 p-4 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search forms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Filter className="text-gray-500 w-5 h-5" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-gray-800 text-gray-100">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Forms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredForms.map((form, index) => {
                const formType = formTypes.find(ft => Number(ft.id) === Number(form.type))?.icone ?? "Packages";
                const TypeIcon = getDynamicIconComponent(formType);
                const colorIcon = formTypes.find(ft => Number(ft.id) === Number(form.type))?.couleur || 'bg-gray-600';

                return (
                  <motion.div
                    key={form.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`bg-gray-800 rounded-md border border-gray-700 hover: border- gray-600 transition-all duration-300 ${!form.actif ? 'opacity-60' : ''} `}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div style={{ backgroundColor: colorIcon }} className={` w-8 h-8 rounded-md flex items-center justify-center text-white`}>
                            <TypeIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-gray-100">{form.nom}</h3>
                            <span style={{ backgroundColor: colorIcon }} className={` px-2 py-0.5 rounded-md text-xs font-medium text-white`}>
                              {formTypes.find((type) => Number(type.id) === Number(form.type))?.nom}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {form.actif ? (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          ) : (
                            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{form.description}</p>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <FileText className="w-4 h-4" />
                          <span>{form.champs.length} field(s)</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{form.email_destination}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleActive(Number(form.id))}
                            className={`p-2 rounded-md transition-colors ${form.actif ? 'bg-blue-700 text-blue-200 hover:bg-blue-600' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'} `}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingForm(form);
                              setPreviewForm(form);
                              setShowModal(true);
                              setShowPreview(true);
                              setIsNewForm(false);
                            }}
                            className="p-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(Number(form.id))}
                            className="p-2 bg-red-950 text-red-400 rounded-md hover:bg-red-900 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setPreviewForm(form);
                              setShowPreview(true);
                              setIsNewForm(false);
                            }}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            Preview
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setRendererForm(form);
                              setShowRenderer(true);
                            }}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            Fill Form
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredForms.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">No forms found</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm || selectedType !== 'all'
                    ? 'Try adjusting your search criteria'
                    : 'Start by creating your first form'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditingForm(null);
                    setShowModal(true);
                    setShowPreview(true);
                    setIsNewForm(true);
                    setPreviewForm({
                      id: Date.now(),
                      nom: '',
                      type: formTypes.length > 0 ? formTypes[0].id : '',
                      description: '',
                      email_destination: '',
                      actif: true,
                      champs: [],
                      groupes: [],
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    });
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Create a Form
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      {showModal && (
        <FormModal
          form={editingForm}
          formTypes={formTypes}
          onClose={() => {
            setShowModal(false);
            setEditingForm(null);
            setShowPreview(false);
            setPreviewForm(null);
            setIsNewForm(false);
          }}
          onSave={handleSaveForm}
          onUpdate={handleUpdateForm}
          submitingForm={submitingForm}
        />
      )}

      {/* Preview Modal */}
      {showPreview && previewForm && (
        <FormPreview
          form={previewForm}
          onClose={() => {
            setShowPreview(false);
            setPreviewForm(null);
            setIsNewForm(false);
          }}
        />
      )}

      {/* Renderer Modal */}
      {showRenderer && rendererForm && (
        <FormRendererModal
          form={rendererForm}
          onClose={() => {
            setShowRenderer(false);
            setRendererForm(null);
          }}
        />
      )}
    </div>
  );
};

export default FormsManagement;

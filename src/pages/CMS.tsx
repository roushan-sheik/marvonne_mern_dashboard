import { useState, useEffect } from 'react';
import { useGetAllFaqsQuery, useCreateFaqMutation, useUpdateFaqMutation, useDeleteFaqMutation } from '../store/apiSlice';
import { Loader2, Plus, Edit2, Trash2, X, CheckCircle, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function CMS() {
  const { data: response, isLoading, error } = useGetAllFaqsQuery({});
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const faqs = response?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [faqToDelete, setFaqToDelete] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (editingFaq) {
      setValue('question', editingFaq.question);
      setValue('answer', editingFaq.answer);
    } else {
      reset();
    }
  }, [editingFaq, setValue, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (editingFaq) {
        await updateFaq({ id: editingFaq.id, ...data }).unwrap();
        setToastMsg('FAQ updated successfully!');
      } else {
        await createFaq(data).unwrap();
        setToastMsg('FAQ created successfully!');
      }
      setTimeout(() => setToastMsg(''), 4000);
      closeModal();
    } catch (err: any) {
      alert(err?.data?.message || err?.message || 'Operation failed');
    }
  };

  const confirmDelete = async () => {
    if (!faqToDelete) return;
    try {
      await deleteFaq(faqToDelete.id).unwrap();
      setToastMsg('FAQ deleted successfully!');
      setTimeout(() => setToastMsg(''), 4000);
      setFaqToDelete(null);
    } catch (err: any) {
      alert(err?.data?.message || err?.message || 'Delete failed');
    }
  };

  const openModal = (faq: any = null) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    reset();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a192f]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Failed to load FAQs</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-[#0a192f] to-[#0f3a4a] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="bg-[#bef264]/20 p-3 rounded-2xl">
            <FileText className="w-8 h-8 text-[#bef264]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">CMS Management</h1>
            <p className="text-[#bef264] font-medium mt-1">Manage platform FAQs and content</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-[#bef264] text-[#0a192f] font-bold rounded-full hover:bg-[#bef264]/90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add FAQ
        </button>
      </div>

      <div className="p-6 sm:p-10">
        {faqs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No FAQs found</h3>
            <p className="text-gray-500 text-sm">Get started by creating your first FAQ.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqs.map((faq: any) => (
              <div key={faq.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative group">
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(faq)} className="p-2 bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setFaqToDelete(faq)} className="p-2 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 pr-16">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 flex-1">
              <form id="faqForm" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Question</label>
                  <input
                    {...register('question', { required: 'Question is required' })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all"
                    placeholder="Enter the question"
                  />
                  {errors.question && <p className="text-red-500 text-xs mt-1">{(errors.question as any).message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Answer</label>
                  <textarea
                    {...register('answer', { required: 'Answer is required' })}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Enter the answer"
                  ></textarea>
                  {errors.answer && <p className="text-red-500 text-xs mt-1">{(errors.answer as any).message}</p>}
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50">
              <button onClick={closeModal} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button form="faqForm" type="submit" disabled={isCreating || isUpdating} className="px-5 py-2.5 bg-[#0a192f] text-white font-bold rounded-xl hover:bg-[#0f3a4a] transition-colors disabled:opacity-70 flex items-center">
                {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingFaq ? 'Save Changes' : 'Create FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {faqToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete FAQ</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setFaqToDelete(null)} className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center">
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center bg-[#0a192f] text-white px-5 py-3.5 rounded-2xl shadow-xl animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-[#bef264] mr-3" />
          <p className="text-sm font-medium">{toastMsg}</p>
          <button onClick={() => setToastMsg('')} className="ml-4 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetHeroCmsQuery, useUpdateHeroCmsMutation } from '../store/apiSlice';
import { Loader2, Save } from 'lucide-react';

interface HeroCmsForm {
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  description: string;
  buttonText: string;
}

const HeroCMS = () => {
  const { data, isLoading } = useGetHeroCmsQuery({});
  const [updateHeroCms, { isLoading: isUpdating }] = useUpdateHeroCmsMutation();
  
  const { register, handleSubmit, reset } = useForm<HeroCmsForm>();
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (data?.data) {
      reset({
        headingPrefix: data.data.headingPrefix || '',
        headingHighlight: data.data.headingHighlight || '',
        headingSuffix: data.data.headingSuffix || '',
        description: data.data.description || '',
        buttonText: data.data.buttonText || '',
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: HeroCmsForm) => {
    try {
      await updateHeroCms(formData).unwrap();
      setToastMsg('Hero section updated successfully');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (error: any) {
      setToastMsg(error?.data?.message || 'Failed to update section');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#3CCFBD]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {toastMsg && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center shadow-sm">
          <p className="text-sm font-medium">{toastMsg}</p>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Hero Section</h1>
        <p className="text-sm text-gray-500 mt-1">Manage the content for the top hero section of the home page</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 pb-4 border-b border-gray-100">Heading</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading Prefix</label>
              <input
                {...register('headingPrefix')}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all"
                placeholder="Turn Your Photo Into a"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading Highlight (Gradient Text)</label>
              <input
                {...register('headingHighlight')}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all"
                placeholder="Magical Personalized Storybook"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading Suffix</label>
              <input
                {...register('headingSuffix')}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all"
                placeholder="Adventure"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 pb-4 border-b border-gray-100">Description</h2>
          
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Main Description Text</label>
              <p className="text-xs text-gray-500 mt-1">
                <strong>Pro tip:</strong> To make any text bold, wrap it with <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">&lt;strong&gt;</code> and <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">&lt;/strong&gt;</code> tags. 
                For example: <code className="bg-gray-100 px-1 py-0.5 rounded text-[#3CCFBD]">Welcome to &lt;strong&gt;Dreamtales&lt;/strong&gt;</code> will appear as "Welcome to <b>Dreamtales</b>".
              </p>
            </div>
            <textarea
              {...register('description')}
              rows={6}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all resize-y"
              placeholder="Welcome to <strong>Dreamtales</strong>..."
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 pb-4 border-b border-gray-100">Call to Action</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
            <input
              {...register('buttonText')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all"
              placeholder="Create Your Book"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center space-x-2 px-6 py-3 bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 text-white rounded-xl transition-all disabled:opacity-50"
          >
            {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeroCMS;

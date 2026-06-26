import { useEffect, useState } from 'react';
import { useGetFollowUsQuery, useUpdateFollowUsMutation } from '../store/apiSlice';
import { Loader2, Share2, Save, CheckCircle, X, Link as LinkIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function FollowUs() {
  const { data, isLoading, error } = useGetFollowUsQuery({});
  const [updateFollowUs, { isLoading: isUpdating }] = useUpdateFollowUsMutation();
  const [toastMsg, setToastMsg] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (data?.data) {
      reset({
        facebook_url: data.data.facebook_url || '',
        instagram_url: data.data.instagram_url || '',
        linkedin_url: data.data.linkedin_url || '',
        twitter_url: data.data.twitter_url || '',
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: any) => {
    try {
      await updateFollowUs(formData).unwrap();
      setToastMsg('Social links updated successfully!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(err?.data?.message || err?.message || 'Operation failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a192f]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Failed to load settings</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-[#0a192f] to-[#0f3a4a] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="bg-[#bef264]/20 p-3 rounded-2xl">
            <Share2 className="w-8 h-8 text-[#bef264]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Follow Us Links</h1>
            <p className="text-[#bef264] font-medium mt-1">Manage your platform's social media links</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Facebook */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-bold text-gray-700">
                <LinkIcon className="w-4 h-4 mr-2 text-blue-600" />
                Facebook URL
              </label>
              <input
                {...register('facebook_url', { 
                  pattern: { value: /^https?:\/\/.*/, message: 'Must be a valid URL' } 
                })}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all"
              />
              {errors.facebook_url && <p className="text-red-500 text-xs">{(errors.facebook_url as any).message}</p>}
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-bold text-gray-700">
                <LinkIcon className="w-4 h-4 mr-2 text-pink-600" />
                Instagram URL
              </label>
              <input
                {...register('instagram_url', { 
                  pattern: { value: /^https?:\/\/.*/, message: 'Must be a valid URL' } 
                })}
                placeholder="https://instagram.com/yourpage"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all"
              />
              {errors.instagram_url && <p className="text-red-500 text-xs">{(errors.instagram_url as any).message}</p>}
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-bold text-gray-700">
                <LinkIcon className="w-4 h-4 mr-2 text-blue-700" />
                LinkedIn URL
              </label>
              <input
                {...register('linkedin_url', { 
                  pattern: { value: /^https?:\/\/.*/, message: 'Must be a valid URL' } 
                })}
                placeholder="https://linkedin.com/company/yourpage"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all"
              />
              {errors.linkedin_url && <p className="text-red-500 text-xs">{(errors.linkedin_url as any).message}</p>}
            </div>

            {/* Twitter */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-bold text-gray-700">
                <LinkIcon className="w-4 h-4 mr-2 text-blue-400" />
                Twitter (X) URL
              </label>
              <input
                {...register('twitter_url', { 
                  pattern: { value: /^https?:\/\/.*/, message: 'Must be a valid URL' } 
                })}
                placeholder="https://twitter.com/yourpage"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all"
              />
              {errors.twitter_url && <p className="text-red-500 text-xs">{(errors.twitter_url as any).message}</p>}
            </div>

          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={isUpdating}
              className="px-6 py-3 bg-[#0a192f] text-white font-bold rounded-xl hover:bg-[#0f3a4a] transition-colors disabled:opacity-70 flex items-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
            >
              {isUpdating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              Save Links
            </button>
          </div>
        </form>
      </div>

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

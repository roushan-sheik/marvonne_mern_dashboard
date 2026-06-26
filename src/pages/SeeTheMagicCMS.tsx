import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetSeeTheMagicQuery, useUpdateSeeTheMagicMutation } from '../store/apiSlice';
import { Image as ImageIcon, Loader2, Save } from 'lucide-react';

interface SeeTheMagicForm {
  headerTitle: string;
  headerSubtitle: string;
  card1Title: string;
  card1Description: string;
  card2Title: string;
  card2Description: string;
  card3Title: string;
  card3Description: string;
}

const SeeTheMagicCMS = () => {
  const { data, isLoading } = useGetSeeTheMagicQuery({});
  const [updateSeeTheMagic, { isLoading: isUpdating }] = useUpdateSeeTheMagicMutation();
  
  const { register, handleSubmit, reset } = useForm<SeeTheMagicForm>();
  
  const [card1Image, setCard1Image] = useState<File | null>(null);
  const [card2Image, setCard2Image] = useState<File | null>(null);
  const [card3Image, setCard3Image] = useState<File | null>(null);
  
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (data?.data) {
      reset({
        headerTitle: data.data.headerTitle || '',
        headerSubtitle: data.data.headerSubtitle || '',
        card1Title: data.data.card1Title || '',
        card1Description: data.data.card1Description || '',
        card2Title: data.data.card2Title || '',
        card2Description: data.data.card2Description || '',
        card3Title: data.data.card3Title || '',
        card3Description: data.data.card3Description || '',
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: SeeTheMagicForm) => {
    const dataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataObj.append(key, value);
    });

    if (card1Image) dataObj.append('card1Image', card1Image);
    if (card2Image) dataObj.append('card2Image', card2Image);
    if (card3Image) dataObj.append('card3Image', card3Image);

    try {
      await updateSeeTheMagic(dataObj).unwrap();
      setToastMsg('See The Magic section updated successfully');
      
      // Reset files after successful upload
      setCard1Image(null);
      setCard2Image(null);
      setCard3Image(null);
      setTimeout(() => setToastMsg(''), 3000);
    } catch (error: any) {
      setToastMsg(error?.data?.message || 'Failed to update section');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  const ImagePreview = ({ currentUrl, newFile }: { currentUrl: string, newFile: File | null }) => {
    const previewUrl = newFile ? URL.createObjectURL(newFile) : currentUrl;
    
    return previewUrl ? (
      <img 
        src={previewUrl} 
        alt="Preview" 
        className="w-full h-40 object-cover rounded-lg border border-gray-200 mt-2"
      />
    ) : (
      <div className="w-full h-40 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center mt-2">
        <ImageIcon className="w-8 h-8 text-gray-300" />
      </div>
    );
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
        <h1 className="text-2xl font-semibold text-gray-900">See The Magic Section</h1>
        <p className="text-sm text-gray-500 mt-1">Manage the content and images for the home page magic section</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 pb-4 border-b border-gray-100">Header Content</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                {...register('headerTitle')}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all"
                placeholder="See The Magic Before You Buy"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <textarea
                {...register('headerSubtitle')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all resize-none"
                placeholder="Preview every page..."
              />
            </div>
          </div>
        </div>

        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 pb-4 border-b border-gray-100">Card 1</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  {...register('card1Title')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  {...register('card1Description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCard1Image(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#3CCFBD]/10 file:text-[#3CCFBD] hover:file:bg-[#3CCFBD]/20 transition-all cursor-pointer"
              />
              <ImagePreview currentUrl={data?.data?.card1Image} newFile={card1Image} />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 pb-4 border-b border-gray-100">Card 2</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  {...register('card2Title')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  {...register('card2Description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCard2Image(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#3CCFBD]/10 file:text-[#3CCFBD] hover:file:bg-[#3CCFBD]/20 transition-all cursor-pointer"
              />
              <ImagePreview currentUrl={data?.data?.card2Image} newFile={card2Image} />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 pb-4 border-b border-gray-100">Card 3</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  {...register('card3Title')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  {...register('card3Description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CCFBD]/20 focus:border-[#3CCFBD] transition-all resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCard3Image(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#3CCFBD]/10 file:text-[#3CCFBD] hover:file:bg-[#3CCFBD]/20 transition-all cursor-pointer"
              />
              <ImagePreview currentUrl={data?.data?.card3Image} newFile={card3Image} />
            </div>
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

export default SeeTheMagicCMS;

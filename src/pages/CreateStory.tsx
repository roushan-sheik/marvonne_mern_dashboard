import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreateStoryMutation } from '../store/apiSlice';
import { Wand2, Loader2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const createStorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  age_group: z.string().min(1, 'Age group is required'),
  page_count: z.number().min(1, 'Must have at least 1 page').max(20, 'Max 20 pages'),
});

type CreateStoryForm = z.infer<typeof createStorySchema>;

export default function CreateStory() {
  const navigate = useNavigate();
  const [createStory, { isLoading }] = useCreateStoryMutation();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStoryForm>({
    resolver: zodResolver(createStorySchema),
    defaultValues: {
      page_count: 5,
    },
  });

  const onSubmit = async (data: CreateStoryForm) => {
    try {
      setErrorMsg('');
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('age_group', data.age_group);
      formData.append('page_count', data.page_count.toString());
      formData.append('create_with_ai', 'true');

      await createStory(formData).unwrap();
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Failed to create story');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <Link to="/" className="mr-4 p-2.5 text-gray-400 hover:text-[#0d9488] hover:bg-[#0d9488]/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center tracking-tight">
              <Wand2 className="w-8 h-8 text-[#0d9488] mr-3" />
              Generate Magic Story
            </h1>
            <p className="text-gray-500 mt-1.5 text-lg">Let AI craft a beautiful children's book for you.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#bef264]/20 rounded-full blur-3xl pointer-events-none"></div>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-8 relative z-10 min-h-[400px]">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0d9488] to-[#bef264] rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative shadow-2xl border-4 border-[#e8f7ec]">
                <Wand2 className="w-10 h-10 text-[#0d9488] animate-bounce" />
              </div>
            </div>
            
            <div className="space-y-4 w-full max-w-md flex flex-col items-center animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded-full overflow-hidden relative">
                 <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded-full"></div>
              <div className="h-4 w-5/6 bg-gray-100 rounded-full"></div>
              <div className="h-4 w-3/4 bg-gray-100 rounded-full"></div>
            </div>

            <div className="text-center mt-6">
              <h3 className="text-2xl font-extrabold text-[#0a192f] bg-clip-text text-transparent bg-gradient-to-r from-[#0d9488] to-[#0a192f] animate-pulse mb-2">
                Sprinkling Magic Dust...
              </h3>
              <p className="text-gray-500 font-medium text-lg">AI is writing and illustrating your story.</p>
              <p className="text-gray-400 text-sm mt-1">This might take a minute.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl border border-red-100 font-medium">
                {errorMsg}
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-base font-bold text-gray-900 mb-2">
                Rough Title
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. A boy in the forest"
                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0d9488]/20 focus:border-[#0d9488] outline-none transition-all bg-white text-lg"
              />
              {errors.title && <p className="mt-2 text-sm text-red-500 font-medium">{errors.title.message}</p>}
              <p className="mt-2 text-sm text-gray-500 flex items-center">
                <Wand2 className="w-4 h-4 mr-1 text-[#0d9488]" /> AI will magically enhance your title!
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-base font-bold text-gray-900 mb-2">
                Story Idea / Description
              </label>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="e.g. There is a cat and a dog in the forest..."
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0d9488]/20 focus:border-[#0d9488] outline-none transition-all resize-none bg-white text-lg"
              />
              {errors.description && <p className="mt-2 text-sm text-red-500 font-medium">{errors.description.message}</p>}
              <p className="mt-2 text-sm text-gray-500 flex items-center">
                <Wand2 className="w-4 h-4 mr-1 text-[#0d9488]" /> AI will expand this into a full story description.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <label className="block text-base font-bold text-gray-900 mb-2">
                  Age Group
                </label>
                <select
                  {...register('age_group')}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0d9488]/20 focus:border-[#0d9488] outline-none bg-white text-lg cursor-pointer"
                >
                  <option value="">Select age group</option>
                  <option value="0-3">0-3 years</option>
                  <option value="3-7">3-7 years</option>
                  <option value="8-12">8-12 years</option>
                </select>
                {errors.age_group && <p className="mt-2 text-sm text-red-500 font-medium">{errors.age_group.message}</p>}
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <label className="block text-base font-bold text-gray-900 mb-2">
                  Number of Pages
                </label>
                <input
                  type="number"
                  {...register('page_count', { valueAsNumber: true })}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0d9488]/20 focus:border-[#0d9488] outline-none bg-white text-lg"
                />
                {errors.page_count && <p className="mt-2 text-sm text-red-500 font-medium">{errors.page_count.message}</p>}
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto flex items-center justify-center px-8 py-4 bg-[#bef264] text-[#0a192f] rounded-full font-extrabold text-lg hover:bg-[#a3e635] focus:ring-4 focus:ring-[#bef264]/30 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <Wand2 className="w-6 h-6 mr-3" />
                Generate Magic Story
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

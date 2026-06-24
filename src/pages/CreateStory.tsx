import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useGetSettingsQuery, useCreateStoryMutation, useGetStoryStatusQuery } from '../store/apiSlice';
import { Wand2, Loader2, ArrowLeft, Brain } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CreateStory() {
  const navigate = useNavigate();
  const [createStory, { isLoading: isCreating }] = useCreateStoryMutation();
  const { data: settingsResponse } = useGetSettingsQuery({});
  const maxPages = settingsResponse?.data?.max_pages || 20;

  const [errorMsg, setErrorMsg] = useState('');
  const [pollingStoryId, setPollingStoryId] = useState<string | null>(() => {
    return sessionStorage.getItem('pollingStoryId');
  });

  useEffect(() => {
    if (pollingStoryId) {
      sessionStorage.setItem('pollingStoryId', pollingStoryId);
    } else {
      sessionStorage.removeItem('pollingStoryId');
    }
  }, [pollingStoryId]);

  const { data: statusData } = useGetStoryStatusQuery(pollingStoryId, {
    skip: !pollingStoryId,
    pollingInterval: 3000,
  });

  const storyStatus = statusData?.data;
  const isLoading = isCreating || pollingStoryId !== null;

  useEffect(() => {
    if (storyStatus) {
      if (storyStatus.status === 'COMPLETED') {
        sessionStorage.removeItem('pollingStoryId');
        navigate('/');
      } else if (storyStatus.status === 'FAILED') {
        sessionStorage.removeItem('pollingStoryId');
        setErrorMsg(storyStatus.error_message || 'Failed to generate story');
        setPollingStoryId(null);
      }
    }
  }, [storyStatus, navigate]);

  const createStorySchema = useMemo(() => z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    age_group: z.string().min(1, 'Age group is required'),
    page_count: z.number().min(1, 'Must have at least 1 page').max(maxPages, `Max ${maxPages} pages`),
  }), [maxPages]);

  type CreateStoryForm = z.infer<typeof createStorySchema>;

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

      const res = await createStory(formData).unwrap();
      if (res?.data?.id) {
        setPollingStoryId(res.data.id);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      let msg = err?.data?.message || err?.message || 'Failed to create story';

      // Try to parse if the backend returns stringified JSON (like Gemini errors)
      try {
        if (typeof msg === 'string' && msg.trim().startsWith('{')) {
          const parsed = JSON.parse(msg);
          if (parsed?.error?.message) {
            msg = parsed.error.message;
          } else if (parsed?.message) {
            msg = parsed.message;
          }
        }
      } catch (e) {
        // Ignore parse error, just use the raw string
      }

      setErrorMsg(msg);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] md:h-screen -m-4 sm:-m-6 md:-m-10 p-4 md:p-8 flex flex-col overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto overflow-hidden relative z-10">

        {/* Header - Compact */}
        <div className="shrink-0 flex items-center justify-between mb-6 bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-white">
          <div className="flex items-center">
            <Link to="/" className="mr-4 p-2.5 bg-white text-gray-500 hover:text-indigo-600 shadow-sm hover:shadow rounded-full transition-all border border-gray-100">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 flex items-center tracking-tight">
                <Wand2 className="w-5 h-5 text-indigo-600 mr-2" />
                Generate Magic Story
              </h1>
              <p className="text-gray-500 text-xs mt-0.5">Let AI craft a beautiful children's book.</p>
            </div>
          </div>
        </div>

        {/* Main Content Area - Scrollable but fits in screen */}
        <div className="flex-1 overflow-y-auto hide-scrollbar bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 relative">

          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 relative z-10 min-h-[400px]">
              {/* Premium AI Spinner */}
              <div className="relative flex justify-center items-center w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center justify-center hover:scale-105 transition-transform duration-500">
                  <Brain className="w-10 h-10 text-indigo-600 animate-pulse" />
                </div>
              </div>

              <div className="w-full max-w-sm space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 shrink-0 bg-indigo-50/80 rounded-2xl animate-pulse flex items-center justify-center">
                    <div className="w-5 h-5 bg-indigo-200 rounded-md"></div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full w-full bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full w-5/6 bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite_0.3s]"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 shrink-0 bg-purple-50/80 rounded-2xl animate-pulse flex items-center justify-center">
                    <div className="w-5 h-5 bg-purple-200 rounded-md"></div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full w-11/12 bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite_0.6s]"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full w-4/6 bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite_0.9s]"></div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-10">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight mb-2">
                  {storyStatus ? `Generating... ${storyStatus.progress}%` : 'Starting...'}
                </h3>
                <p className="text-gray-500 text-sm md:text-base font-medium">
                  {storyStatus?.status === 'PROCESSING_TEXT' && "Writing the magical story text..."}
                  {storyStatus?.status === 'PROCESSING_IMAGES' && "Crafting beautiful illustrations..."}
                  {!storyStatus && "Initializing..."}
                </p>
                {/* Progress bar */}
                {storyStatus && (
                  <div className="w-full max-w-sm mx-auto mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                      style={{ width: `${storyStatus.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10 flex flex-col h-full">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 font-medium shrink-0 flex items-start shadow-sm">
                  <div className="mr-3 mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                  {errorMsg}
                </div>
              )}

              <div className="shrink-0 group">
                <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                  Rough Title
                </label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="e.g. A boy in the forest"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-gray-300 outline-none transition-all text-sm shadow-sm"
                />
                {errors.title && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.title.message}</p>}
              </div>

              <div className="shrink-0 group">
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-bold text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                    Story Idea / Description
                  </label>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 flex items-center bg-indigo-50 px-2 py-0.5 rounded-full">
                    <Brain className="w-3 h-3 mr-1" /> AI Powered
                  </span>
                </div>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="e.g. There is a cat and a dog in the forest..."
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-gray-300 outline-none transition-all resize-none text-sm shadow-sm"
                />
                {errors.description && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-5 shrink-0">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                    Age Group
                  </label>
                  <select
                    {...register('age_group')}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-gray-300 outline-none transition-all text-sm shadow-sm cursor-pointer appearance-none"
                  >
                    <option value="">Select age group</option>
                    <option value="0-3">0-3 years</option>
                    <option value="3-7">3-7 years</option>
                    <option value="8-12">8-12 years</option>
                  </select>
                  {errors.age_group && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.age_group.message}</p>}
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                    Pages
                  </label>
                  <input
                    type="number"
                    {...register('page_count', { valueAsNumber: true })}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-gray-300 outline-none transition-all text-sm shadow-sm"
                  />
                  {errors.page_count && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.page_count.message}</p>}
                </div>
              </div>

              {/* Submit button anchored at the bottom */}
              <div className="mt-auto pt-4 flex justify-end shrink-0 border-t border-gray-50">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <Brain className="w-4 h-4 mr-2 text-indigo-400" />
                  Generate Magic Story
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

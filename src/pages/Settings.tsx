import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Settings as SettingsIcon, Save, Loader2, BookOpen, Layers } from 'lucide-react';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../store/apiSlice';

const settingsSchema = z.object({
  min_words_per_page: z.number().min(1, 'Minimum words must be at least 1'),
  max_words_per_page: z.number().min(1, 'Maximum words must be at least 1'),
  max_pages: z.number().min(1, 'Maximum pages must be at least 1'),
}).refine(data => data.min_words_per_page <= data.max_words_per_page, {
  message: "Min words cannot be greater than max words",
  path: ["min_words_per_page"]
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function Settings() {
  const { data: settingsResponse, isLoading: isFetching } = useGetSettingsQuery({});
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (settingsResponse?.data) {
      reset({
        min_words_per_page: settingsResponse.data.min_words_per_page,
        max_words_per_page: settingsResponse.data.max_words_per_page,
        max_pages: settingsResponse.data.max_pages,
      });
    }
  }, [settingsResponse, reset]);

  const onSubmit = async (data: SettingsForm) => {
    try {
      await updateSettings(data).unwrap();
      // Optional: show a success toast here
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-8 flex items-center">
        <div className="mr-4 rounded-xl bg-indigo-100 p-3">
          <SettingsIcon className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-sm text-gray-500">Configure global parameters for AI generation and platform limits.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h2 className="font-semibold text-gray-900">Story Generation Rules</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Word Limits Section */}
            <div className="space-y-5">
              <div className="flex items-center text-sm font-medium text-gray-900">
                <BookOpen className="mr-2 h-4 w-4 text-indigo-500" />
                Page Content Limits
              </div>
              
              <div>
                <label className="mb-1 block text-sm text-gray-700">Minimum Words Per Page</label>
                <input
                  type="number"
                  {...register('min_words_per_page', { valueAsNumber: true })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                {errors.min_words_per_page && (
                  <p className="mt-1 text-xs font-medium text-red-500">{errors.min_words_per_page.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-700">Maximum Words Per Page</label>
                <input
                  type="number"
                  {...register('max_words_per_page', { valueAsNumber: true })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                {errors.max_words_per_page && (
                  <p className="mt-1 text-xs font-medium text-red-500">{errors.max_words_per_page.message}</p>
                )}
              </div>
            </div>

            {/* Page Limits Section */}
            <div className="space-y-5">
              <div className="flex items-center text-sm font-medium text-gray-900">
                <Layers className="mr-2 h-4 w-4 text-indigo-500" />
                Book Length Limits
              </div>
              
              <div>
                <label className="mb-1 block text-sm text-gray-700">Maximum Pages Allowed</label>
                <input
                  type="number"
                  {...register('max_pages', { valueAsNumber: true })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                {errors.max_pages && (
                  <p className="mt-1 text-xs font-medium text-red-500">{errors.max_pages.message}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">This controls the max limit available when creating a new story.</p>
              </div>
            </div>
            
          </div>

          <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={!isDirty || isUpdating}
              className="flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Story', 'Auth', 'Settings', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['User'],
    }),
    getAllStories: builder.query({
      query: ({ page = 1, limit = 9 } = {}) => `/story/all-stories?page=${page}&limit=${limit}`,
      providesTags: ['Story'],
    }),
    previewStory: builder.query({
      query: (id) => `/story/preview-story/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Story', id }],
    }),
    createStory: builder.mutation({
      query: (formData) => ({
        url: '/story/create-story',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Story'],
    }),
    regeneratePageIllustration: builder.mutation({
      query: (pageId) => ({
        url: `/story/page/${pageId}/regenerate-image`,
        method: 'POST',
      }),
      invalidatesTags: ['Story'],
    }),
    regenerateCoverImage: builder.mutation({
      query: (storyId) => ({
        url: `/story/update-story/${storyId}/regenerate-cover`,
        method: 'PUT',
      }),
      invalidatesTags: ['Story'],
    }),
    deleteStory: builder.mutation({
      query: (storyId) => ({
        url: `/story/delete-story/${storyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Story'],
    }),
    getSettings: builder.query({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation({
      query: (settingsData) => ({
        url: '/settings',
        method: 'PUT',
        body: settingsData,
      }),
      invalidatesTags: ['Settings'],
    }),
    getStoryStatus: builder.query({
      query: (id) => `/story/status/${id}`,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useGetAllStoriesQuery,
  usePreviewStoryQuery,
  useCreateStoryMutation,
  useRegeneratePageIllustrationMutation,
  useRegenerateCoverImageMutation,
  useDeleteStoryMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetStoryStatusQuery,
} = apiSlice;

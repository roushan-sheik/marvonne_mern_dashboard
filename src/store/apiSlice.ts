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
  tagTypes: ['Story', 'Auth'],
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
    getAllStories: builder.query({
      query: () => '/story/all-stories',
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
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetAllStoriesQuery,
  usePreviewStoryQuery,
  useCreateStoryMutation,
} = apiSlice;

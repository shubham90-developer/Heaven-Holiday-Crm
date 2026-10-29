import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const themeApi = createApi({
    reducerPath: "themeApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/settings/themes`,
    }),
    tagTypes: ["Theme"],
    endpoints: (builder) => ({
        getThemes: builder.query({
            query: (params) => ({
                url: "/",
                params: params || {},
            }),
            providesTags: ["Theme"],
        }),

        getThemeById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Theme", id }],
        }),

        createTheme: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Theme"],
        }),

        updateTheme: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Theme"],
        }),

        deleteTheme: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Theme"],
        }),
    }),
});

export const {
    useGetThemesQuery,
    useGetThemeByIdQuery,
    useCreateThemeMutation,
    useUpdateThemeMutation,
    useDeleteThemeMutation,
} = themeApi;

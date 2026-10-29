import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const guideApi = createApi({
    reducerPath: "guideApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/inventory/vehicle`,
    }),
    tagTypes: ["Guide"],

    endpoints: (builder) => ({

        // GET ALL GUIDES
        getGuides: builder.query({
            query: (params) => ({
                url: "/guide",
                params,
            }),

            // ensures refetch when filters change
            serializeQueryArgs: ({ queryArgs }) => {
                return JSON.stringify(queryArgs);
            },

            providesTags: ["Guide"],

        }),

        // GET BY ID
        getGuideById: builder.query({
            query: (id) => `/guide/${id}`,
            providesTags: ["Guide"],
        }),

        // CREATE GUIDE
        createGuide: builder.mutation({
            query: (newGuide) => ({
                url: "/guide",
                method: "POST",
                body: newGuide,
            }),
            invalidatesTags: ["Guide"],
        }),

        // UPDATE GUIDE
        updateGuide: builder.mutation({
            query: ({ id, data }) => ({
                url: `/guide/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Guide"],
        }),

        // DELETE GUIDE
        deleteGuide: builder.mutation({
            query: (id) => ({
                url: `/guide/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Guide"],
        }),

    }),
});

export const {
    useGetGuidesQuery,
    useGetGuideByIdQuery,
    useCreateGuideMutation,
    useUpdateGuideMutation,
    useDeleteGuideMutation,
} = guideApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const sightseeingApi = createApi({
    reducerPath: "sightseeingApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/inventory/sightseeing`,
    }),

    tagTypes: ["Sightseeing"],

    endpoints: (builder) => ({
        // Create
        createSightseeing: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Sightseeing"],
        }),

        // Get all
        getSightseeing: builder.query({
            query: (params) => ({
                url: "/",
                params,
            }),

            // THIS FIXES REFRESH ISSUE
            serializeQueryArgs: ({ queryArgs }) => {
                return JSON.stringify(queryArgs);
            },
            providesTags: ["Sightseeing"],
        }),

        // Get by ID
        getSightseeingById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["Sightseeing"],
        }),

        // Update
        updateSightseeing: builder.mutation({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Sightseeing"],
        }),

        // Delete
        deleteSightseeing: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Sightseeing"],
        }),
    }),
});

export const {
    useCreateSightseeingMutation,
    useGetSightseeingQuery,
    useGetSightseeingByIdQuery,
    useUpdateSightseeingMutation,
    useDeleteSightseeingMutation,
} = sightseeingApi;
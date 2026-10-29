import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const inclusionApi = createApi({
    reducerPath: "inclusionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/settings/inclusions`,
    }),
    tagTypes: ["Inclusion"],
    endpoints: (builder) => ({
        getInclusions: builder.query({
            query: (params) => ({
                url: "/",
                params: params || {},
            }),
            providesTags: ["Inclusion"],
        }),

        getInclusionById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Inclusion", id }],
        }),

        createInclusion: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Inclusion"],
        }),

        updateInclusion: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Inclusion"],
        }),

        deleteInclusion: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Inclusion"],
        }),
    }),
});

export const {
    useGetInclusionsQuery,
    useGetInclusionByIdQuery,
    useCreateInclusionMutation,
    useUpdateInclusionMutation,
    useDeleteInclusionMutation,
} = inclusionApi;

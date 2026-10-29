import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const visaApi = createApi({
    reducerPath: "visaApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/inventory/visa`, // same as your backend base
    }),
    tagTypes: ["Visa"],
    endpoints: (builder) => ({

        // GET ALL VISAS
        getVisas: builder.query({
            query: (params) => ({
                url: "/",
                params,
            }),

            // THIS FIXES REFRESH ISSUE
            serializeQueryArgs: ({ queryArgs }) => {
                return JSON.stringify(queryArgs);
            },

            providesTags: ["Visa"],
        }),

        // GET VISA BY ID
        getVisaById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["Visa"],
        }),

        // CREATE VISA
        createVisa: builder.mutation({
            query: (newVisa) => ({
                url: "/",
                method: "POST",
                body: newVisa,
            }),
            invalidatesTags: ["Visa"],
        }),

        // UPDATE VISA
        updateVisa: builder.mutation({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Visa"],
        }),

        // DELETE VISA
        deleteVisa: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Visa"],
        }),

    }),
});

// EXPORT HOOKS
export const {
    useGetVisasQuery,
    useGetVisaByIdQuery,
    useCreateVisaMutation,
    useUpdateVisaMutation,
    useDeleteVisaMutation,
} = visaApi;
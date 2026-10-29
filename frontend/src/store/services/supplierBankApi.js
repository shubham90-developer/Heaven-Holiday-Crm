// supplierBankApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const supplierBankApi = createApi({
    reducerPath: "supplierBankApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api/supplier-bank` }),
    tagTypes: ["Banks"],
    endpoints: (builder) => ({
        // GET all banks
        getBanks: builder.query({
            query: () => "/",
            providesTags: ["Banks"],
        }),

        // GET bank by id
        getBankById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["Banks"],
        }),

        // CREATE new bank
        createBank: builder.mutation({
            query: (bankData) => ({
                url: "/",
                method: "POST",
                body: bankData,
            }),
            invalidatesTags: ["Banks"],
        }),

        // UPDATE bank by id
        updateBank: builder.mutation({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Banks"],
        }),

        // DELETE bank by id
        deleteBank: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Banks"],
        }),
    }),
});

// Export hooks for usage in React components
export const {
    useGetBanksQuery,
    useGetBankByIdQuery,
    useCreateBankMutation,
    useUpdateBankMutation,
    useDeleteBankMutation,
} = supplierBankApi;
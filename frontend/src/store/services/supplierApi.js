// store/services/supplierApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const supplierApi = createApi({
    reducerPath: "supplierApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api` }),
    tagTypes: ["Supplier"],
    endpoints: (builder) => ({

        // GET all suppliers
        getSuppliers: builder.query({
            query: () => "/supplier",
            providesTags: ["Supplier"],
        }),

        // GET supplier by ID
        getSupplierById: builder.query({
            query: (id) => `/supplier/${id}`,
            providesTags: (result, error, id) => [{ type: "Supplier", id }],
        }),

        // POST create supplier
        createSupplier: builder.mutation({
            query: (body) => ({
                url: "/supplier",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Supplier"],
        }),

        createQuickSupplier: builder.mutation({
            query: (body) => ({
                url: "/supplier/quick",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Supplier"],
        }),

        // PUT update supplier
        updateSupplier: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/supplier/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Supplier"],
        }),

        // DELETE supplier (soft delete)
        deleteSupplier: builder.mutation({
            query: (id) => ({
                url: `/supplier/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Supplier"],
        }),
    }),
});

export const {
    useGetSuppliersQuery,
    useGetSupplierByIdQuery,
    useCreateSupplierMutation,
    useCreateQuickSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation,
} = supplierApi;
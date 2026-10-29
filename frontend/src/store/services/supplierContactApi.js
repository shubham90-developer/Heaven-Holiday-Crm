import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const supplierContactApi = createApi({
    reducerPath: "supplierContactApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/supplier-contact`, // your backend URL
    }),
    tagTypes: ["SupplierContact"],
    endpoints: (builder) => ({
        // GET all contacts
        getContacts: builder.query({
            query: () => "/",
            providesTags: ["SupplierContact"],
        }),

        // GET contacts by supplier ID
        getContactsBySupplier: builder.query({
            query: (supplierId) => `/${supplierId}`,
            providesTags: ["SupplierContact"],
        }),

        // CREATE a new contact
        createContact: builder.mutation({
            query: (contact) => ({
                url: "/",
                method: "POST",
                body: contact,
            }),
            invalidatesTags: ["SupplierContact"],
        }),
    }),
});

export const {
    useGetContactsQuery,
    useGetContactsBySupplierQuery,
    useCreateContactMutation,
} = supplierContactApi;
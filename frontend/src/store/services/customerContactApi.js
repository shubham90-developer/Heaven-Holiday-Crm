// contactsApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const contactsApi = createApi({
    reducerPath: "contactsApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/query/customer-contact`,
    }),

    tagTypes: ["Contacts"],

    endpoints: (builder) => ({

        // CREATE CONTACT
        createContact: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),

            invalidatesTags: ["Contacts"],
        }),


        // GET ALL CONTACTS OF LEAD
        getLeadContacts: builder.query({
            query: (leadId) => `/${leadId}`,

            providesTags: ["Contacts"],
        }),


        // GET SINGLE CONTACT
        getSingleContact: builder.query({
            query: (contactId) => `/${contactId}`,

            providesTags: ["Contacts"],
        }),


        // UPDATE CONTACT
        updateContact: builder.mutation({
            query: ({ contactId, body }) => ({
                url: `/${contactId}`,
                method: "PUT",
                body,
            }),

            invalidatesTags: ["Contacts"],
        }),


        // DELETE CONTACT
        deleteContact: builder.mutation({
            query: (contactId) => ({
                url: `/${contactId}`,
                method: "DELETE",
            }),

            invalidatesTags: ["Contacts"],
        }),
        
    }),
});

export const {
    useCreateContactMutation,
    useGetLeadContactsQuery,
    useGetSingleContactQuery,
    useUpdateContactMutation,
    useDeleteContactMutation,
} = contactsApi;
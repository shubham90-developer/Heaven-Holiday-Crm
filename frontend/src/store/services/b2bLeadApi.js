// store/services/b2bLeadApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const b2bLeadApi = createApi({
    reducerPath: "b2bLeadApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api` }),
    tagTypes: ["B2BLead"],
    endpoints: (builder) => ({

        // GET all B2B leads
        getB2BLeads: builder.query({
            query: () => "/b2b-leads",
            providesTags: ["B2BLead"],
        }),

        // POST create B2B lead
        createB2BLead: builder.mutation({
            query: (body) => ({
                url: "/b2b-leads",
                method: "POST",
                body,
            }),
            invalidatesTags: ["B2BLead"],
        }),

        // POST for b2b bulk upload
        bulkUploadB2BLeads: builder.mutation({
            query: (formData) => ({
                url: "/b2b-leads/bulk-upload",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["B2BLead"],
        }),

        // GET filtered B2B leads
        filterB2BLeads: builder.query({
            query: (filters) => {
                // Convert filters object into query string
                const params = new URLSearchParams();
                for (const key in filters) {
                    if (filters[key]) params.append(key, filters[key]);
                }
                return `/b2b-leads/filter?${params.toString()}`;
            },
            providesTags: ["B2BLead"],
        }),

        // PUT full update
        updateB2BLead: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/b2b-leads/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["B2BLead"],
        }),

        // PATCH partial update
        patchB2BLead: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/b2b-leads/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["B2BLead"],
        }),

        // PATCH assign B2C leads to staff
        assignB2BLeads: builder.mutation({
            query: (body) => ({
                url: "/b2b-leads/assign-b2b",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["B2BLead"],
        }),

        // DELETE soft delete
        deleteB2BLead: builder.mutation({
            query: (id) => ({
                url: `/b2b-leads/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["B2BLead"],
        }),
    }),
});

export const {
    useGetB2BLeadsQuery,
    useFilterB2BLeadsQuery,
    useCreateB2BLeadMutation,
    useUpdateB2BLeadMutation,
    usePatchB2BLeadMutation,
    useDeleteB2BLeadMutation,
    useBulkUploadB2BLeadsMutation,
    useAssignB2BLeadsMutation,
} = b2bLeadApi;
// store/services/b2cLeadApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const b2cLeadApi = createApi({
    reducerPath: "b2cLeadApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api` }),
    tagTypes: ["B2CLead"],
    endpoints: (builder) => ({

        // GET all B2C leads
        getB2CLeads: builder.query({
            query: () => "/b2c-leads",
            providesTags: ["B2CLead"],
        }),

        // GET B2C lead by ID
        getB2CLeadById: builder.query({
            query: (id) => `/b2c-leads/${id}`,
            providesTags: ["B2CLead"],
        }),

        // POST create B2C lead
        createB2CLead: builder.mutation({
            query: (body) => ({
                url: "/b2c-leads",
                method: "POST",
                body,
            }),
            invalidatesTags: ["B2CLead"], // ✅ auto refetch list after create
        }),

        bulkUploadB2CLeads: builder.mutation({
            query: (formData) => ({
                url: "/b2c-leads/bulk-upload",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["B2CLead"], // refresh list after upload
        }),

        // FILTER B2C leads (NEW)
        filterB2CLeads: builder.query({
            query: (params) => ({
                url: "/b2c-leads/filter",
                method: "GET",
                params, // automatically converts to query string
            }),
            providesTags: ["B2CLead"],
        }),

        // PUT update B2C lead
        updateB2CLead: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/b2c-leads/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["B2CLead"],
        }),

        // PATCH partial update
        patchB2CLead: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/b2c-leads/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["B2CLead"],
        }),

        // PATCH assign B2C leads to staff
        assignB2CLeads: builder.mutation({
            query: (body) => ({
                url: "/b2c-leads/assign-b2c",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["B2CLead"],
        }),

        // DELETE (soft delete)
        deleteB2CLead: builder.mutation({
            query: (id) => ({
                url: `/b2c-leads/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["B2CLead"],
        }),
    }),
});

export const {
    useGetB2CLeadsQuery,
    useGetB2CLeadByIdQuery,
    useFilterB2CLeadsQuery,
    useCreateB2CLeadMutation,
    useUpdateB2CLeadMutation,
    usePatchB2CLeadMutation,
    useDeleteB2CLeadMutation,
    useBulkUploadB2CLeadsMutation,
    useAssignB2CLeadsMutation,
} = b2cLeadApi;
// store/services/leadsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const leadsApi = createApi({
    reducerPath: "leadsApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api` }),
    tagTypes: [
        "B2CLead",
        "B2BLead",
        "Leads"
    ],
    endpoints: (builder) => ({

        filterLeads: builder.query({
            query: (filters) => ({
                url: "/leads/filter",
                params: filters, // ✅ correct place
            }),
            providesTags: ["Leads"],
        }),

        // GET leads by tab (callback | inprocess | overall)
        getLeadsByTab: builder.query({
            query: (tab) => ({
                url: "/leads/tab",
                params: tab ? { tab } : {},
            }),
            providesTags: ["Leads"],
        }),

        getArchivedLeads: builder.query({
            query: () => ({
                url: "/leads/archived",
            }),
            providesTags: ["Leads"],
        }),

        getUnassignedLeads: builder.query({
            query: () => ({
                url: "/leads/unassigned",
            }),
            providesTags: ["Leads"],
        }),

        assignLeads: builder.mutation({
            query: (body) => ({
                url: "/leads/assign",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Leads"],
        }),

        archiveLeads: builder.mutation({
            query: (body) => ({
                url: "/leads/archive-leads",
                method: "PATCH",
                body,                       // { leadIds: string[] }
            }),
            invalidatesTags: ["B2CLead"],   // refetches all lead queries automatically
        }),

        getLeadById: builder.query({
            query: (id) => `/leads/${id}`,

            transformResponse: (response) => {
                return response?.data;
            },

            providesTags: (result, error, id) => [
                { type: "Leads", id },
            ],

            keepUnusedDataFor: 0,
        }),

    }),
});

export const {
    useFilterLeadsQuery,
    useGetLeadsByTabQuery,
    useGetArchivedLeadsQuery,
    useGetUnassignedLeadsQuery,
    useAssignLeadsMutation,
    useArchiveLeadsMutation,
    useGetLeadByIdQuery
} = leadsApi;
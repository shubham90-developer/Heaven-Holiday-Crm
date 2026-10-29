// src/redux/api/queryApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BASE_URL = `${API_URL}/v1/api/query`;

export const queryApi = createApi({
    reducerPath: "queryApi",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["Query"],
    endpoints: (builder) => ({
        // Create a query
        createQuery: builder.mutation({
            query: ({ leadId, data }) => ({
                url: `/`,
                method: "POST",  // was missing
                params: { leadId },
                body: data,      // was missing
            }),
            invalidatesTags: ["Query"],
        }),

        // Get all queries with optional filters + pagination (infinite scroll)
        getAllQueries: builder.query({
            query: ({ page = 1, limit = 10, ...params } = {}) => ({
                url: "/",
                method: "GET",
                params: { page, limit, ...params },
            }),
            // Keep one cache entry per filter set (ignore page so pages merge)
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                const { page, ...rest } = queryArgs || {};
                return `${endpointName}-${JSON.stringify(rest)}`;
            },
            merge: (currentCache, newItems, { arg }) => {
                const page = arg?.page ?? newItems?.page ?? 1;
                const limit = newItems?.limit ?? arg?.limit ?? 10;

                // First page always replaces the list
                if (page <= 1) {
                    return newItems;
                }

                const prevData = currentCache?.data ?? [];
                const keep = prevData.slice(0, (page - 1) * limit);

                return {
                    ...newItems,
                    data: [...keep, ...(newItems.data ?? [])],
                };
            },
            forceRefetch: ({ currentArg, previousArg }) =>
                currentArg?.page !== previousArg?.page,
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: "Query", id: _id })),
                        { type: "Query", id: "LIST" },
                    ]
                    : [{ type: "Query", id: "LIST" }],
        }),

        // Get query by ID
        getQueryById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Query", id }],
        }),

        // Delete query by ID
        deleteQueryById: builder.mutation({
            query: (id) => ({
                url: `/?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Query"],
        }),

        updateQueryStage: builder.mutation({
            query: ({ queryId, stage }) => ({
                url: `/${queryId}`,
                method: "PATCH",
                body: { stage },
            }),
            invalidatesTags: (result, error, { queryId }) => [
                { type: "Query", id: queryId },
                { type: "Query", id: "LIST" },
            ],
        }),

        getConfirmedQueries: builder.query({
            query: () => "/confirmed",
            transformResponse: (response) => {
                console.log("API RESPONSE:", response);
                return Array.isArray(response) ? response : response?.data ?? [];
            },
            providesTags: [{ type: "Query", id: "CONFIRMED" }],
        }),

        // ── callback queries ──────────────────────────────────────────────
        getCallbackQueries: builder.query({
            query: () => "/callback",
            transformResponse: (response) => response?.data ?? [],
            providesTags: [{ type: "Query", id: "CALLBACK" }],
        }),

        // ── in process queries ────────────────────────────────────────────
        getInProcessQueries: builder.query({
            query: () => "/in-process",
            transformResponse: (response) => response?.data ?? [],
            providesTags: [{ type: "Query", id: "IN_PROCESS" }],
        }),

        // ── unassigned queries ────────────────────────────────────────────
        getUnassignedQueries: builder.query({
            query: () => "/unassigned",
            transformResponse: (response) => response?.data ?? [],
            providesTags: [{ type: "Query", id: "UNASSIGNED" }],
        }),

        // ── rejected queries ──────────────────────────────────────────────
        getRejectedQueries: builder.query({
            query: () => "/rejected",
            transformResponse: (response) => response?.data ?? [],
            providesTags: [{ type: "Query", id: "REJECTED" }],
        }),

        // ── recent queries (last 24 hours) ────────────────────────────────
        getRecentQueries: builder.query({
            query: () => "/recent-queries",
            transformResponse: (response) => response?.data ?? [],
            providesTags: [{ type: "Query", id: "RECENT" }],
        }),

        getWipPackagesQueries: builder.query({
            query: () => "/wip-packages",
            transformResponse: (response) => response?.data ?? [],
            providesTags: [{ type: "Query", id: "WIP_PACKAGES" }],
        }),

        getQueryStatusReport: builder.query({
            query: (params) => ({
                url: "/report", // 👈 make sure your backend route matches this
                method: "GET",
                params, // { startDate, endDate }
            }),
            transformResponse: (response) => response?.data ?? {},
            providesTags: [{ type: "Query", id: "REPORT" }],
        }),

        getQueriesByLeadId: builder.query({
            query: (leadId) => ({
                url: `/lead/${leadId}`,
                method: "GET",
            }),

            transformResponse: (response) =>
                response?.data ?? [],

            providesTags: ["Query"],
        }),

        // Get recent queries (last 24h) for a given lead
        getRecentQueriesByLeadId: builder.query({
            query: (leadId) => ({
                url: `/recent/${leadId}`,
                method: "GET",
            }),
            transformResponse: (response) => response?.data ?? [],
            providesTags: (result, error, leadId) => [
                { type: "Query", id: `RECENT_${leadId}` },
            ],
        }),

        assignQueries: builder.mutation({
            query: (body) => ({
                url: "/assign",
                method: "PATCH",
                body,                   // { queryIds: string[], staffId: string }
            }),
            invalidatesTags: [
                { type: "Query", id: "LIST" },
                { type: "Query", id: "CONFIRMED" },
            ],
        }),

        bulkUpdateQueries: builder.mutation({
            query: (body) => ({
                url: "/bulk",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Query"],
        }),

        exportQueries: builder.query({
            query: (params = {}) => ({
                url: "/export",
                method: "GET",
                params,
            }),
        }),
    }),
});

export const {
    useCreateQueryMutation,
    useGetAllQueriesQuery,
    useGetQueryByIdQuery,
    useDeleteQueryByIdMutation,
    useUpdateQueryStageMutation,
    useGetConfirmedQueriesQuery,
    useGetCallbackQueriesQuery,       
    useGetInProcessQueriesQuery,      
    useGetUnassignedQueriesQuery,     
    useGetRejectedQueriesQuery,       
    useGetRecentQueriesQuery,
    useGetWipPackagesQueriesQuery,
    useGetQueryStatusReportQuery,
    useGetQueriesByLeadIdQuery,
    useGetRecentQueriesByLeadIdQuery,
    useAssignQueriesMutation,
    useBulkUpdateQueriesMutation,
    useLazyExportQueriesQuery,
} = queryApi;
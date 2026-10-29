import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const leadSourceApi = createApi({
    reducerPath: "leadSourceApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api/settings/lead-source` }),
    tagTypes: ["LeadSource"],
    endpoints: (builder) => ({
        getLeadSources: builder.query({
            query: () => "/",
            providesTags: ["LeadSource"],
        }),

        getLeadSourceById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "LeadSource", id }],
        }),

        createLeadSource: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["LeadSource"],
        }),

        updateLeadSource: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["LeadSource"],
        }),

        deleteLeadSource: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["LeadSource"],
        }),
    }),
});

export const {
    useGetLeadSourcesQuery,
    useGetLeadSourceByIdQuery,
    useCreateLeadSourceMutation,
    useUpdateLeadSourceMutation,
    useDeleteLeadSourceMutation,
} = leadSourceApi;
// src/redux/api/leadExtraInfoApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BASE_URL = `${API_URL}/v1/api/leads-extra-info`;

export const leadsExtraInfoApi = createApi({
    reducerPath: "leadsExtraInfoApi",

    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),

    tagTypes: ["LeadExtraInfo"],

    endpoints: (builder) => ({

        // CREATE / UPSERT LEAD EXTRA INFO
        createOrUpdateLeadExtraInfo: builder.mutation({
            query: ({ data }) => ({    // ✅ destructure the wrapper
                url: `/`,
                method: "POST",
                body: data,            // now sends { leadId, dob, ... } correctly
            }),
            invalidatesTags: (result, error, data) => [
                { type: "LeadExtraInfo", id: data.leadId },
            ],
        }),

        // GET LEAD EXTRA INFO BY LEAD ID
        getLeadExtraInfoByLeadId: builder.query({
            query: (leadId) => ({
                url: `/lead/${leadId}`,  // ✅ GET /lead/:leadId
                method: "GET",
            }),
            transformResponse: (response) => response?.data ?? null,
            providesTags: (result, error, leadId) => [
                { type: "LeadExtraInfo", id: leadId },
            ],
        }),

        // DELETE LEAD EXTRA INFO
        deleteLeadExtraInfo: builder.mutation({
            query: (leadId) => ({
                url: `/${leadId}`,
                method: "DELETE",
            }),

            invalidatesTags: (result, error, leadId) => [
                { type: "LeadExtraInfo", id: leadId },
            ],
        }),

    }),
});

export const {
    useCreateOrUpdateLeadExtraInfoMutation,
    useGetLeadExtraInfoByLeadIdQuery,
    useDeleteLeadExtraInfoMutation,
} = leadsExtraInfoApi;
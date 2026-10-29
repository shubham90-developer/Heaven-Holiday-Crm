// store/services/followUpApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const followUpApi = createApi({
  reducerPath: "followUpApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api/follow-up` }),
  tagTypes: ["FollowUp"],
  endpoints: (builder) => ({

    getAllFollowUps: builder.query({
      query: (params = {}) => ({
        url: "/",
        params,
      }),
      providesTags: [{ type: "FollowUp", id: "ALL" }],
    }),

    // GET single follow-up by ID
    getFollowUpById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["FollowUp"],
    }),

    // POST create follow-up (leadId in params)
    createFollowUp: builder.mutation({
      query: ({ leadId, ...body }) => ({
        url: `/${leadId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "FollowUp",
        { type: "FollowUp", id: "ALL" },
      ],
    }),

    getFollowUpsByLeadId: builder.query({
      query: (leadId) => `/${leadId}`,
      providesTags: (_result, _err, leadId) => [
        { type: "FollowUp", id: leadId },
      ],
    }),

  }),
});

export const {
  useGetAllFollowUpsQuery,
  useGetFollowUpByIdQuery,
  useCreateFollowUpMutation,
  useGetFollowUpsByLeadIdQuery 
} = followUpApi;
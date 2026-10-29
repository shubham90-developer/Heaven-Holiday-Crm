// store/services/messageApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const messageApi = createApi({
    reducerPath: "messageApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api` }),
    tagTypes: ["Message"],
    endpoints: (builder) => ({

        // POST send message
        sendMessage: builder.mutation({
            query: (body) => ({
                url: "/messages",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Message"],
        }),

        // GET messages by leadId
        getMessagesByLead: builder.query({
            query: (leadId) => `/messages/${leadId}`,
            providesTags: ["Message"],
        }),
    }),
});

export const {
    useSendMessageMutation,
    useGetMessagesByLeadQuery,
} = messageApi;
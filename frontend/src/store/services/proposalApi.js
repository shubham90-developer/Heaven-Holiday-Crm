import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const proposalApi = createApi({
    reducerPath: "proposalApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/proposal`,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        generateProposalContent: builder.mutation({
            query: (body) => ({
                url: "/generate-content",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useGenerateProposalContentMutation } = proposalApi;

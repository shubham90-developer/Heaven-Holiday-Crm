import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const proposalImageApi = createApi({
    reducerPath: "proposalImageApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/settings/proposal-images`,
        credentials: "include",
    }),
    tagTypes: ["ProposalImage"],
    endpoints: (builder) => ({
        getProposalImages: builder.query({
            query: (params) => ({
                url: "/",
                params: params || {},
            }),
            providesTags: ["ProposalImage"],
        }),

        getProposalImageById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "ProposalImage", id }],
        }),

        createProposalImage: builder.mutation({
            query: (formData) => ({
                url: "/",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["ProposalImage"],
        }),

        updateProposalImage: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["ProposalImage"],
        }),

        deleteProposalImage: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["ProposalImage"],
        }),
    }),
});

export const {
    useGetProposalImagesQuery,
    useGetProposalImageByIdQuery,
    useCreateProposalImageMutation,
    useUpdateProposalImageMutation,
    useDeleteProposalImageMutation,
} = proposalImageApi;

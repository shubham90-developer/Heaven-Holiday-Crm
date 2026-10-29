import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const leadRemarksApi = createApi({

    reducerPath: "leadRemarksApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/api/remark`,
    }),

    tagTypes: ["LeadRemark"],

    endpoints: (builder) => ({

        // CREATE
        createLeadRemark: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["LeadRemark"],
        }),

        // GET ALL BY LEAD ID
        getRemarksByLeadId: builder.query({
            query: ({ leadId, page = 1, limit = 20 }) =>
                `/lead/${leadId}?page=${page}&limit=${limit}`,
            providesTags: ["LeadRemark"],
        }),

        // GET SINGLE BY ID
        getRemarkById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["LeadRemark"],
        }),

        // UPDATE
        updateLeadRemark: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["LeadRemark"],
        }),

        // DELETE
        deleteLeadRemark: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["LeadRemark"],
        }),

    }),
});

export const {
    useCreateLeadRemarkMutation,
    useGetRemarksByLeadIdQuery,
    useGetRemarkByIdQuery,
    useUpdateLeadRemarkMutation,
    useDeleteLeadRemarkMutation,
} = leadRemarksApi;
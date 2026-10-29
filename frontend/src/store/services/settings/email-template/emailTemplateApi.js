import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const emailTemplateApi = createApi({
    reducerPath: "emailTemplateApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api/settings/email-template` }),
    tagTypes: ["EmailTemplate"],
    endpoints: (builder) => ({

        // GET all email templates
        getAllEmailTemplates: builder.query({
            query: () => "/",
            providesTags: ["EmailTemplate"],
        }),

        // GET single email template by ID
        getEmailTemplateById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["EmailTemplate"],
        }),

        // POST create email template
        createEmailTemplate: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["EmailTemplate"],
        }),

        // PUT update email template
        updateEmailTemplate: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["EmailTemplate"],
        }),

        // DELETE email template
        deleteEmailTemplate: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["EmailTemplate"],
        }),

    }),
});

export const {
    useGetAllEmailTemplatesQuery,
    useGetEmailTemplateByIdQuery,
    useCreateEmailTemplateMutation,
    useUpdateEmailTemplateMutation,
    useDeleteEmailTemplateMutation,
} = emailTemplateApi;
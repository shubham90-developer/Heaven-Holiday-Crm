import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const termsConditionsApi = createApi({
    reducerPath: "termsConditionsApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api/settings/terms-and-conditions` }),
    tagTypes: ["TermsConditions"],
    endpoints: (builder) => ({

        // GET terms & conditions
        getTermsConditions: builder.query({
            query: () => "/",
            providesTags: ["TermsConditions"],
        }),

        // POST create or update terms & conditions
        createOrUpdateTermsConditions: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["TermsConditions"],
        }),

    }),
});

export const {
    useGetTermsConditionsQuery,
    useCreateOrUpdateTermsConditionsMutation,
} = termsConditionsApi;
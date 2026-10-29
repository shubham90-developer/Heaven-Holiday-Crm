import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const enquirySupplierApi = createApi({
    reducerPath: "enquirySupplierApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api/enquiry-supplier` }),
    endpoints: (builder) => ({
        getEnquirySupplierMailConfig: builder.query({
            query: () => "/config",
        }),
        sendEnquiryToSuppliers: builder.mutation({
            query: (body) => ({
                url: "/send",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetEnquirySupplierMailConfigQuery,
    useSendEnquiryToSuppliersMutation,
} = enquirySupplierApi;

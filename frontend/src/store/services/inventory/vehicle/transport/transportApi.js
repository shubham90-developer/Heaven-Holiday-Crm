import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const transportApi = createApi({
    reducerPath: "transportApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/inventory/vehicle`,
    }),
    tagTypes: ["Transport"],
    endpoints: (builder) => ({
        getTransports: builder.query({
            query: (params) => ({
                url: "/transport",
                params,
            }),

            // ensures refetch when filters change
            serializeQueryArgs: ({ queryArgs }) => {
                return JSON.stringify(queryArgs);
            },

            providesTags: ["Transport"],
        }),

        getTransportById: builder.query({
            query: (id) => `/transport/${id}`,
            providesTags: ["Transport"],
        }),

        createTransport: builder.mutation({
            query: (newTransport) => ({
                url: "/transport",
                method: "POST",
                body: newTransport,
            }),
            invalidatesTags: ["Transport"],
        }),

        updateTransport: builder.mutation({
            query: ({ id, data }) => ({
                url: `/transport/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Transport"],
        }),

        deleteTransport: builder.mutation({
            query: (id) => ({
                url: `/transport/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Transport"],
        }),
    }),
});

export const {
    useGetTransportsQuery,
    useGetTransportByIdQuery,
    useCreateTransportMutation,
    useUpdateTransportMutation,
    useDeleteTransportMutation,
} = transportApi;
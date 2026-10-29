import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const transportRouteApi = createApi({
    reducerPath: "transportRouteApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/inventory/transport-route`,
    }),

    tagTypes: ["Transport"],

    endpoints: (builder) => ({
        // Create
        createTransportRoute: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Transport"],
        }),

        // Get all
        getTransportRoutes: builder.query({
            query: () => "/",
            providesTags: ["Transport"],
        }),

        // Get by ID
        getTransportRouteById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["Transport"],
        }),

        // Update
        updateTransportRoute: builder.mutation({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Transport"],
        }),

        // Delete
        deleteTransportRoute: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Transport"],
        }),
    }),
});

export const {
    useCreateTransportRouteMutation,
    useGetTransportRoutesQuery,
    useGetTransportRouteByIdQuery,
    useUpdateTransportRouteMutation,
    useDeleteTransportRouteMutation,
} = transportRouteApi;
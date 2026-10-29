import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const itineraryApi = createApi({
    reducerPath: "itineraryApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/inventory/itinerary`,
    }),

    tagTypes: ["Itinerary"],

    endpoints: (builder) => ({
        // CREATE
        createItinerary: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Itinerary"],
        }),

        // GET ALL
        getItineraries: builder.query({
            query: (params) => ({
                url: "/",
                params,
            }),

            // THIS FIXES REFRESH ISSUE
            serializeQueryArgs: ({ queryArgs }) => {
                return JSON.stringify(queryArgs);
            },
            providesTags: ["Itinerary"],
        }),

        // GET BY ID
        getItineraryById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["Itinerary"],
        }),

        // UPDATE
        updateItinerary: builder.mutation({
            query: ({ id, body }) => ({
                url: `/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Itinerary"],
        }),

        // DELETE
        deleteItinerary: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Itinerary"],
        }),
    }),
});

export const {
    useCreateItineraryMutation,
    useGetItinerariesQuery,
    useGetItineraryByIdQuery,
    useUpdateItineraryMutation,
    useDeleteItineraryMutation,
} = itineraryApi;
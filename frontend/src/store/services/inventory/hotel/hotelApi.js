import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const hotelApi = createApi({
    reducerPath: "hotelApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/inventory/hotel`,
    }),
    tagTypes: ["Hotel"],

    endpoints: (builder) => ({
        // CREATE
        createHotel: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Hotel"],
        }),

        // GET ALL
        getHotels: builder.query({
            query: () => "/",
            providesTags: ["Hotel"],
        }),

        // GET SINGLE
        getHotelById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["Hotel"],
        }),

        // UPDATE
        updateHotel: builder.mutation({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Hotel"],
        }),

        // DELETE
        deleteHotel: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Hotel"],
        }),
    }),
});

// Hooks
export const {
    useCreateHotelMutation,
    useGetHotelsQuery,
    useGetHotelByIdQuery,
    useUpdateHotelMutation,
    useDeleteHotelMutation,
} = hotelApi;
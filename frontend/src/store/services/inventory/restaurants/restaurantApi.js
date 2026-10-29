import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const restaurantApi = createApi({
    reducerPath: "restaurantApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/inventory/restaurant`,
    }),

    tagTypes: ["Restaurant"],

    endpoints: (builder) => ({
        createRestaurant: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Restaurant"],
        }),

        getRestaurants: builder.query({
            query: () => "/",
            providesTags: ["Restaurant"],
        }),

        getRestaurantById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["Restaurant"],
        }),

        updateRestaurant: builder.mutation({
            query: ({ id, data }) => ({
                url: `restaurants/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Restaurant"],
        }),

        deleteRestaurant: builder.mutation({
            query: (id) => ({
                url: `restaurants/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Restaurant"],
        }),
    }),
});

export const {
    useCreateRestaurantMutation,
    useGetRestaurantsQuery,
    useGetRestaurantByIdQuery,
    useUpdateRestaurantMutation,
    useDeleteRestaurantMutation,
} = restaurantApi;
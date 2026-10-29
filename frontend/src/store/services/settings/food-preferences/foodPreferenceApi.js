import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const foodPreferenceApi = createApi({
    reducerPath: "foodPreferenceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/settings/food-preferences`,
    }),
    tagTypes: ["FoodPreference"],
    endpoints: (builder) => ({
        getFoodPreferences: builder.query({
            query: (params) => ({
                url: "/",
                params: params || {},
            }),
            providesTags: ["FoodPreference"],
        }),

        getFoodPreferenceById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "FoodPreference", id }],
        }),

        createFoodPreference: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["FoodPreference"],
        }),

        updateFoodPreference: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["FoodPreference"],
        }),

        deleteFoodPreference: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["FoodPreference"],
        }),
    }),
});

export const {
    useGetFoodPreferencesQuery,
    useGetFoodPreferenceByIdQuery,
    useCreateFoodPreferenceMutation,
    useUpdateFoodPreferenceMutation,
    useDeleteFoodPreferenceMutation,
} = foodPreferenceApi;

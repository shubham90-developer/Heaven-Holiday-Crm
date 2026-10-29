import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const areaMasterApi = createApi({
    reducerPath: "areaMasterApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/inventory/area-master`,
    }),
    tagTypes: ["Area"],
    endpoints: (builder) => ({
        getAreas: builder.query({
            query: (params) => ({
                url: "/",
                params,
            }),

            // THIS FIXES REFRESH ISSUE
            serializeQueryArgs: ({ queryArgs }) => {
                return JSON.stringify(queryArgs);
            },
            providesTags: ["Area"],
        }),

        createArea: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Area"],
        }),

        updateArea: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Area"],
        }),

        deleteArea: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Area"],
        }),
    }),
});

export const {
    useGetAreasQuery,
    useCreateAreaMutation,
    useUpdateAreaMutation,
    useDeleteAreaMutation,
} = areaMasterApi;
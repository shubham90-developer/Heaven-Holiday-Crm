import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const driverApi = createApi({
    reducerPath: "driverApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/inventory/vehicle`,
    }),
    tagTypes: ["Driver"],
    endpoints: (builder) => ({

        // GET ALL
        getDrivers: builder.query({
            query: (params) => ({
                url: "/driver",
                params,
            }),

            // THIS FIXES REFRESH ISSUE
            serializeQueryArgs: ({ queryArgs }) => {
                return JSON.stringify(queryArgs);
            },

            providesTags: ["Driver"],
        }),
        
        // GET BY ID
        getDriverById: builder.query({
            query: (id) => `/driver/${id}`,
            providesTags: ["Driver"],
        }),

        // CREATE
        createDriver: builder.mutation({
            query: (data) => ({
                url: "/driver",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Driver"],
        }),

        // UPDATE
        updateDriver: builder.mutation({
            query: ({ id, data }) => ({
                url: `/driver/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Driver"],
        }),

        // DELETE
        deleteDriver: builder.mutation({
            query: (id) => ({
                url: `/driver/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Driver"],
        }),

    }),
});

export const {
    useGetDriversQuery,
    useGetDriverByIdQuery,
    useCreateDriverMutation,
    useUpdateDriverMutation,
    useDeleteDriverMutation,
} = driverApi;
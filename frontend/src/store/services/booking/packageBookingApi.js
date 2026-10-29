import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const packageBookingApi = createApi({
    reducerPath: "packageBookingApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api/booking/packages` }),
    tagTypes: ["PackageBooking"],
    endpoints: (builder) => ({
        getPackageBookings: builder.query({
            query: (params = {}) => ({
                url: "/",
                params,
            }),
            providesTags: ["PackageBooking"],
        }),

        getPackageBookingById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["PackageBooking"],
        }),

        createPackageBooking: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PackageBooking"],
        }),

        updatePackageBooking: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["PackageBooking"],
        }),

        deletePackageBooking: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PackageBooking"],
        }),
    }),
});

export const {
    useGetPackageBookingsQuery,
    useGetPackageBookingByIdQuery,
    useCreatePackageBookingMutation,
    useUpdatePackageBookingMutation,
    useDeletePackageBookingMutation,
} = packageBookingApi;

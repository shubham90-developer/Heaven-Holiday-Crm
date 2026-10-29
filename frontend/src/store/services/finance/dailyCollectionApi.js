import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { packageBookingApi } from "../booking/packageBookingApi";
import { queryApi } from "../queriesApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const dailyCollectionApi = createApi({
    reducerPath: "dailyCollectionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/finance/daily-collection`,
        credentials: "include",
    }),
    tagTypes: ["DailyCollection"],
    endpoints: (builder) => ({
        getDailyCollections: builder.query({
            query: (params = {}) => ({
                url: "/",
                params,
            }),
            providesTags: ["DailyCollection"],
        }),

        createDailyCollection: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["DailyCollection"],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(packageBookingApi.util.invalidateTags(["PackageBooking"]));
                    dispatch(queryApi.util.invalidateTags(["Query"]));
                } catch {
                    /* ignore */
                }
            },
        }),

        approveDailyCollection: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}/approve`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["DailyCollection"],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(packageBookingApi.util.invalidateTags(["PackageBooking"]));
                    dispatch(queryApi.util.invalidateTags(["Query"]));
                } catch {
                    /* ignore */
                }
            },
        }),

        rejectDailyCollection: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}/reject`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["DailyCollection"],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(packageBookingApi.util.invalidateTags(["PackageBooking"]));
                    dispatch(queryApi.util.invalidateTags(["Query"]));
                } catch {
                    /* ignore */
                }
            },
        }),
    }),
});

export const {
    useGetDailyCollectionsQuery,
    useCreateDailyCollectionMutation,
    useApproveDailyCollectionMutation,
    useRejectDailyCollectionMutation,
} = dailyCollectionApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const touchPointApi = createApi({
    reducerPath: "touchPointApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/touch-points`,
        credentials: "include",
    }),
    tagTypes: ["TouchPoint"],
    endpoints: (builder) => ({
        getTouchPointsByQuery: builder.query({
            query: (queryId) => `/query/${queryId}`,
            providesTags: (result, error, queryId) => [
                { type: "TouchPoint", id: queryId },
            ],
        }),

        createTouchPoint: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["TouchPoint"],
        }),
    }),
});

export const {
    useGetTouchPointsByQueryQuery,
    useCreateTouchPointMutation,
} = touchPointApi;

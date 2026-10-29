// ======================================================
// FILE: store/services/travelHistoryApi.ts
// ======================================================

import {
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";


export const travelHistoryApi =
    createApi({

        reducerPath:
            "travelHistoryApi",

        baseQuery:
            fetchBaseQuery({
                baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/api/travel-history/`,
            }),

        tagTypes: [
            "TravelHistory",
        ],

        endpoints: (builder) => ({


            // CREATE
            createTravelHistory:
                builder.mutation({

                    query: (body) => ({

                        url: "/",
                        method: "POST",
                        body,
                    }),

                    invalidatesTags: [
                        "TravelHistory",
                    ],
                }),


            // GET ALL
            getAllTravelHistory:
                builder.query({

                    query: () => ({
                        url: "/",
                    }),

                    providesTags: [
                        "TravelHistory",
                    ],
                }),


            // GET BY LEAD
            getTravelHistoryByLead:
                builder.query({

                    query: (leadId) => ({
                        url: `/${leadId}`,
                    }),

                    providesTags: [
                        "TravelHistory",
                    ],
                }),


            // DELETE
            deleteTravelHistory:
                builder.mutation({

                    query: (id) => ({

                        url: `/${id}`,
                        method: "DELETE",
                    }),

                    invalidatesTags: [
                        "TravelHistory",
                    ],
                }),

        }),
    });


export const {

    useCreateTravelHistoryMutation,
    useGetAllTravelHistoryQuery,
    useGetTravelHistoryByLeadQuery,
    useDeleteTravelHistoryMutation,

} = travelHistoryApi;
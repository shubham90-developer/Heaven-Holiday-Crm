// ======================================================
// FILE: store/services/destinationApi.ts
// ======================================================

import {
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const destinationApi =
    createApi({

        reducerPath:
            "destinationApi",

        baseQuery:
            fetchBaseQuery({
                baseUrl: `${API_URL}/v1/api/destination`,
            }),

        tagTypes: [
            "Destination",
        ],

        endpoints: (builder) => ({


            // CREATE
            createDestination:
                builder.mutation({

                    query: (body) => ({

                        url:
                            "/",

                        method:
                            "POST",

                        body,
                    }),

                    invalidatesTags: [
                        "Destination",
                    ],
                }),


            // GET ALL
            getAllDestinations:
                builder.query({

                    query: () => ({
                        url:
                            "/",
                    }),

                    providesTags: [
                        "Destination",
                    ],
                }),


            // GET BY LEAD
            getDestinationsByLead:
                builder.query({

                    query: (leadId) => ({
                        url:
                            `/${leadId}`,
                    }),

                    providesTags: [
                        "Destination",
                    ],
                }),


            // DELETE
            deleteDestination:
                builder.mutation({

                    query: (id) => ({

                        url:
                            `/${id}`,

                        method:
                            "DELETE",
                    }),

                    invalidatesTags: [
                        "Destination",
                    ],
                }),

        }),
    });


export const {

    useCreateDestinationMutation,
    useGetAllDestinationsQuery,
    useGetDestinationsByLeadQuery,
    useDeleteDestinationMutation,

} = destinationApi;
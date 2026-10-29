import {
    createApi,
    fetchBaseQuery
} from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const bankDetailApi = createApi({
    reducerPath: "bankDetailApi",

    baseQuery: fetchBaseQuery({
        baseUrl:
            `${API_URL}/v1/api/settings/company-profile/bank-details`,

        credentials: "include"
    }),

    tagTypes: ["BankDetail"],

    endpoints: (builder) => ({

        // CREATE
        createBankDetail: builder.mutation({
            query: (bankData) => ({
                url: "/",
                method: "POST",
                body: bankData
            }),

            invalidatesTags: ["BankDetail"]
        }),

        // GET ALL
        getBankDetails: builder.query({
            query: () => ({
                url: "/",
                method: "GET"
            }),

            providesTags: ["BankDetail"]
        }),

        // GET BY ID
        getBankDetailById: builder.query({
            query: (id) => ({
                url: `/${id}`,
                method: "GET"
            })
        }),

        // UPDATE
        updateBankDetail: builder.mutation({
            query: ({
                id,
                bankData
            }) => ({
                url: `/${id}`,
                method: "PATCH",
                body: bankData
            }),

            invalidatesTags: ["BankDetail"]
        }),

        // DELETE
        deleteBankDetail: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            }),

            invalidatesTags: ["BankDetail"]
        }),

        // SET ACTIVE
        setActiveBankDetail: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "PATCH"
            }),

            invalidatesTags: ["BankDetail"]
        })

    })
});

export const {

    useCreateBankDetailMutation,
    useGetBankDetailsQuery,
    useGetBankDetailByIdQuery,
    useUpdateBankDetailMutation,
    useDeleteBankDetailMutation,
    useSetActiveBankDetailMutation

} = bankDetailApi;
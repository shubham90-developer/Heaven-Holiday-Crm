import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const companyProfileApi = createApi({
    reducerPath: 'companyProfileApi',

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/settings/company-profile`,
        credentials: 'include'
    }),

    tagTypes: ['CompanyProfile'],

    endpoints: (builder) => ({

        createOrUpdateCompanyProfile:
            builder.mutation({
                query: (profileData) => ({
                    url: '/',
                    method: 'POST',
                    body: profileData
                }),

                invalidatesTags: ['CompanyProfile']
            }),

        getCompanyProfile:
            builder.query({
                query: () => ({
                    url: '/',
                    method: 'GET'
                }),

                providesTags: ['CompanyProfile']
            })

    })
})

export const {
    useCreateOrUpdateCompanyProfileMutation,
    useGetCompanyProfileQuery
} = companyProfileApi
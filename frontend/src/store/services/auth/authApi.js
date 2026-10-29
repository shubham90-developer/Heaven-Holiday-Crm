import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authApi = createApi({
    reducerPath: 'authApi',

    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/auth`,
        credentials: 'include'
    }),

    endpoints: (builder) => ({

        register: builder.mutation({
            query: (userData) => ({
                url: '/register',
                method: 'POST',
                body: userData
            })
        }),

        login: builder.mutation({
            query: (userData) => ({
                url: '/login',
                method: 'POST',
                body: userData
            })
        }),

        logout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST'
            })
        }),

        refreshToken: builder.mutation({
            query: () => ({
                url: '/refresh-token',
                method: 'POST'
            })
        }),

        verifyUser: builder.query({
            query: () => ({
                url: '/verify-user',
                method: 'GET'
            })
        })

    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useVerifyUserQuery
} = authApi
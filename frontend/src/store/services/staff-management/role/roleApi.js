import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const roleApi = createApi({
    reducerPath: "roleApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api/staff-management/role` }),
    tagTypes: ["Role"],

    endpoints: (builder) => ({

        // GET all roles
        getRoles: builder.query({
            query: () => "/",
            providesTags: ["Role"],
        }),

        // GET single role
        getRoleById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["Role"],
        }),

        // POST create role
        createRole: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Role"],
        }),

        // PUT full update
        updateRole: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Role"],
        }),

        // PATCH partial update
        patchRole: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Role"],
        }),

        // DELETE soft delete
        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Role"],
        }),

    }),
});

export const {
    useGetRolesQuery,
    useGetRoleByIdQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    usePatchRoleMutation,
    useDeleteRoleMutation,
} = roleApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const departmentApi = createApi({
    reducerPath: "departmentApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/v1/api/staff-management/department` }),
    tagTypes: ["Department"],

    endpoints: (builder) => ({

        // GET all departments
        getDepartments: builder.query({
            query: () => "/",
            providesTags: ["Department"],
        }),

        // GET single department
        getDepartmentById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["Department"],
        }),

        // POST create department
        createDepartment: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Department"],
        }),

        // PUT full update
        updateDepartment: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Department"],
        }),

        // PATCH partial update
        patchDepartment: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Department"],
        }),

        // DELETE soft delete
        deleteDepartment: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Department"],
        }),

    }),
});

export const {
    useGetDepartmentsQuery,
    useGetDepartmentByIdQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    usePatchDepartmentMutation,
    useDeleteDepartmentMutation,
} = departmentApi;
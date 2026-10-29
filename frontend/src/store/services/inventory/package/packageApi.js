import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const packageApi = createApi({
    reducerPath: "packageApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/v1/api/inventory/package`,
    }),
    tagTypes: ["Package"],

    endpoints: (builder) => ({
        createPackage: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Package"],
        }),

        getAllPackages: builder.query({
            query: () => "/",
            providesTags: ["Package"],
        }),

        getSinglePackage: builder.query({
            query: (id) => `/${id}`,
            providesTags: ["Package"],
        }),

        updatePackage: builder.mutation({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Package"],
        }),

        deletePackage: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Package"],
        }),
    }),
});

export const {
    useCreatePackageMutation,
    useGetAllPackagesQuery,
    useGetSinglePackageQuery,
    useUpdatePackageMutation,
    useDeletePackageMutation,
} = packageApi;
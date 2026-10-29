import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const staffApi = createApi({
  reducerPath: "staffApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/v1/api/staff-management/staff`, // adjust if needed
  }),
  tagTypes: ["Staff"],

  endpoints: (builder) => ({

    // CREATE STAFF
    createStaff: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),

    // GET ALL STAFF
    getStaff: builder.query({
      query: () => "/",
      providesTags: ["Staff"],
    }),

    // GET SINGLE STAFF
    getStaffById: builder.query({
      query: (id) => `/${id}`,
    }),

    // UPDATE STAFF
    updateStaff: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),

    // DELETE STAFF (SOFT)
    deleteStaff: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staff"],
    }),

  }),
});

export const {
  useCreateStaffMutation,
  useGetStaffQuery,
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApi;
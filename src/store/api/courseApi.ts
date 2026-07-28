import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../index";
import { Course, Institute, PaginationMeta } from "../../types/dataTypes";

const BASE_URL = import.meta.env.VITE_API_URL;

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Course"],
  endpoints: (builder) => ({
    getCourses: builder.query<
      { success: boolean; data: { courses: Course[]; meta: PaginationMeta } },
      { institute?: Institute; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/courses",
        params: params || undefined,
      }),
      providesTags: [{ type: "Course", id: "LIST" }],
    }),
    createCourse: builder.mutation<
      { success: boolean; data: Course },
      { name: string; description: string | null; institute: Institute }
    >({
      query: (body) => ({
        url: "/courses",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),
    updateCourse: builder.mutation<
      { success: boolean; data: Course },
      {
        id: string;
        body: {
          name?: string;
          description?: string | null;
          institute?: Institute;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),
    deleteCourse: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;

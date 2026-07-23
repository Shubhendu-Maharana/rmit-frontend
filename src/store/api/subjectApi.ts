import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../index";
import { Subject, Institute } from "../../types/dataTypes";

const BASE_URL = import.meta.env.VITE_API_URL;

export interface GetSubjectsParams {
  courseId?: string;
  semester?: number;
  academicYear?: string;
  institute?: Institute;
}

export const subjectApi = createApi({
  reducerPath: "subjectApi",
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
  tagTypes: ["Subject"],
  endpoints: (builder) => ({
    getSubjects: builder.query<
      { success: boolean; data: Subject[] },
      GetSubjectsParams | void
    >({
      query: (params) => ({
        url: "/subjects",
        params: params || undefined,
      }),
      providesTags: [{ type: "Subject", id: "LIST" }],
    }),
    createSubject: builder.mutation<
      { success: boolean; data: Subject },
      {
        code: string;
        name: string;
        credits: number;
        semester: number;
        academicYear: string;
        courseId: string;
      }
    >({
      query: (body) => ({
        url: "/subjects",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Subject", id: "LIST" }],
    }),
    updateSubject: builder.mutation<
      { success: boolean; data: Subject },
      {
        id: string;
        body: {
          code?: string;
          name?: string;
          credits?: number;
          semester?: number;
          academicYear?: string;
          courseId?: string;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `/subjects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Subject", id: "LIST" }],
    }),
    deleteSubject: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Subject", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;

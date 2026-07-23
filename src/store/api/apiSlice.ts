import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../index";
import { Faculty, Student, Notice, Timetable } from "@app/types/dataTypes";
import { DatabaseUser } from "@app/types/users";

export interface AuthResponse {
  user: DatabaseUser;
  token: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_URL || "").replace(/\/$/, ""),
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Faculty", "Student", "Notice", "Timetable"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<
      AuthResponse,
      { email: string; password?: string; role: "admin" | "faculty" }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // Faculty endpoints
    getFaculties: builder.query<Faculty[], void>({
      query: () => "/faculties",
      providesTags: ["Faculty"],
    }),
    createFaculty: builder.mutation<Faculty, Omit<Faculty, "id">>({
      query: (faculty) => ({
        url: "/faculties",
        method: "POST",
        body: faculty,
      }),
      invalidatesTags: ["Faculty"],
    }),
    updateFaculty: builder.mutation<void, Faculty>({
      query: (faculty) => ({
        url: `/faculties/${faculty.id}`,
        method: "PUT",
        body: faculty,
      }),
      invalidatesTags: ["Faculty"],
    }),
    deleteFaculty: builder.mutation<void, string>({
      query: (id) => ({
        url: `/faculties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faculty"],
    }),

    // Student endpoints
    getStudents: builder.query<Student[], void>({
      query: () => "/students",
      providesTags: ["Student"],
    }),
    addStudent: builder.mutation<Student, Omit<Student, "id">>({
      query: (student) => ({
        url: "/students",
        method: "POST",
        body: student,
      }),
      invalidatesTags: ["Student"],
    }),
    updateStudent: builder.mutation<Student, Student>({
      query: (student) => ({
        url: `/students/${student.id}`,
        method: "PUT",
        body: student,
      }),
      invalidatesTags: ["Student"],
    }),
    deleteStudent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),

    // Notice endpoints
    getNotices: builder.query<Notice[], void>({
      query: () => "/notices",
      providesTags: ["Notice"],
    }),
    postNotice: builder.mutation<Notice, Omit<Notice, "id">>({
      query: (notice) => ({
        url: "/notices",
        method: "POST",
        body: notice,
      }),
      invalidatesTags: ["Notice"],
    }),
    updateNotice: builder.mutation<Notice, Notice>({
      query: (notice) => ({
        url: `/notices/${notice.id}`,
        method: "PUT",
        body: notice,
      }),
      invalidatesTags: ["Notice"],
    }),
    deleteNotice: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notice"],
    }),

    // Timetable endpoints
    getTimetables: builder.query<Timetable[], void>({
      query: () => "/timetables",
      providesTags: ["Timetable"],
    }),
    postTimetable: builder.mutation<Timetable, Omit<Timetable, "id">>({
      query: (timetable) => ({
        url: "/timetables",
        method: "POST",
        body: timetable,
      }),
      invalidatesTags: ["Timetable"],
    }),
    updateTimetable: builder.mutation<Timetable, Timetable>({
      query: (timetable) => ({
        url: `/timetables/${timetable.id}`,
        method: "PUT",
        body: timetable,
      }),
      invalidatesTags: ["Timetable"],
    }),
    deleteTimetable: builder.mutation<void, string>({
      query: (id) => ({
        url: `/timetables/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Timetable"],
    }),

    // File upload endpoint
    uploadFile: builder.mutation<
      { url: string },
      { file: File; bucket: string }
    >({
      query: ({ file, bucket }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", bucket);
        return {
          url: "/upload",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetFacultiesQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetNoticesQuery,
  usePostNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
  useGetTimetablesQuery,
  usePostTimetableMutation,
  useUpdateTimetableMutation,
  useDeleteTimetableMutation,
  useUploadFileMutation,
} = apiSlice;

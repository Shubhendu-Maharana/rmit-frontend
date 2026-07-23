import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../index";
import { User, Role, Institute } from "../../types/dataTypes";

export interface GetUsersParams {
  role?: Role;
  institute?: Institute;
  includeDeleted?: boolean;
  search?: string;
}

export interface CreateUserPayload {
  email?: string;
  rollNumber?: string;
  password?: string;
  role: Role;
  profile?: {
    name?: string;
    gender?: string;
    institute?: Institute;
    department?: string;
    designation?: string;
    courseId?: string;
    resumeUrl?: string;
    joiningLetterUrl?: string;
    qualificationCerts?: string[];
    qualification?: string;
    experienceYears?: number;
    employmentType?: string;
    phone?: string;
    address?: string;
    year?: number;
    semester?: number;
    section?: string;
    batch?: string;
    tenthMarksheetUrl?: string;
    twelfthMarksheetUrl?: string;
    identityProofUrl?: string;
    dateOfBirth?: string;
    guardianName?: string;
    guardianPhone?: string;
  };
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    mimetype: string;
    originalName: string;
    size: number;
    url: string;
  };
  timestamp: string;
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const userApi = createApi({
  reducerPath: "userApi",
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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<{ success: boolean; data: User[] }, GetUsersParams>(
      {
        query: (params) => ({
          url: "/users",
          params,
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.data.map(({ id }) => ({ type: "User" as const, id })),
                { type: "User", id: "LIST" },
              ]
            : [{ type: "User", id: "LIST" }],
      },
    ),
    getUserById: builder.query<{ success: boolean; data: User }, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation<
      { success: boolean; data: { user: User } },
      CreateUserPayload
    >({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation<
      { success: boolean; data: { user: User } },
      { id: string; body: Partial<CreateUserPayload> }
    >({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    restoreUser: builder.mutation<{ success: boolean; data: User }, string>({
      query: (id) => ({
        url: `/users/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    uploadFile: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useUploadFileMutation,
} = userApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../index";
import { Notice, Institute } from "../../types/dataTypes";

const BASE_URL = import.meta.env.VITE_API_URL;

export const noticeApi = createApi({
  reducerPath: "noticeApi",
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
  tagTypes: ["Notice"],
  endpoints: (builder) => ({
    getNotices: builder.query<
      { success: boolean; data: Notice[] },
      { institute?: Institute } | void
    >({
      query: (params) => ({
        url: "/notices",
        params: params || undefined,
      }),
      providesTags: [{ type: "Notice", id: "LIST" }],
    }),
    createNotice: builder.mutation<
      { success: boolean; data: Notice },
      { title: string; fileUrl: string; institute: Institute | null }
    >({
      query: (body) => ({
        url: "/notices",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Notice", id: "LIST" }],
    }),
    updateNotice: builder.mutation<
      { success: boolean; data: Notice },
      {
        id: string;
        body: {
          title?: string;
          fileUrl?: string;
          institute?: Institute | null;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `/notices/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Notice", id: "LIST" }],
    }),
    deleteNotice: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Notice", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNoticesQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} = noticeApi;

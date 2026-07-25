import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../index";
import { Course } from "../../types/dataTypes";

const BASE_URL = import.meta.env.VITE_API_URL;

export interface FeeStructure {
  id: string;
  title: string;
  amount: number;
  courseId: string;
  course?: Course;
  semester: number;
  academicYear: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeeTransaction {
  id: string;
  feeReceiptId: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  paymentMethod: string;
  transactionId: string | null;
  razorpayOrderId: string | null;
  razorpaySignature: string | null;
  recordedByAdminId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FeeReceipt {
  id: string;
  studentId: string;
  student?: any;
  feeStructureId: string;
  feeStructure?: FeeStructure;
  amountPaid: number;
  status: "PENDING" | "PAID" | "FAILED";
  transactions?: FeeTransaction[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeeStructurePayload {
  title: string;
  amount: number;
  courseId: string;
  semester: number;
  academicYear: string;
  dueDate: string;
}

export interface UpdateFeeStructurePayload {
  id: string;
  body: {
    title?: string;
    amount?: number;
    dueDate?: string;
    courseId?: string;
    semester?: number;
    academicYear?: string;
  };
}

export interface AssignFeePayload {
  feeStructureId: string;
  assignType: "ALL" | "INDIVIDUAL";
  studentId?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    amount: number;
    currency: string;
    feeTitle: string;
    studentDetails: {
      name: string;
      rollNumber: string;
      email: string | null;
    };
  };
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface EligibleStudent {
  id: string;
  name: string;
  institute: string;
  courseId: string;
  semester: number;
  batch: string;
  user: {
    rollNumber: string;
    email: string;
  };
}

export const feeApi = createApi({
  reducerPath: "feeApi",
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
  tagTypes: ["FeeStructure", "FeeReceipt"],
  endpoints: (builder) => ({
    getFeeStructures: builder.query<
      { success: boolean; data: FeeStructure[] },
      {
        institute?: string;
        courseId?: string;
        semester?: number;
        academicYear?: string;
      } | void
    >({
      query: (params) => ({
        url: "/fees",
        params: params || undefined,
      }),
      providesTags: [{ type: "FeeStructure", id: "LIST" }],
    }),
    createFeeStructure: builder.mutation<
      { success: boolean; data: FeeStructure },
      CreateFeeStructurePayload
    >({
      query: (body) => ({
        url: "/fees",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "FeeStructure", id: "LIST" }],
    }),
    updateFeeStructure: builder.mutation<
      { success: boolean; data: FeeStructure },
      UpdateFeeStructurePayload
    >({
      query: ({ id, body }) => ({
        url: `/fees/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "FeeStructure", id: "LIST" }],
    }),
    deleteFeeStructure: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/fees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "FeeStructure", id: "LIST" }],
    }),
    assignFee: builder.mutation<
      { success: boolean; data: { count: number } },
      AssignFeePayload
    >({
      query: (body) => ({
        url: "/fees/assign",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "FeeReceipt", id: "LIST" }],
    }),
    getEligibleStudents: builder.query<
      { success: boolean; data: EligibleStudent[] },
      string
    >({
      query: (feeStructureId) => `/fees/${feeStructureId}/eligible-students`,
    }),
    getStudentFees: builder.query<
      { success: boolean; data: FeeReceipt[] },
      void
    >({
      query: () => "/fees/my-status",
      providesTags: [{ type: "FeeReceipt", id: "LIST" }],
    }),
    getStudentPayments: builder.query<
      { success: boolean; data: FeeReceipt[] },
      {
        status?: string;
        studentId?: string;
        feeStructureId?: string;
        institute?: string;
        search?: string;
      } | void
    >({
      query: (params) => ({
        url: "/fees/payments",
        params: params || undefined,
      }),
      providesTags: [{ type: "FeeReceipt", id: "LIST" }],
    }),
    markPaymentManually: builder.mutation<
      { success: boolean; data: FeeReceipt },
      {
        receiptId: string;
        body: { paymentMethod?: string; transactionId?: string };
      }
    >({
      query: ({ receiptId, body }) => ({
        url: `/fees/payments/${receiptId}/manual-pay`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "FeeReceipt", id: "LIST" }],
    }),
    createPaymentOrder: builder.mutation<
      CreateOrderResponse,
      { feeStructureId: string }
    >({
      query: (body) => ({
        url: "/payments/create-order",
        method: "POST",
        body,
      }),
    }),
    verifyPayment: builder.mutation<
      { success: boolean; data: FeeReceipt },
      VerifyPaymentPayload
    >({
      query: (body) => ({
        url: "/payments/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "FeeReceipt", id: "LIST" }],
    }),
  }),
});

export const {
  useGetFeeStructuresQuery,
  useCreateFeeStructureMutation,
  useUpdateFeeStructureMutation,
  useDeleteFeeStructureMutation,
  useAssignFeeMutation,
  useGetEligibleStudentsQuery,
  useGetStudentFeesQuery,
  useGetStudentPaymentsQuery,
  useMarkPaymentManuallyMutation,
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
} = feeApi;

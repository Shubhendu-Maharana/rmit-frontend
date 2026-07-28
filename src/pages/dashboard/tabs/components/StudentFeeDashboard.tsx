import React, { useState } from "react";
import { FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { FeeReceipt } from "../../../../store/api/feeApi";
import { initiateRazorpayCheckout } from "../../../../utils/payment";
import { Pagination } from "../../../../components/ui/Pagination";

interface StudentFeeDashboardProps {
  receipts: FeeReceipt[];
  loading: boolean;
  createPaymentOrder: (payload: { feeStructureId: string }) => {
    unwrap: () => Promise<any>;
  };
  verifyPayment: (payload: any) => { unwrap: () => Promise<any> };
  openReceiptModal: (receipt: FeeReceipt) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number;
  limit?: number;
}

export const StudentFeeDashboard: React.FC<StudentFeeDashboardProps> = ({
  receipts,
  loading,
  createPaymentOrder,
  verifyPayment,
  openReceiptModal,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  limit,
}) => {
  const [processingFeeId, setProcessingFeeId] = useState<string | null>(null);

  const handlePayment = async (receipt: FeeReceipt) => {
    setProcessingFeeId(receipt.feeStructureId);
    try {
      // Step 1: Create backend order
      const orderResponse = await createPaymentOrder({
        feeStructureId: receipt.feeStructureId,
      }).unwrap();

      const orderData = orderResponse.data;

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId) {
        toast.error("Razorpay Key ID is not configured on the frontend.");
        setProcessingFeeId(null);
        return;
      }

      // Step 2: Open Razorpay checkout options using external utility
      await initiateRazorpayCheckout({
        keyId,
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        feeTitle: orderData.feeTitle,
        studentName: orderData.studentDetails.name,
        studentEmail: orderData.studentDetails.email || "student@rmit.edu",
        onSuccess: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }).unwrap();
            toast.success("Payment completed and verified successfully!");
          } catch (error: any) {
            const msg =
              error?.data?.message ||
              "Payment verification failed. Contact admin.";
            toast.error(msg);
          } finally {
            setProcessingFeeId(null);
          }
        },
        onDismiss: () => {
          setProcessingFeeId(null);
        },
      });
    } catch (error: any) {
      if (error?.message !== "SDK_LOAD_FAILED") {
        const msg =
          error?.data?.message || "Could not generate payment gateway order.";
        toast.error(msg);
      }
      setProcessingFeeId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-150">
        <h4 className="font-bold text-gray-850 text-sm">
          My Allocated Fees & Dues
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-150">
          <thead className="bg-white text-gray-400 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-3 text-left tracking-wider">
                Fee Description
              </th>
              <th className="px-6 py-3 text-center tracking-wider">Semester</th>
              <th className="px-6 py-3 text-center tracking-wider">
                Academic Year
              </th>
              <th className="px-6 py-3 text-right tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-right tracking-wider">Amount</th>
              <th className="px-6 py-3 text-center tracking-wider">Status</th>
              <th className="px-6 py-3 text-right tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm bg-white text-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-400 font-medium animate-pulse"
                >
                  Retrieving assigned student fees...
                </td>
              </tr>
            ) : receipts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No fees have been assigned to your profile yet.
                </td>
              </tr>
            ) : (
              receipts.map((receipt) => {
                const isProcessing = processingFeeId === receipt.feeStructureId;
                const fs = receipt.feeStructure!;
                return (
                  <tr
                    key={receipt.id}
                    className="hover:bg-gray-50/40 transition-colors"
                  >
                    {/* Title */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-805">
                        {fs.title}
                      </div>
                    </td>

                    {/* Semester */}
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-600 font-semibold">
                      Sem {fs.semester}
                    </td>

                    {/* Academic Year */}
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-500 font-medium">
                      {fs.academicYear}
                    </td>

                    {/* Due Date */}
                    <td className="px-6 py-4 text-right whitespace-nowrap text-gray-500 font-semibold">
                      {new Date(fs.dueDate).toLocaleDateString()}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right whitespace-nowrap font-extrabold text-gray-800">
                      ₹{fs.amount.toLocaleString()}
                    </td>

                    {/* Status Badges */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          receipt.status === "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : receipt.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {receipt.status === "PAID" && (
                          <FiCheckCircle size={12} />
                        )}
                        {receipt.status === "FAILED" && (
                          <FiAlertCircle size={12} />
                        )}
                        {receipt.status === "PENDING" && <FiClock size={12} />}
                        {receipt.status}
                      </span>
                    </td>

                    {/* Action button */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {receipt.status === "PAID" ? (
                        <button
                          onClick={() => openReceiptModal(receipt)}
                          className="px-3.5 py-1.5 bg-primary-50 hover:bg-primary-100 border border-primary-100 text-primary-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          View Receipt
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePayment(receipt)}
                          disabled={isProcessing}
                          className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-primary-200 transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Loading...</span>
                            </>
                          ) : receipt.status === "FAILED" ? (
                            "Try Again"
                          ) : (
                            "Pay Now"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {currentPage !== undefined &&
        totalPages !== undefined &&
        onPageChange !== undefined &&
        totalCount !== undefined &&
        limit !== undefined && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalCount={totalCount}
            limit={limit}
          />
        )}
    </div>
  );
};

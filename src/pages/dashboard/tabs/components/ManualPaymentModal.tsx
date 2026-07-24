import React, { useState } from "react";
import { FiX, FiCheckCircle, FiRefreshCw, FiDollarSign } from "react-icons/fi";
import { toast } from "react-toastify";
import { FeeReceipt } from "../../../../store/api/feeApi";

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: FeeReceipt | null;
  markPaymentManually: (args: { receiptId: string; body: { paymentMethod: string; transactionId?: string } }) => { unwrap: () => Promise<any> };
  isLoading: boolean;
}

export const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({
  isOpen,
  onClose,
  receipt,
  markPaymentManually,
  isLoading,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [transactionId, setTransactionId] = useState("");

  if (!isOpen || !receipt) return null;

  const fs = receipt.feeStructure!;
  const studentProfile = receipt.student;
  const studentName = studentProfile?.name || "N/A";
  const rollNumber = studentProfile?.user?.rollNumber || "N/A";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await markPaymentManually({
        receiptId: receipt.id,
        body: {
          paymentMethod,
          transactionId: transactionId.trim() || undefined,
        },
      }).unwrap();
      toast.success("Payment recorded successfully.");
      onClose();
    } catch (error: any) {
      const msg = error?.data?.message || "Failed to record manual payment.";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiDollarSign className="text-emerald-500" />
            <span>Record Offline Payment</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs space-y-2 text-gray-600 font-semibold">
            <div>
              <span className="text-gray-400 block uppercase">Student:</span>
              <span className="text-gray-800 text-sm font-bold">{studentName} ({rollNumber})</span>
            </div>
            <div>
              <span className="text-gray-400 block uppercase">Fee Description:</span>
              <span className="text-gray-800 text-sm font-bold">{fs.title}</span>
            </div>
            <div>
              <span className="text-gray-400 block uppercase">Amount to Clear:</span>
              <span className="text-emerald-600 text-sm font-extrabold">₹{fs.amount.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Payment Channel / Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
              required
            >
              <option value="CASH">Cash Deposit</option>
              <option value="BANK_TRANSFER">Direct Bank Transfer (NEFT/IMPS)</option>
              <option value="CHEQUE">Cheque Deposit</option>
              <option value="UPI">UPI / Digital Wallet</option>
              <option value="OTHER">Other Offline Reference</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-705 mb-1">
              Offline Reference ID / Transaction Ref
            </label>
            <input
              type="text"
              placeholder="e.g. TXN987654321 (Optional)"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Footer Actions */}
          <div className="mt-8 border-t border-gray-100 pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-lg shadow-primary-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FiRefreshCw className="animate-spin" /> Recording...
                </>
              ) : (
                <span className="flex items-center gap-1">
                  <FiCheckCircle /> Mark as PAID
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

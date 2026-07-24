import React from "react";
import { FiX, FiCheckCircle, FiCalendar, FiCreditCard } from "react-icons/fi";
import { FeeReceipt } from "../../../../store/api/feeApi";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: FeeReceipt | null;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  receipt,
}) => {
  if (!isOpen || !receipt) return null;

  const fs = receipt.feeStructure!;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col items-center justify-center text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <FiCheckCircle size={28} className="text-white" />
          </div>
          <h3 className="text-lg font-bold">Transaction Receipt</h3>
          <p className="text-xs text-white/80 font-medium mt-0.5">Cleared & Confirmed</p>
        </div>

        {/* Receipt details */}
        <div className="p-6 space-y-4 text-gray-700 text-sm">
          {/* Fee details */}
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs text-gray-400 font-semibold block uppercase">Fee Head</span>
            <span className="text-gray-800 font-bold text-base">{fs.title}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase">Academic Semester</span>
              <span className="text-gray-800 font-bold">Sem {fs.semester}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase">Academic Year</span>
              <span className="text-gray-800 font-bold">{fs.academicYear}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase">Payment Method</span>
              <span className="text-gray-805 font-bold flex items-center gap-1">
                <FiCreditCard /> {receipt.paymentMethod || "Razorpay"}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase">Paid Amount</span>
              <span className="text-emerald-600 font-extrabold text-base">
                ₹{receipt.amountPaid.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3 text-xs">
            <div>
              <span className="text-gray-400 font-semibold block uppercase mb-0.5">Transaction ID</span>
              <span className="font-mono text-gray-700 font-bold select-all break-all">
                {receipt.transactionId || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold block uppercase mb-0.5">Razorpay Order ID</span>
              <span className="font-mono text-gray-700 font-bold select-all break-all">
                {receipt.razorpayOrderId || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold block uppercase mb-0.5">Payment Date & Time</span>
              <span className="text-gray-700 font-bold flex items-center gap-1">
                <FiCalendar /> {receipt.paidAt ? new Date(receipt.paidAt).toLocaleString() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-750 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

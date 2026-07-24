import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  useGetStudentPaymentsQuery,
  useMarkPaymentManuallyMutation,
  useGetFeeStructuresQuery,
  FeeReceipt,
} from "../../../store/api/feeApi";
import { Institute } from "../../../types/dataTypes";
import { FiSearch, FiFilter, FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import SkeletonTable from "../../../components/ui/SkeletonTable";

// Components
import { ManualPaymentModal } from "./components/ManualPaymentModal";
import { TransactionDetailsModal } from "./components/TransactionDetailsModal";

const StudentPayments: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [instituteFilter, setInstituteFilter] = useState<Institute | "">("");
  const [feeStructureId, setFeeStructureId] = useState("");

  // Modals state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeReceipt | null>(null);

  // RTK Query parameters
  const queryParams: any = {};
  if (statusFilter) queryParams.status = statusFilter;
  if (feeStructureId) queryParams.feeStructureId = feeStructureId;
  if (searchTerm) queryParams.search = searchTerm;

  // Institute scoping
  if (isSuperAdmin) {
    if (instituteFilter) queryParams.institute = instituteFilter;
  } else {
    queryParams.institute = currentUser?.adminProfile?.institute || "";
  }

  // API Queries
  const {
    data: paymentsData,
    isLoading: isPaymentsLoading,
    isFetching: isPaymentsFetching,
  } = useGetStudentPaymentsQuery(queryParams);

  // Load all fee structures for dropdown selector
  const { data: feeStructuresData } = useGetFeeStructuresQuery();

  const [markPaymentManually, { isLoading: isMarking }] = useMarkPaymentManuallyMutation();

  const openManualModal = (receipt: FeeReceipt) => {
    setSelectedReceipt(receipt);
    setIsManualModalOpen(true);
  };

  const openReceiptModal = (receipt: FeeReceipt) => {
    setSelectedReceipt(receipt);
    setIsReceiptModalOpen(true);
  };

  const filteredFeeStructures = feeStructuresData?.data?.filter((fs) => {
    if (isSuperAdmin) return true;
    return fs.course?.institute === currentUser?.adminProfile?.institute;
  }) || [];

  return (
    <div className="w-full space-y-6">
      {/* Title block */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-805 text-base">Student Payments Audit</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Audit payment receipts and clear outstanding student fee items.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Keyword Search */}
          <div className="relative lg:col-span-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiSearch />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student name or roll..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiFilter />
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="PAID">PAID Only</option>
              <option value="PENDING">PENDING Only</option>
              <option value="FAILED">FAILED Only</option>
            </select>
          </div>

          {/* Institute Filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiFilter />
            </span>
            <select
              disabled={!isSuperAdmin}
              value={isSuperAdmin ? instituteFilter : (currentUser?.adminProfile?.institute || "")}
              onChange={(e) => setInstituteFilter(e.target.value as Institute | "")}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {isSuperAdmin ? (
                <>
                  <option value="">All Institutes</option>
                  <option value="RMIT">RMIT (Graduation)</option>
                  <option value="RMITC">RMITC (ITI)</option>
                  <option value="HIT">HIT (Diploma)</option>
                </>
              ) : (
                currentUser?.adminProfile?.institute && (
                  <option value={currentUser.adminProfile.institute}>
                    {currentUser.adminProfile.institute}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Fee Structure Filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiFilter />
            </span>
            <select
              value={feeStructureId}
              onChange={(e) => setFeeStructureId(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer"
            >
              <option value="">All Fee Heads</option>
              {filteredFeeStructures.map((fs) => (
                <option key={fs.id} value={fs.id}>
                  {fs.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-150">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Student Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Course & Sem
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Allocated Fee Title
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Reference / Method
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-gray-700 text-sm">
              {isPaymentsLoading ? (
                <SkeletonTable rows={5} columns={7} />
              ) : !paymentsData?.data || paymentsData.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No matching student payments or receipts found.
                  </td>
                </tr>
              ) : (
                paymentsData.data.map((receipt) => {
                  const fs = receipt.feeStructure!;
                  const stud = receipt.student!;
                  return (
                    <tr
                      key={receipt.id}
                      className="hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      {/* Student Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {stud.name}
                          </div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">
                            Roll: {stud.user?.rollNumber || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Course & Semester */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-semibold">
                        {stud.course?.name} (Sem {fs.semester})
                      </td>

                      {/* Fee Title */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-655 font-medium">
                        {fs.title}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-gray-800">
                        ₹{fs.amount.toLocaleString()}
                      </td>

                      {/* Status */}
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
                          {receipt.status === "PAID" && <FiCheckCircle size={12} />}
                          {receipt.status === "FAILED" && <FiAlertCircle size={12} />}
                          {receipt.status === "PENDING" && <FiClock size={12} />}
                          {receipt.status}
                        </span>
                      </td>

                      {/* Reference */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        {receipt.status === "PAID" ? (
                          <div>
                            <span className="font-bold text-gray-700 block">
                              {receipt.paymentMethod || "Razorpay"}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              Ref: {receipt.transactionId || "N/A"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No payment record</span>
                        )}
                      </td>

                      {/* Actions */}
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
                            onClick={() => openManualModal(receipt)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer inline-flex items-center gap-1 shadow-md shadow-emerald-100 hover:shadow-lg"
                          >
                            <FiDollarSign /> Mark Paid
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
        {isPaymentsFetching && !isPaymentsLoading && (
          <div className="bg-gray-50 py-2 text-center text-xs font-semibold text-primary-600 flex items-center justify-center gap-2">
            <FiRefreshCw className="animate-spin" />
            <span>Updating payment audits...</span>
          </div>
        )}
      </div>

      {/* Manual offline clearance Modal */}
      {isManualModalOpen && selectedReceipt && (
        <ManualPaymentModal
          isOpen={isManualModalOpen}
          onClose={() => {
            setIsManualModalOpen(false);
            setSelectedReceipt(null);
          }}
          receipt={selectedReceipt}
          markPaymentManually={markPaymentManually}
          isLoading={isMarking}
        />
      )}

      {/* View Digital Receipt Details Modal */}
      {isReceiptModalOpen && selectedReceipt && (
        <TransactionDetailsModal
          isOpen={isReceiptModalOpen}
          onClose={() => {
            setIsReceiptModalOpen(false);
            setSelectedReceipt(null);
          }}
          receipt={selectedReceipt}
        />
      )}
    </div>
  );
};

export default StudentPayments;

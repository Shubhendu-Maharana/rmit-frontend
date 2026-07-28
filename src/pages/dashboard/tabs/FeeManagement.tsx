import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import {
  useGetFeeStructuresQuery,
  useCreateFeeStructureMutation,
  useUpdateFeeStructureMutation,
  useDeleteFeeStructureMutation,
  useAssignFeeMutation,
  useGetStudentFeesQuery,
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
  FeeStructure,
  FeeReceipt,
} from "@store/api/feeApi";
import { useGetCoursesQuery } from "@store/api/courseApi";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import WarningModal from "@components/ui/WarningModal";

// Subcomponents
import { FeeStats } from "./components/FeeStats";
import { FeeStructureTable } from "./components/FeeStructureTable";
import { FeeStructureFormModal } from "./components/FeeStructureFormModal";
import { FeeAssignmentPanel } from "./components/FeeAssignmentPanel";
import { StudentFeeDashboard } from "./components/StudentFeeDashboard";
import { TransactionDetailsModal } from "./components/TransactionDetailsModal";

const FeeManagement: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const isStudent = currentUser?.role === "STUDENT";
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Modal & Selection state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeStructure | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<
    "structures" | "allocations"
  >("structures");

  // Student specific modal
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeReceipt | null>(
    null,
  );

  // Reset page when sub tab changes
  React.useEffect(() => {
    setPage(1);
  }, [activeSubTab]);

  // RTK Query API Hooks
  // Query 1: Student Fee status
  const { data: studentFeesData, isLoading: isStudentFeesLoading } =
    useGetStudentFeesQuery({ page, limit }, { skip: !isStudent });

  // Query 2: Fee Structures list
  const {
    data: feeStructuresData,
    isLoading: isFeeStructuresLoading,
    isFetching: isFeeStructuresFetching,
  } = useGetFeeStructuresQuery({ page, limit }, { skip: isStudent });

  // Query 3: Courses (for Assignment panel - fetch up to 50 for dropdowns)
  const { data: coursesData } = useGetCoursesQuery(
    { limit: 50 },
    {
      skip: isStudent,
    },
  );

  // Mutations
  const [createFeeStructure, { isLoading: isCreating }] =
    useCreateFeeStructureMutation();
  const [updateFeeStructure, { isLoading: isUpdating }] =
    useUpdateFeeStructureMutation();
  const [deleteFeeStructure, { isLoading: isDeleting }] =
    useDeleteFeeStructureMutation();
  const [assignFee, { isLoading: isAssigning }] = useAssignFeeMutation();
  const [createPaymentOrder] = useCreatePaymentOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  // Deletion logic
  const openDeleteModal = (fee: FeeStructure) => {
    setSelectedFee(fee);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFee) return;
    try {
      await deleteFeeStructure(selectedFee.id).unwrap();
      toast.success("Fee structure deleted successfully.");
      setIsDeleteOpen(false);
      setSelectedFee(null);
    } catch (error: any) {
      const msg = error?.data?.message || "Failed to delete fee structure.";
      toast.error(msg);
    }
  };

  const openEditModal = (fee: FeeStructure) => {
    setSelectedFee(fee);
    setEditMode(true);
    setIsFormModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedFee(null);
    setEditMode(false);
    setIsFormModalOpen(true);
  };

  const openReceiptModal = (receipt: FeeReceipt) => {
    setSelectedReceipt(receipt);
    setIsReceiptModalOpen(true);
  };

  // Render Student view
  if (isStudent) {
    return (
      <div className="w-full space-y-6">
        <FeeStats
          feeStructures={[]}
          feeReceipts={studentFeesData?.data?.feeReceipts || []}
          isStudent={true}
          loading={isStudentFeesLoading}
        />

        <StudentFeeDashboard
          receipts={studentFeesData?.data?.feeReceipts || []}
          loading={isStudentFeesLoading}
          createPaymentOrder={createPaymentOrder}
          verifyPayment={verifyPayment}
          openReceiptModal={openReceiptModal}
          currentPage={page}
          totalPages={studentFeesData?.data?.meta?.totalPages}
          onPageChange={setPage}
          totalCount={studentFeesData?.data?.meta?.totalCount}
          limit={limit}
        />

        <TransactionDetailsModal
          isOpen={isReceiptModalOpen}
          onClose={() => {
            setIsReceiptModalOpen(false);
            setSelectedReceipt(null);
          }}
          receipt={selectedReceipt}
        />
      </div>
    );
  }

  // Render Administrator view
  return (
    <div className="w-full space-y-6">
      {/* Metrics */}
      <FeeStats
        feeStructures={feeStructuresData?.data?.feeStructures || []}
        isStudent={false}
        loading={isFeeStructuresLoading}
      />

      {/* Sub-tab Switcher */}
      <div className="flex gap-2 pb-px">
        <button
          onClick={() => setActiveSubTab("structures")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeSubTab === "structures"
              ? "border-primary-600 text-primary-600 font-extrabold"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Fee Structures Registry
        </button>
        <button
          onClick={() => setActiveSubTab("allocations")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeSubTab === "allocations"
              ? "border-primary-600 text-primary-600 font-extrabold"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Allocate / Assign Fee
        </button>
      </div>

      {activeSubTab === "structures" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div>
              <h3 className="font-bold text-gray-800 text-base">
                Fee Structures Directory
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                View or create academic structure dues.
              </p>
            </div>
            {isSuperAdmin && (
              <button
                onClick={openCreateModal}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg shadow-primary-200 hover:shadow-xl shrink-0"
              >
                <FiPlus size={16} />
                <span>Create Fee Structure</span>
              </button>
            )}
          </div>

          <FeeStructureTable
            feeStructures={feeStructuresData?.data?.feeStructures || []}
            loading={isFeeStructuresLoading}
            fetching={isFeeStructuresFetching}
            isSuperAdmin={isSuperAdmin}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            currentPage={page}
            totalPages={feeStructuresData?.data?.meta?.totalPages}
            onPageChange={setPage}
            totalCount={feeStructuresData?.data?.meta?.totalCount}
            limit={limit}
          />
        </div>
      ) : (
        <div className="max-w-2xl">
          <FeeAssignmentPanel
            feeStructures={feeStructuresData?.data?.feeStructures || []}
            assignFee={assignFee}
            isAssigning={isAssigning}
            isSuperAdmin={isSuperAdmin}
            currentUser={currentUser}
          />
        </div>
      )}

      {/* warning modal for deletion */}
      {isDeleteModalOpen && selectedFee && (
        <WarningModal
          title="Confirm Fee Structure Deletion"
          description={`Are you sure you want to permanently delete "${selectedFee.title}" (₹${selectedFee.amount.toLocaleString()})? All assigned student fee records linked to this structure will also be removed. This action cannot be undone.`}
          setShowModal={setIsDeleteOpen}
          handleDelete={handleDeleteConfirm}
          isLoading={isDeleting}
        />
      )}

      {/* Form Modal for Creating/Editing */}
      <FeeStructureFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedFee(null);
        }}
        editMode={editMode}
        selectedFee={selectedFee}
        createFeeStructure={createFeeStructure}
        updateFeeStructure={updateFeeStructure}
        courses={coursesData?.data?.courses || []}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default FeeManagement;

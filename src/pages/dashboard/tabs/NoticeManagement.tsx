import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import {
  useGetNoticesQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} from "@store/api/noticeApi";
import { useUploadFileMutation } from "@store/api/userApi";
import { Institute, Notice } from "@type/dataTypes";
import { toast } from "react-toastify";
import WarningModal from "@components/ui/WarningModal";

// Modular Sub-components
import { NoticeStats } from "./components/NoticeStats";
import { NoticeFilterBar } from "./components/NoticeFilterBar";
import { NoticeTable } from "./components/NoticeTable";
import { NoticeDetailsModal } from "./components/NoticeDetailsModal";
import { NoticeFormModal } from "./components/NoticeFormModal";

const NoticeManagement: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
  const isAdmin = currentUser?.role === "ADMIN";
  const canCreate = isSuperAdmin || isAdmin;

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [instituteFilter, setInstituteFilter] = useState<
    Institute | "GLOBAL" | ""
  >("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Reset page when filter changes
  React.useEffect(() => {
    setPage(1);
  }, [instituteFilter]);

  // RTK Query API Hooks
  const queryParam: any = { page, limit };
  if (instituteFilter && instituteFilter !== "GLOBAL") {
    queryParam.institute = instituteFilter;
  }

  const {
    data: noticesData,
    isLoading: noticesLoading,
    isFetching: noticesFetching,
  } = useGetNoticesQuery(queryParam);

  const [createNotice, { isLoading: isCreating }] = useCreateNoticeMutation();
  const [updateNotice, { isLoading: isUpdating }] = useUpdateNoticeMutation();
  const [deleteNotice, { isLoading: isDeleting }] = useDeleteNoticeMutation();
  const [uploadFile] = useUploadFileMutation();

  // Local filter for search and GLOBAL targeting
  const filteredNotices =
    noticesData?.data?.notices?.filter((n) => {
      // Filter by institute if "GLOBAL" selected
      if (instituteFilter === "GLOBAL" && n.institute !== null) {
        return false;
      }
      // Filter by search term
      return n.title.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];

  // Open Create Modal
  const openCreateModal = () => {
    setSelectedNotice(null);
    setEditMode(false);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setEditMode(true);
    setIsCreateModalOpen(true);
  };

  // Open View Modal
  const openViewModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsViewModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsDeleteModalOpen(true);
  };

  // Delete Notice Action
  const handleDeleteNotice = async () => {
    if (!selectedNotice) return;
    try {
      await deleteNotice(selectedNotice.id).unwrap();
      toast.success("Notice deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedNotice(null);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message || "Failed to delete notice.";
      toast.error(msg);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Upper Stats Row */}
      <NoticeStats
        notices={noticesData?.data?.notices || []}
        loading={noticesLoading}
      />

      {/* Filter / Control Panel */}
      <NoticeFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        instituteFilter={instituteFilter}
        setInstituteFilter={setInstituteFilter}
        openCreateModal={openCreateModal}
        canCreate={canCreate}
      />

      {/* Notice Database Table */}
      <NoticeTable
        notices={filteredNotices}
        loading={noticesLoading}
        fetching={noticesFetching}
        canCreate={canCreate}
        currentUser={currentUser}
        isSuperAdmin={isSuperAdmin}
        openViewModal={openViewModal}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        currentPage={page}
        totalPages={noticesData?.data?.meta?.totalPages}
        onPageChange={setPage}
        totalCount={noticesData?.data?.meta?.totalCount}
        limit={limit}
      />

      {/* Warning Modal for deletion */}
      {isDeleteModalOpen && selectedNotice && (
        <WarningModal
          title="Confirm Notice Deletion"
          description={`Are you sure you want to permanently delete the notice "${selectedNotice.title}"? This action cannot be undone.`}
          setShowModal={setIsDeleteModalOpen}
          handleDelete={handleDeleteNotice}
          isLoading={isDeleting}
        />
      )}

      {/* View Notice Details Modal */}
      <NoticeDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedNotice(null);
        }}
        notice={selectedNotice}
      />

      {/* Create / Edit Notice Modal */}
      <NoticeFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedNotice(null);
        }}
        editMode={editMode}
        selectedNotice={selectedNotice}
        createNotice={createNotice}
        updateNotice={updateNotice}
        uploadFile={uploadFile}
        currentUser={currentUser}
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default NoticeManagement;

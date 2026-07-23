import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useUploadFileMutation,
  useGetCoursesQuery,
} from "../../../store/api/userApi";
import { Role, Institute, User } from "../../../types/dataTypes";
import { toast } from "react-toastify";
import WarningModal from "../../../components/ui/WarningModal";

// Modular Sub-components
import { UserStats } from "./components/UserStats";
import { UserFilterBar } from "./components/UserFilterBar";
import { UserTable } from "./components/UserTable";
import { UserDetailsModal } from "./components/UserDetailsModal";
import { UserFormModal } from "./components/UserFormModal";

const UserManagement: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
  const isAdmin = currentUser?.role === "ADMIN";

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [instituteFilter, setInstituteFilter] = useState<Institute | "">("");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Search debounce ref
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // RTK Query API Hooks
  const {
    data: usersData,
    isLoading: usersLoading,
    isFetching: usersFetching,
  } = useGetUsersQuery({
    role: roleFilter || undefined,
    institute: isSuperAdmin
      ? instituteFilter || undefined
      : currentUser?.adminProfile?.institute || undefined,
    includeDeleted:
      currentUser?.role === "SUPER_ADMIN" ? includeDeleted : undefined,
    search: debouncedSearch || undefined,
  });

  const { data: coursesData } = useGetCoursesQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [restoreUser] = useRestoreUserMutation();
  const [uploadFile] = useUploadFileMutation();

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setSelectedUser(null);
    setEditMode(false);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditMode(true);
    setIsCreateModalOpen(true);
  };

  // Open View Modal
  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Delete User Action
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id).unwrap();
      toast.success("User deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      const msg = error?.data?.message || "Failed to delete user.";
      toast.error(msg);
    }
  };

  // Restore User Action
  const handleRestoreUser = async (userId: string) => {
    try {
      await restoreUser(userId).unwrap();
      toast.success("User restored successfully.");
    } catch (error: any) {
      const msg = error?.data?.message || "Failed to restore user.";
      toast.error(msg);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Upper Stats Row */}
      <UserStats users={usersData?.data || []} loading={usersLoading} />

      {/* Main Filter / Control Panel */}
      <UserFilterBar
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        instituteFilter={instituteFilter}
        setInstituteFilter={setInstituteFilter}
        includeDeleted={includeDeleted}
        setIncludeDeleted={setIncludeDeleted}
        handleSearchChange={handleSearchChange}
        openCreateModal={openCreateModal}
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
        currentUser={currentUser}
      />

      {/* Users Database Table */}
      <UserTable
        users={usersData?.data || []}
        loading={usersLoading}
        fetching={usersFetching}
        currentUser={currentUser}
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
        openViewModal={openViewModal}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        handleRestoreUser={handleRestoreUser}
      />

      {/* Warning Modal for deletion */}
      {isDeleteModalOpen && selectedUser && (
        <WarningModal
          title="Confirm Soft Delete"
          description={`Are you sure you want to deactivate the user profile for ${
            selectedUser.superAdminProfile?.name ||
            selectedUser.adminProfile?.name ||
            selectedUser.facultyProfile?.name ||
            selectedUser.studentProfile?.name ||
            "this user"
          }? This will hide the profile from listing directories.`}
          setShowModal={setIsDeleteModalOpen}
          handleDelete={handleDeleteUser}
          isLoading={isDeleting}
        />
      )}

      {/* View User Details Modal */}
      <UserDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Create / Edit User Multi-step Modal Form */}
      <UserFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedUser(null);
        }}
        editMode={editMode}
        selectedUser={selectedUser}
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
        currentUser={currentUser}
        coursesData={coursesData}
        createUser={createUser}
        updateUser={updateUser}
        uploadFile={uploadFile}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default UserManagement;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from "../../../store/api/subjectApi";
import { useGetCoursesQuery } from "../../../store/api/courseApi";
import { Institute, Subject } from "../../../types/dataTypes";
import { toast } from "react-toastify";
import WarningModal from "../../../components/ui/WarningModal";

// Modular Sub-components
import { SubjectStats } from "./components/SubjectStats";
import { SubjectFilterBar } from "./components/SubjectFilterBar";
import { SubjectTable } from "./components/SubjectTable";
import { SubjectDetailsModal } from "./components/SubjectDetailsModal";
import { SubjectFormModal } from "./components/SubjectFormModal";

const SubjectManagement: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
  const isAdmin = currentUser?.role === "ADMIN";

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [instituteFilter, setInstituteFilter] = useState<Institute | "">("");
  const [courseFilter, setCourseFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Reset page when filter changes
  React.useEffect(() => {
    setPage(1);
  }, [instituteFilter, courseFilter, semesterFilter]);

  // RTK Query API Hooks
  const queryParams: any = { page, limit };
  if (instituteFilter) queryParams.institute = instituteFilter;
  if (courseFilter) queryParams.courseId = courseFilter;
  if (semesterFilter) queryParams.semester = Number(semesterFilter);

  const {
    data: subjectsData,
    isLoading: subjectsLoading,
    isFetching: subjectsFetching,
  } = useGetSubjectsQuery(queryParams);

  // Load all courses for dropdowns
  const { data: coursesData } = useGetCoursesQuery();

  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();
  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

  // Local filter for search term (code or name)
  const filteredSubjects =
    subjectsData?.data?.subjects?.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  // Open Create Modal
  const openCreateModal = () => {
    setSelectedSubject(null);
    setEditMode(false);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (subject: Subject) => {
    setSelectedSubject(subject);
    setEditMode(true);
    setIsCreateModalOpen(true);
  };

  // Open View Modal
  const openViewModal = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsViewModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsDeleteModalOpen(true);
  };

  // Delete Subject Action
  const handleDeleteSubject = async () => {
    if (!selectedSubject) return;
    try {
      await deleteSubject(selectedSubject.id).unwrap();
      toast.success("Subject deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedSubject(null);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message || "Failed to delete subject.";
      toast.error(msg);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Upper Stats Row */}
      <SubjectStats
        subjects={subjectsData?.data?.subjects || []}
        loading={subjectsLoading}
      />

      {/* Filter / Control Panel */}
      <SubjectFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        instituteFilter={instituteFilter}
        setInstituteFilter={setInstituteFilter}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        semesterFilter={semesterFilter}
        setSemesterFilter={setSemesterFilter}
        openCreateModal={openCreateModal}
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
        currentUser={currentUser}
        courses={coursesData?.data?.courses || []}
      />

      {/* Subject Database Table */}
      <SubjectTable
        subjects={filteredSubjects}
        loading={subjectsLoading}
        fetching={subjectsFetching}
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
        currentUser={currentUser}
        openViewModal={openViewModal}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        currentPage={page}
        totalPages={subjectsData?.data?.meta?.totalPages}
        onPageChange={setPage}
        totalCount={subjectsData?.data?.meta?.totalCount}
        limit={limit}
      />

      {/* Warning Modal for deletion */}
      {isDeleteModalOpen && selectedSubject && (
        <WarningModal
          title="Confirm Subject Deletion"
          description={`Are you sure you want to permanently delete the subject "${selectedSubject.name}" (${selectedSubject.code})? This action cannot be undone.`}
          setShowModal={setIsDeleteModalOpen}
          handleDelete={handleDeleteSubject}
          isLoading={isDeleting}
        />
      )}

      {/* View Subject Details Modal */}
      <SubjectDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSubject(null);
        }}
        subject={selectedSubject}
      />

      {/* Create / Edit Subject Modal */}
      <SubjectFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedSubject(null);
        }}
        editMode={editMode}
        selectedSubject={selectedSubject}
        createSubject={createSubject}
        updateSubject={updateSubject}
        courses={coursesData?.data?.courses || []}
        currentUser={currentUser}
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default SubjectManagement;

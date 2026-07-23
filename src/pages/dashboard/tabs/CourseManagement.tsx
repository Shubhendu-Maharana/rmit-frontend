import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "../../../store/api/courseApi";
import { Institute, Course } from "../../../types/dataTypes";
import { toast } from "react-toastify";
import WarningModal from "../../../components/ui/WarningModal";

// Modular Sub-components
import { CourseStats } from "./components/CourseStats";
import { CourseFilterBar } from "./components/CourseFilterBar";
import { CourseTable } from "./components/CourseTable";
import { CourseDetailsModal } from "./components/CourseDetailsModal";
import { CourseFormModal } from "./components/CourseFormModal";

const CourseManagement: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [instituteFilter, setInstituteFilter] = useState<Institute | "">("");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editMode, setEditMode] = useState(false);

  // RTK Query API Hooks
  const {
    data: coursesData,
    isLoading: coursesLoading,
    isFetching: coursesFetching,
  } = useGetCoursesQuery(
    instituteFilter ? { institute: instituteFilter } : undefined,
  );

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  // Filter courses locally by search term
  const filteredCourses =
    coursesData?.data?.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description &&
          c.description.toLowerCase().includes(searchTerm.toLowerCase())),
    ) || [];

  // Open Create Modal
  const openCreateModal = () => {
    setSelectedCourse(null);
    setEditMode(false);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setEditMode(true);
    setIsCreateModalOpen(true);
  };

  // Open View Modal
  const openViewModal = (course: Course) => {
    setSelectedCourse(course);
    setIsViewModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  // Delete Course Action
  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    try {
      await deleteCourse(selectedCourse.id).unwrap();
      toast.success("Course deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedCourse(null);
    } catch (error: any) {
      const msg = error?.data?.message || "Failed to delete course.";
      toast.error(msg);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Upper Stats Row */}
      <CourseStats courses={coursesData?.data || []} loading={coursesLoading} />

      {/* Filter / Control Panel */}
      <CourseFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        instituteFilter={instituteFilter}
        setInstituteFilter={setInstituteFilter}
        openCreateModal={openCreateModal}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Course Database Table */}
      <CourseTable
        courses={filteredCourses}
        loading={coursesLoading}
        fetching={coursesFetching}
        isSuperAdmin={isSuperAdmin}
        openViewModal={openViewModal}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />

      {/* Warning Modal for deletion */}
      {isDeleteModalOpen && selectedCourse && (
        <WarningModal
          title="Confirm Course Deletion"
          description={`Are you sure you want to permanently delete the course "${selectedCourse.name}"? This action cannot be undone.`}
          setShowModal={setIsDeleteModalOpen}
          handleDelete={handleDeleteCourse}
          isLoading={isDeleting}
        />
      )}

      {/* View Course Details Modal */}
      <CourseDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
      />

      {/* Create / Edit Course Modal */}
      <CourseFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedCourse(null);
        }}
        editMode={editMode}
        selectedCourse={selectedCourse}
        createCourse={createCourse}
        updateCourse={updateCourse}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default CourseManagement;

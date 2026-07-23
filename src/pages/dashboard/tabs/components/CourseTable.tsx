import React from "react";
import { FiEye, FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { Course } from "../../../../types/dataTypes";
import SkeletonTable from "../../../../components/ui/SkeletonTable";

interface CourseTableProps {
  courses: Course[];
  loading: boolean;
  fetching: boolean;
  isSuperAdmin: boolean;
  openViewModal: (course: Course) => void;
  openEditModal: (course: Course) => void;
  openDeleteModal: (course: Course) => void;
}

export const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  loading,
  fetching,
  isSuperAdmin,
  openViewModal,
  openEditModal,
  openDeleteModal,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-150">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Course Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Course ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Institute
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-gray-700 text-sm">
            {loading ? (
              <SkeletonTable rows={5} columns={5} />
            ) : courses.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No courses found matching filters or criteria.
                </td>
              </tr>
            ) : (
              courses.map((courseItem) => (
                <tr
                  key={courseItem.id}
                  className="hover:bg-gray-50/50 transition-colors duration-200"
                >
                  {/* Course Name Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-800">
                      {courseItem.name}
                    </div>
                  </td>

                  {/* Course ID Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">
                    {courseItem.id}
                  </td>

                  {/* Institute Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${
                        courseItem.institute === "RMIT"
                          ? "bg-blue-100 text-blue-700"
                          : courseItem.institute === "RMITC"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {courseItem.institute === "RMIT"
                        ? "RMIT (Graduation)"
                        : courseItem.institute === "RMITC"
                          ? "RMITC (ITI)"
                          : "HIT (Diploma)"}
                    </span>
                  </td>

                  {/* Description Column */}
                  <td className="px-6 py-4 max-w-xs truncate text-gray-500">
                    {courseItem.description || "No description provided."}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openViewModal(courseItem)}
                        title="View Course Details"
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                      >
                        <FiEye size={16} />
                      </button>

                      {isSuperAdmin && (
                        <>
                          <button
                            onClick={() => openEditModal(courseItem)}
                            title="Edit Course"
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-600 transition-colors cursor-pointer"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(courseItem)}
                            title="Delete Course"
                            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {fetching && !loading && (
        <div className="bg-gray-50 py-2 text-center text-xs font-semibold text-primary-600 flex items-center justify-center gap-2">
          <FiRefreshCw className="animate-spin" />
          <span>Updating list...</span>
        </div>
      )}
    </div>
  );
};

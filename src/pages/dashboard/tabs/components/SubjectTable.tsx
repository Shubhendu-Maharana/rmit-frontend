import React from "react";
import { FiEye, FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { Subject, User } from "../../../../types/dataTypes";
import SkeletonTable from "../../../../components/ui/SkeletonTable";

interface SubjectTableProps {
  subjects: Subject[];
  loading: boolean;
  fetching: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  currentUser: User | null;
  openViewModal: (subject: Subject) => void;
  openEditModal: (subject: Subject) => void;
  openDeleteModal: (subject: Subject) => void;
}

export const SubjectTable: React.FC<SubjectTableProps> = ({
  subjects,
  loading,
  fetching,
  isSuperAdmin,
  isAdmin,
  currentUser,
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
                Subject Title / Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Course Allocation
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Institute
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Credits
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Semester / Year
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-gray-700 text-sm">
            {loading ? (
              <SkeletonTable rows={5} columns={6} />
            ) : subjects.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No subjects registered or found matching criteria.
                </td>
              </tr>
            ) : (
              subjects.map((subjectItem) => {
                const institute = subjectItem.course?.institute || "GLOBAL";
                const canModify =
                  isSuperAdmin ||
                  (isAdmin &&
                    institute === currentUser?.adminProfile?.institute);

                return (
                  <tr
                    key={subjectItem.id}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    {/* Subject Info Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-gray-800">
                          {subjectItem.name}
                        </div>
                        <div className="text-xs font-mono text-gray-400 mt-0.5">
                          Code: {subjectItem.code}
                        </div>
                      </div>
                    </td>

                    {/* Course Column */}
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-600">
                      {subjectItem.course?.name || "N/A"}
                    </td>

                    {/* Institute Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${
                          institute === "RMIT"
                            ? "bg-blue-100 text-blue-700"
                            : institute === "RMITC"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {institute}
                      </span>
                    </td>

                    {/* Credits Column */}
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">
                      {subjectItem.credits}
                    </td>

                    {/* Semester / Year Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                      Sem {subjectItem.semester} / {subjectItem.academicYear}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(subjectItem)}
                          title="View Subject Details"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                        >
                          <FiEye size={16} />
                        </button>

                        {canModify && (
                          <>
                            <button
                              onClick={() => openEditModal(subjectItem)}
                              title="Edit Subject"
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-600 transition-colors cursor-pointer"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(subjectItem)}
                              title="Delete Subject"
                              className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
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

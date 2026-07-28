import React from "react";
import { FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { FeeStructure } from "../../../../store/api/feeApi";
import SkeletonTable from "../../../../components/ui/SkeletonTable";
import { Pagination } from "../../../../components/ui/Pagination";

interface FeeStructureTableProps {
  feeStructures: FeeStructure[];
  loading: boolean;
  fetching: boolean;
  isSuperAdmin: boolean;
  openEditModal: (fee: FeeStructure) => void;
  openDeleteModal: (fee: FeeStructure) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number;
  limit?: number;
}

export const FeeStructureTable: React.FC<FeeStructureTableProps> = ({
  feeStructures,
  loading,
  fetching,
  isSuperAdmin,
  openEditModal,
  openDeleteModal,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  limit,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-150">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Fee Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Course Specification
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                Semester / Year
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                Amount (INR)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Due Date
              </th>
              {isSuperAdmin && (
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-gray-700 text-sm">
            {loading ? (
              <SkeletonTable rows={4} columns={isSuperAdmin ? 6 : 5} />
            ) : feeStructures.length === 0 ? (
              <tr>
                <td
                  colSpan={isSuperAdmin ? 6 : 5}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No fee structures created yet.
                </td>
              </tr>
            ) : (
              feeStructures.map((fee) => (
                <tr
                  key={fee.id}
                  className="hover:bg-gray-50/50 transition-colors duration-200"
                >
                  {/* Fee Title */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-800">
                      {fee.title}
                    </div>
                  </td>

                  {/* Course Name */}
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-605">
                    {fee.course?.name || "N/A"}
                  </td>

                  {/* Semester / Year */}
                  <td className="px-6 py-4 text-center whitespace-nowrap text-gray-550 font-medium">
                    Sem {fee.semester} / {fee.academicYear}
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-gray-800">
                    ₹{fee.amount.toLocaleString()}
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-505 font-medium">
                    {new Date(fee.dueDate).toLocaleDateString()}
                  </td>

                  {/* Actions (Super Admin only) */}
                  {isSuperAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(fee)}
                          title="Edit Structure"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-505 hover:text-primary-600 transition-colors cursor-pointer"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(fee)}
                          title="Delete Structure"
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-450 hover:text-red-650 transition-colors cursor-pointer"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {fetching && !loading && (
        <div className="bg-gray-50 py-2 text-center text-xs font-semibold text-primary-600 flex items-center justify-center gap-2">
          <FiRefreshCw className="animate-spin" />
          <span>Updating structures...</span>
        </div>
      )}
      {currentPage !== undefined &&
        totalPages !== undefined &&
        onPageChange !== undefined &&
        totalCount !== undefined &&
        limit !== undefined && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalCount={totalCount}
            limit={limit}
            loading={fetching}
          />
        )}
    </div>
  );
};

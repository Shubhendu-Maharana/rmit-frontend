import React from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiDownload,
} from "react-icons/fi";
import { Notice, User } from "../../../../types/dataTypes";
import SkeletonTable from "../../../../components/ui/SkeletonTable";

interface NoticeTableProps {
  notices: Notice[];
  loading: boolean;
  fetching: boolean;
  canCreate: boolean;
  currentUser: User | null;
  isSuperAdmin: boolean;
  openViewModal: (notice: Notice) => void;
  openEditModal: (notice: Notice) => void;
  openDeleteModal: (notice: Notice) => void;
}

export const NoticeTable: React.FC<NoticeTableProps> = ({
  notices,
  loading,
  fetching,
  canCreate,
  currentUser,
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
                Notice Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Publish Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Target Audience
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-gray-700 text-sm">
            {loading ? (
              <SkeletonTable rows={5} columns={4} />
            ) : notices.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No notices published or found.
                </td>
              </tr>
            ) : (
              notices.map((noticeItem) => {
                const canModify =
                  isSuperAdmin ||
                  (canCreate &&
                    noticeItem.institute ===
                      currentUser?.adminProfile?.institute);

                return (
                  <tr
                    key={noticeItem.id}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    {/* Notice Title Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-800">
                        {noticeItem.title}
                      </div>
                    </td>

                    {/* Publish Date Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                      {new Date(noticeItem.createdAt).toLocaleDateString()}
                    </td>

                    {/* Target Audience Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${
                          !noticeItem.institute
                            ? "bg-purple-100 text-purple-700"
                            : noticeItem.institute === "RMIT"
                              ? "bg-blue-100 text-blue-700"
                              : noticeItem.institute === "RMITC"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {noticeItem.institute
                          ? `${noticeItem.institute} Institute`
                          : "Global (All)"}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(noticeItem)}
                          title="View Notice Details"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                        >
                          <FiEye size={16} />
                        </button>
                        {noticeItem.fileUrl && (
                          <a
                            href={noticeItem.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            title="Download PDF Notice"
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                          >
                            <FiDownload size={16} />
                          </a>
                        )}

                        {canModify && (
                          <>
                            <button
                              onClick={() => openEditModal(noticeItem)}
                              title="Edit Notice"
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-600 transition-colors cursor-pointer"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(noticeItem)}
                              title="Delete Notice"
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

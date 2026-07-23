import React from "react";
import { FiEye, FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { User } from "../../../../types/dataTypes";
import SkeletonTable from "../../../../components/ui/SkeletonTable";

interface UserTableProps {
  users: User[];
  loading: boolean;
  fetching: boolean;
  currentUser: any;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  openViewModal: (user: User) => void;
  openEditModal: (user: User) => void;
  openDeleteModal: (user: User) => void;
  handleRestoreUser: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  fetching,
  currentUser,
  isSuperAdmin,
  isAdmin,
  openViewModal,
  openEditModal,
  openDeleteModal,
  handleRestoreUser,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-150">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                User Info
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Unique ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Institute
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-gray-700 text-sm">
            {loading ? (
              <SkeletonTable rows={5} columns={6} />
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No users found matching filters or criteria.
                </td>
              </tr>
            ) : (
              users.map((userItem) => {
                const profile =
                  userItem.superAdminProfile ||
                  userItem.adminProfile ||
                  userItem.facultyProfile ||
                  userItem.studentProfile;
                const profileInstitute =
                  userItem.adminProfile?.institute ||
                  userItem.facultyProfile?.institute ||
                  userItem.studentProfile?.institute ||
                  null;

                return (
                  <tr
                    key={userItem.id}
                    className={`hover:bg-gray-50/50 transition-colors duration-200 ${
                      userItem.isDeleted ? "bg-red-50/20" : ""
                    }`}
                  >
                    {/* User Info Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {profile?.photo ? (
                          <img
                            src={profile.photo}
                            alt={profile.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 text-white flex items-center justify-center font-bold shadow-sm">
                            {profile?.name
                              ? profile.name.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-800">
                            {profile?.name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {userItem.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Unique ID Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-mono text-xs">
                      {userItem.rollNumber || userItem.id.substring(0, 8)}
                    </td>

                    {/* Role Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${
                          userItem.role === "SUPER_ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : userItem.role === "ADMIN"
                              ? "bg-blue-100 text-blue-700"
                              : userItem.role === "FACULTY"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {userItem.role.replace("_", " ")}
                      </span>
                    </td>

                    {/* Institute Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                      {profileInstitute || "GLOBAL"}
                    </td>

                    {/* Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          userItem.isDeleted
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {userItem.isDeleted ? "Deleted" : "Active"}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(userItem)}
                          title="View Full Profile"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                        >
                          <FiEye size={16} />
                        </button>

                        {/* Super Admin can modify anything; Admin can only modify faculty/student from their own institute */}
                        {!userItem.isDeleted &&
                          (isSuperAdmin ||
                            (isAdmin &&
                              (userItem.role === "FACULTY" ||
                                userItem.role === "STUDENT") &&
                              profileInstitute ===
                                currentUser?.adminProfile?.institute)) && (
                            <button
                              onClick={() => openEditModal(userItem)}
                              title="Edit User Profile"
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-600 transition-colors cursor-pointer"
                            >
                              <FiEdit2 size={16} />
                            </button>
                          )}

                        {userItem.isDeleted && isSuperAdmin ? (
                          <button
                            onClick={() => handleRestoreUser(userItem.id)}
                            title="Restore User Account"
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-500 hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            <FiRefreshCw
                              className="animate-hover-spin"
                              size={16}
                            />
                          </button>
                        ) : (
                          /* Super Admin can delete anyone except self; Admin can delete faculty/students within own institute */
                          userItem.id !== currentUser?.id &&
                          (isSuperAdmin ||
                            (isAdmin &&
                              (userItem.role === "FACULTY" ||
                                userItem.role === "STUDENT") &&
                              profileInstitute ===
                                currentUser?.adminProfile?.institute)) && (
                            <button
                              onClick={() => openDeleteModal(userItem)}
                              title="Deactivate User (Soft Delete)"
                              className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )
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

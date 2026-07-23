import React from "react";
import { FiSearch, FiFilter, FiPlus } from "react-icons/fi";
import { Role, Institute } from "../../../../types/dataTypes";

interface UserFilterBarProps {
  searchTerm: string;
  roleFilter: Role | "";
  setRoleFilter: (role: Role | "") => void;
  instituteFilter: Institute | "";
  setInstituteFilter: (inst: Institute | "") => void;
  includeDeleted: boolean;
  setIncludeDeleted: (val: boolean) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openCreateModal: () => void;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  currentUser: any;
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  searchTerm,
  roleFilter,
  setRoleFilter,
  instituteFilter,
  setInstituteFilter,
  includeDeleted,
  setIncludeDeleted,
  handleSearchChange,
  openCreateModal,
  isSuperAdmin,
  isAdmin,
  currentUser,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiSearch />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search email, roll, name..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiFilter />
            </span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | "")}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-255 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer"
            >
              <option value="">All Roles</option>
              {isSuperAdmin && (
                <>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                </>
              )}
              <option value="FACULTY">Faculty</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>

          {/* Institute Filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiFilter />
            </span>
            <select
              disabled={!isSuperAdmin}
              value={
                isSuperAdmin
                  ? instituteFilter
                  : currentUser?.adminProfile?.institute || ""
              }
              onChange={(e) =>
                setInstituteFilter(e.target.value as Institute | "")
              }
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-255 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {isSuperAdmin ? (
                <>
                  <option value="">All Institutes</option>
                  <option value="RMIT">RMIT (Graduation)</option>
                  <option value="RMITC">RMITC (ITI)</option>
                  <option value="HIT">HIT (Diploma)</option>
                </>
              ) : (
                currentUser?.adminProfile?.institute && (
                  <option value={currentUser.adminProfile.institute}>
                    {currentUser.adminProfile.institute === "RMIT"
                      ? "RMIT (Graduation)"
                      : currentUser.adminProfile.institute === "RMITC"
                        ? "RMITC (ITI)"
                        : currentUser.adminProfile.institute === "HIT"
                          ? "HIT (Diploma)"
                          : currentUser.adminProfile.institute}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Soft Deleted Toggle */}
          {isSuperAdmin && (
            <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-600 select-none justify-self-start sm:justify-self-center lg:justify-self-start h-full">
              <input
                type="checkbox"
                checked={includeDeleted}
                onChange={(e) => setIncludeDeleted(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
              Show Deleted Users
            </label>
          )}
        </div>

        {/* Right Action Trigger */}
        {(isSuperAdmin || isAdmin) && (
          <button
            onClick={openCreateModal}
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg shadow-primary-200 hover:shadow-xl self-start md:self-center shrink-0"
          >
            <FiPlus size={18} />
            <span>Add User</span>
          </button>
        )}
      </div>
    </div>
  );
};

import React from "react";
import { FiSearch, FiFilter, FiPlus } from "react-icons/fi";
import { Institute } from "../../../../types/dataTypes";

interface NoticeFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  instituteFilter: Institute | "GLOBAL" | "";
  setInstituteFilter: (inst: Institute | "GLOBAL" | "") => void;
  openCreateModal: () => void;
  canCreate: boolean;
}

export const NoticeFilterBar: React.FC<NoticeFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  instituteFilter,
  setInstituteFilter,
  openCreateModal,
  canCreate,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative col-span-1 lg:col-span-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiSearch />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notice title..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>

          {/* Institute Filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiFilter />
            </span>
            <select
              value={instituteFilter}
              onChange={(e) =>
                setInstituteFilter(e.target.value as Institute | "GLOBAL" | "")
              }
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer"
            >
              <option value="">All Notices</option>
              <option value="GLOBAL">Global Only</option>
              <option value="RMIT">RMIT (Graduation)</option>
              <option value="RMITC">RMITC (ITI)</option>
              <option value="HIT">HIT (Diploma)</option>
            </select>
          </div>
        </div>

        {/* Right Action Trigger */}
        {canCreate && (
          <button
            onClick={openCreateModal}
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg shadow-primary-200 hover:shadow-xl self-start md:self-center shrink-0"
          >
            <FiPlus size={18} />
            <span>Publish Notice</span>
          </button>
        )}
      </div>
    </div>
  );
};

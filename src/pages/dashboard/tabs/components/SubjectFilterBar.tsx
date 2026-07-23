import React from "react";
import { FiSearch, FiFilter, FiPlus } from "react-icons/fi";
import { Institute, Course, User } from "../../../../types/dataTypes";

interface SubjectFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  instituteFilter: Institute | "";
  setInstituteFilter: (inst: Institute | "") => void;
  courseFilter: string;
  setCourseFilter: (cId: string) => void;
  semesterFilter: string;
  setSemesterFilter: (sem: string) => void;
  openCreateModal: () => void;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  currentUser: User | null;
  courses: Course[];
}

export const SubjectFilterBar: React.FC<SubjectFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  instituteFilter,
  setInstituteFilter,
  courseFilter,
  setCourseFilter,
  semesterFilter,
  setSemesterFilter,
  openCreateModal,
  isSuperAdmin,
  isAdmin,
  currentUser,
  courses,
}) => {
  const filteredCourses = courses.filter((c) => {
    if (isSuperAdmin) {
      return !instituteFilter || c.institute === instituteFilter;
    }
    return (
      c.institute === currentUser?.adminProfile?.institute ||
      c.institute === currentUser?.facultyProfile?.institute
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiSearch />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subject code or name..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
          />
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
                : currentUser?.adminProfile?.institute ||
                  currentUser?.facultyProfile?.institute ||
                  ""
            }
            onChange={(e) => {
              setInstituteFilter(e.target.value as Institute | "");
              setCourseFilter(""); // Reset course selection when changing institute
            }}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {isSuperAdmin ? (
              <>
                <option value="">All Institutes</option>
                <option value="RMIT">RMIT (Graduation)</option>
                <option value="RMITC">RMITC (ITI)</option>
                <option value="HIT">HIT (Diploma)</option>
              </>
            ) : (
              (currentUser?.adminProfile?.institute ||
                currentUser?.facultyProfile?.institute) && (
                <option
                  value={
                    currentUser?.adminProfile?.institute ||
                    currentUser?.facultyProfile?.institute ||
                    ""
                  }
                >
                  {currentUser?.adminProfile?.institute ||
                    currentUser?.facultyProfile?.institute}
                </option>
              )
            )}
          </select>
        </div>

        {/* Course Filter */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiFilter />
          </span>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer"
          >
            <option value="">All Courses</option>
            {filteredCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiFilter />
          </span>
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem.toString()}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Button Alignment Container */}
      {(isSuperAdmin || isAdmin) && (
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            onClick={openCreateModal}
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg shadow-primary-200 hover:shadow-xl shrink-0"
          >
            <FiPlus size={18} />
            <span>Create Subject</span>
          </button>
        </div>
      )}
    </div>
  );
};

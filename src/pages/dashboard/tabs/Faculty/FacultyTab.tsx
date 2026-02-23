import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiUser,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import FacultyModal from "./FacultyModal";
import supabase from "@services/supabase";
import FacultyRow from "../../../../components/FacultyRow";
import WarningModal from "../../../../components/ui/WarningModal";

type Department = "Degree" | "Diploma" | "ITI" | "";

type Faculty = {
  id: string;
  name: string;
  image: string;
  department: Department;
  specialization: string;
  email: string;
  phone: string;
  education: string;
  is_hod: boolean;
  joining_date: string;
};

const FacultyTab = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState<Faculty>({
    id: "",
    name: "",
    image: "",
    department: "",
    specialization: "",
    email: "",
    phone: "",
    education: "",
    is_hod: false,
    joining_date: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const getFaculties = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from("faculty").select("*");
        if (error) throw error;

        const sortedData = (data || []).sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        setFaculty(sortedData);
        setFilteredFaculty(sortedData);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getFaculties();
  }, []);

  useEffect(() => {
    const filtered = faculty.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().startsWith(searchTerm.toLowerCase());
      const matchesDept =
        departmentFilter === "All Departments" ||
        member.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
    setFilteredFaculty(filtered);
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, faculty]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFaculty.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddFaculty = () => {
    setEditMode(false);
    setCurrentFaculty({
      id: "",
      name: "",
      image: "https://placehold.co/128x128",
      department: "",
      specialization: "",
      email: "",
      phone: "",
      education: "",
      is_hod: false,
      joining_date: new Date().toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const handleEditFaculty = (member: Faculty) => {
    setEditMode(true);
    setCurrentFaculty(member);
    setShowModal(true);
  };

  const handleDeleteFaculty = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("faculty")
        .delete()
        .eq("id", currentFaculty.id);
      if (error) throw error;

      const updatedList = faculty.filter(
        (member) => member.id !== currentFaculty.id,
      );
      setFaculty(updatedList);
    } catch (error) {
      console.error("Error deleting faculty:", error);
    } finally {
      setShowDeleteModal(false);
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode) {
        const { error } = await supabase
          .from("faculty")
          .update(currentFaculty)
          .eq("id", currentFaculty.id);
        if (error) throw error;

        setFaculty((prev) =>
          prev.map((m) => (m.id === currentFaculty.id ? currentFaculty : m)),
        );
      } else {
        const { id, ...facultyData } = currentFaculty;
        const { data, error } = await supabase
          .from("faculty")
          .insert([facultyData])
          .select();
        if (error) throw error;
        if (data) setFaculty((prev) => [...prev, data[0]]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as any;
    const finalValue = type === "checkbox" ? (e.target as any).checked : value;
    setCurrentFaculty({ ...currentFaculty, [name]: finalValue });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1 sm:px-0 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Faculty Directory
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage and view all faculty members across departments.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddFaculty}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-medium cursor-pointer"
        >
          <FiPlus size={20} />
          <span>Add New Faculty</span>
        </motion.button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-56">
            <FiFilter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm outline-none appearance-none cursor-pointer"
            >
              <option>All Departments</option>
              <option>Degree</option>
              <option>Diploma</option>
              <option>ITI</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="space-y-6">
          {/* Desktop Table Skeleton */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Faculty Details
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-100 rounded w-32" />
                          <div className="h-3 bg-gray-100 rounded w-48" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-100 rounded-lg w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-24" />
                        <div className="h-3 bg-gray-100 rounded w-32" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <div className="w-9 h-9 bg-gray-50 rounded-lg" />
                        <div className="w-9 h-9 bg-gray-50 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl shadow-sm" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-100 rounded w-16" />
                      <div className="flex gap-1">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg" />
                        <div className="w-8 h-8 bg-gray-50 rounded-lg" />
                      </div>
                    </div>
                    <div className="h-6 bg-gray-100 rounded w-3/4 mt-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/2 mt-2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3 mt-1" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 space-y-3">
                  <div className="h-3 bg-gray-50 rounded w-full" />
                  <div className="h-3 bg-gray-50 rounded w-2/3" />
                  <div className="h-3 bg-gray-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredFaculty.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-20 text-center border border-gray-100 shadow-sm"
        >
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser size={40} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No Faculty Found
          </h3>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">
            We couldn't find any faculty members matching your search or
            filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setDepartmentFilter("All Departments");
            }}
            className="mt-6 text-primary-600 font-medium hover:underline"
          >
            Clear all filters
          </button>
        </motion.div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Faculty Details
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence mode="sync">
                  {currentItems.map((member) => (
                    <motion.tr
                      key={member.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                          />
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors flex items-center gap-2">
                              {member.name}
                              {member.is_hod && (
                                <span className="bg-primary-100 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  HOD
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            member.department === "Degree"
                              ? "bg-blue-100 text-blue-700"
                              : member.department === "Diploma"
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {member.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">
                          {member.specialization}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {member.education}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditFaculty(member)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentFaculty(member);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Grid View */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-5"
          >
            {currentItems.map((member) => (
              <FacultyRow
                key={member.id}
                member={member}
                handleEditFaculty={handleEditFaculty}
                handleDeleteFaculty={() => {
                  setCurrentFaculty(member);
                  setShowDeleteModal(true);
                }}
              />
            ))}
          </motion.div>

          {/* Pagination Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 gap-4 mt-6">
            <p className="text-sm text-gray-500 font-medium italic">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredFaculty.length)} of{" "}
              {filteredFaculty.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FiChevronLeft size={20} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                      currentPage === i + 1
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-100"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal Integration */}
      <AnimatePresence>
        {showModal && (
          <FacultyModal
            editMode={editMode}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            currentFaculty={currentFaculty}
            setShowModal={setShowModal}
          />
        )}
        {showDeleteModal && (
          <WarningModal
            title="Delete Faculty"
            description="Are you sure you want to delete this faculty member?"
            setShowModal={setShowDeleteModal}
            handleDelete={handleDeleteFaculty}
            isLoading={isDeleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FacultyTab;

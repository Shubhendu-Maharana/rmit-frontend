import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import FacultyModal from "./FacultyModal";
import supabase from "../../../../supabase";
import FacultyRow from "../../../../components/FacultyRow";

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
  // State for search and filters
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // State for modal
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

  useEffect(() => {
    const getFaculties = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from("faculty").select("*");
        if (error) {
          throw error;
        } else {
          setFaculty(data.sort((a, b) => a.name.localeCompare(b.name)));
          setFilteredFaculty(data.sort((a, b) => a.name.localeCompare(b.name)));
        }
      } catch (error) {
        console.log("Error fetching faculties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getFaculties();
  }, []);

  // Filter faculty based on search term and filters
  useEffect(() => {
    const filtered = faculty.filter((member) => {
      return (
        member.name.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
        (departmentFilter === "All Departments" ||
          member.department === departmentFilter)
      );
    });
    setFilteredFaculty(filtered);
  }, [searchTerm, departmentFilter]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFaculty.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle add new faculty
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
      joining_date: "",
    });
    setShowModal(true);
  };

  // Handle edit faculty
  const handleEditFaculty = (member: Faculty) => {
    setEditMode(true);
    setCurrentFaculty(member);
    setShowModal(true);
  };

  // Handle delete faculty
  const handleDeleteFaculty = async (id: string) => {
    try {
      if (
        window.confirm("Are you sure you want to delete this faculty member?")
      ) {
        const { error } = await supabase.from("faculty").delete().eq("id", id);
        if (error) {
          console.log("Error deleting faculty:", error);
        } else {
          const res = faculty.filter((member) => member.id !== id);
          setFilteredFaculty(res);
          setFaculty(res);
        }
      } else {
        return;
      }
    } catch (error) {
      console.log("Error deleting faculty:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editMode) {
        const { error } = await supabase
          .from("faculty")
          .update(currentFaculty)
          .eq("id", currentFaculty.id);

        if (error) throw error;

        const res = faculty.map((member) =>
          member.id === currentFaculty.id ? currentFaculty : member
        );
        setFilteredFaculty(res);
        setFaculty(res);
      } else {
        const { data, error } = await supabase
          .from("faculty")
          .insert([
            {
              name: currentFaculty.name,
              image: currentFaculty.image,
              department: currentFaculty.department,
              specialization: currentFaculty.specialization,
              email: currentFaculty.email,
              phone: currentFaculty.phone,
              education: currentFaculty.education,
              is_hod: currentFaculty.is_hod,
              joining_date:
                currentFaculty.joining_date.length === 0
                  ? new Date().toISOString().split("T")[0]
                  : currentFaculty.joining_date,
            },
          ])
          .select();

        if (error) throw error;

        setFilteredFaculty([...faculty, data[0]]);
        setFaculty([...faculty, data[0]]);
      }
    } catch (error) {
      console.log("Error submitting form:", error);
    }

    setShowModal(false);
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentFaculty({ ...currentFaculty, [name]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            Faculty Management
          </h2>
          <button
            onClick={handleAddFaculty}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center w-full sm:w-auto justify-center cursor-pointer"
          >
            <FiPlus className="mr-2" />
            Add New Faculty
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 sm:p-6">
        {/* Search and filters */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
          <div className="relative w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <FiSearch size={18} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 p-2 w-full sm:w-auto"
            >
              <option>All Departments</option>
              <option>Degree</option>
              <option>Diploma</option>
              <option>ITI</option>
            </select>
          </div>
        </div>

        {/* Faculty table */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Department
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Position
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Joined
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No faculty members found
                  </td>
                </tr>
              ) : (
                (currentItems ?? []).map((member) => (
                  <FacultyRow
                    member={member}
                    key={member.id}
                    handleEditFaculty={handleEditFaculty}
                    handleDeleteFaculty={handleDeleteFaculty}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastItem, filteredFaculty.length)}
            </span>{" "}
            of <span className="font-medium">{filteredFaculty.length}</span>{" "}
            faculty members
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border border-gray-300 rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <FiChevronLeft />
            </button>
            {[...Array(Math.min(totalPages, 3)).keys()].map((number) => {
              const pageNumber = number + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`px-3 py-1 border border-gray-300 rounded-md cursor-pointer ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            {totalPages > 3 && (
              <button className="px-3 py-1 border border-gray-300 rounded-md">
                ...
              </button>
            )}
            {totalPages > 3 && (
              <button
                onClick={() => paginate(totalPages)}
                className={`px-3 py-1 border border-gray-300 rounded-md cursor-pointer ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                {totalPages}
              </button>
            )}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 border border-gray-300 rounded-md ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for adding/editing faculty */}
      {showModal && (
        <FacultyModal
          editMode={editMode}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          currentFaculty={currentFaculty}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default FacultyTab;

import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import NoticeModal from "./NoticeModal";
import supabase from "@services/supabase";
import NoticeRow from "../../../../components/NoticeRow";

type NoticeCategory = "Academic" | "Administrative" | "Events" | "Exams" | "";

type Notice = {
  id: string;
  title: string;
  date: string;
  category: NoticeCategory;
  file_path: string;
  important: boolean;
};

const NoticesTab = () => {
  // State for search and filters
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Category");
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<Notice>({
    id: "",
    title: "",
    date: "",
    category: "Academic",
    file_path: "",
    important: false,
  });

  useEffect(() => {
    const getNotices = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from("notices").select("*");
        if (error) {
          throw error;
        } else {
          setNotices(data);
          setFilteredNotices(data);
        }
      } catch (error) {
        console.log("Error fetching notices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getNotices();
  }, []);

  // Filter faculty based on search term and filters
  useEffect(() => {
    const filtered = notices.filter((notice) => {
      return (
        notice.title.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
        (categoryFilter === "All Category" ||
          notice.category === categoryFilter)
      );
    });

    setFilteredNotices(filtered);
  }, [notices, searchTerm, categoryFilter]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle add new faculty
  const handleAddFaculty = () => {
    setEditMode(false);
    setCurrentNotice({
      id: "",
      title: "",
      date: "",
      category: "",
      file_path: "",
      important: false,
    });
    setShowModal(true);
  };

  // Handle edit faculty
  const handleEditNotice = (notice: Notice) => {
    setEditMode(true);
    setCurrentNotice(notice);
    setShowModal(true);
  };

  // Handle delete faculty
  const handleDeleteNotice = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this notice?")) {
        const { error } = await supabase.from("notices").delete().eq("id", id);
        if (error) {
          console.log("Error deleting notice:", error);
        } else {
          const res = notices.filter((notice) => notice.id !== id);
          setFilteredNotices(res);
          setNotices(res);
        }
      }
    } catch (error) {
      console.log("Error deleting notice:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode) {
        const { error } = await supabase
          .from("notices")
          .update(currentNotice)
          .eq("id", currentNotice.id);
        if (error) throw error;

        const res = notices.map((notice) =>
          notice.id === currentNotice.id ? currentNotice : notice,
        );

        setFilteredNotices(res);
        setNotices(res);
      } else {
        const { data, error } = await supabase
          .from("notices")
          .insert([
            {
              title: currentNotice.title,
              date: currentNotice.date,
              category: currentNotice.category,
              file_path: currentNotice.file_path,
              important: currentNotice.important,
            },
          ])
          .select();
        if (error) throw error;

        setFilteredNotices([...notices, data[0]]);
        setNotices([...notices, data[0]]);
      }
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      setShowModal(false);
      setCurrentNotice({
        id: "",
        title: "",
        date: "",
        category: "",
        file_path: "",
        important: false,
      });
    }
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCurrentNotice({ ...currentNotice, [name]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Notice Management</h2>
          <button
            onClick={handleAddFaculty}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center w-full sm:w-auto justify-center cursor-pointer"
          >
            <FiPlus className="mr-2" />
            Add New Notice
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
              placeholder="Search notice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 w-full"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <FiSearch size={18} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 p-2 w-full sm:w-auto"
            >
              <option>All Category</option>
              <option>Academic</option>
              <option>Administrative</option>
              <option>Events</option>
              <option>Exams</option>
            </select>
          </div>
        </div>

        {/* Faculty table */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Title
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Catagory
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Important
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  File
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
                    No Notices found
                  </td>
                </tr>
              ) : (
                currentItems.map((notice) => (
                  <NoticeRow
                    key={notice.id}
                    notice={notice}
                    handleDeleteNotice={handleDeleteNotice}
                    handleEditNotice={handleEditNotice}
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
              {Math.min(indexOfLastItem, filteredNotices.length)}
            </span>{" "}
            of <span className="font-medium">{filteredNotices.length}</span>{" "}
            notices
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
                      ? "bg-primary-600 text-white"
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
                    ? "bg-primary-600 text-white"
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
        <NoticeModal
          editMode={editMode}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          currentNotice={currentNotice}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default NoticesTab;

import { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiFileText,
  FiEdit,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import NoticeModal from "./NoticeModal";
import WarningModal from "../../../../components/ui/WarningModal";
import {
  deleteNotice,
  getNotices,
  postNotice,
  updateNotice,
} from "@services/notices";
import { Notice } from "@app/types/dataTypes";
import { toast } from "react-toastify";

const NoticesTab = () => {
  // State for search and filters
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Category");
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [warningModal, setWarningModal] = useState(false);

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
    category: "academic",
    file_path: "",
    important: false,
  });

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        const data = await getNotices();
        setNotices(data);
        setFilteredNotices(data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Filter based on search term and filters
  useEffect(() => {
    const filtered = notices.filter((notice) => {
      const matchesSearch = notice.title
        .toLowerCase()
        .startsWith(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Category" || notice.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    setFilteredNotices(filtered);
    setCurrentPage(1); // Reset to first page whenever filters change
  }, [notices, searchTerm, categoryFilter]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle add new notice
  const handleAddNotice = () => {
    setEditMode(false);
    setCurrentNotice({
      id: "",
      title: "",
      date: new Date().toISOString().split("T")[0],
      category: "academic",
      file_path: "",
      important: false,
    });
    setShowModal(true);
  };

  // Handle edit notice
  const handleEditNotice = (notice: Notice) => {
    setEditMode(true);
    setCurrentNotice(notice);
    setShowModal(true);
  };

  const handleDeleteClick = (notice: Notice) => {
    setCurrentNotice(notice);
    setWarningModal(true);
  };

  // Handle delete notice
  const handleDeleteNotice = async () => {
    try {
      setModalLoading(true);
      await deleteNotice(currentNotice.id);
      const res = notices.filter((notice) => notice.id !== currentNotice.id);
      setFilteredNotices(res);
      setNotices(res);
      toast.success("Notice deleted successfully");
    } catch (error) {
      const errorMessage = (error as Error)?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setModalLoading(false);
      setWarningModal(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      if (editMode) {
        const data = await updateNotice(currentNotice);
        const updatedNotices = notices.map((notice) =>
          notice.id === currentNotice.id ? data : notice,
        );
        setFilteredNotices(updatedNotices);
        setNotices(updatedNotices);
        toast.success("Notice updated successfully");
      } else {
        const data = await postNotice(currentNotice);
        setFilteredNotices([...notices, data]);
        setNotices([...notices, data]);
        toast.success("Notice added successfully");
      }
      setShowModal(false);
    } catch (error) {
      const errorMessage = (error as Error)?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCurrentNotice({ ...currentNotice, [name]: value });
  };

  const handleViewPdf = (filePath: string) => {
    window.open(filePath, "_blank");
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
            Notice Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage announcements and important information.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddNotice}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-medium cursor-pointer"
        >
          <FiPlus size={20} />
          <span>Add New Notice</span>
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
            placeholder="Search by notice title..."
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm outline-none appearance-none cursor-pointer"
            >
              <option>All Category</option>
              <option value="academic">Academic</option>
              <option value="administrative">Administrative</option>
              <option value="events">Events</option>
              <option value="exams">Exams</option>
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
                    Date & Title
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Important
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
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-100 rounded w-48" />
                          <div className="h-3 bg-gray-100 rounded w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-100 rounded-lg w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-100 rounded-lg w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <div className="w-9 h-9 bg-gray-50 rounded-lg" />
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
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/4 mb-4" />
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 bg-gray-100 rounded w-20" />
                  <div className="h-6 bg-gray-100 rounded w-16" />
                </div>
                <div className="pt-4 border-t border-gray-50 flex gap-2">
                  <div className="flex-1 h-9 bg-gray-50 rounded-lg" />
                  <div className="w-9 h-9 bg-gray-50 rounded-lg" />
                  <div className="w-9 h-9 bg-gray-50 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredNotices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-20 text-center border border-gray-100 shadow-sm"
        >
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFileText size={40} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No Notices Found
          </h3>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">
            We couldn't find any notices matching your search or filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("All Category");
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
                    Date & Title
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Important
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence mode="sync">
                  {currentItems.map((notice) => (
                    <motion.tr
                      key={notice.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors flex items-center gap-2">
                          {notice.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          {notice.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            notice.category === "academic"
                              ? "bg-blue-100 text-blue-700"
                              : notice.category === "exams"
                                ? "bg-red-100 text-red-700"
                                : notice.category === "events"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {notice.category.charAt(0).toUpperCase() +
                            notice.category.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {notice.important ? (
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-lg">
                            Yes
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-lg">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewPdf(notice.file_path)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all cursor-pointer"
                            title="View PDF"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditNotice(notice)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(notice)}
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
            {currentItems.map((notice) => (
              <motion.div
                key={notice.id}
                layout
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  show: { opacity: 1, scale: 1 },
                }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
              >
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 leading-tight mb-1">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-gray-500">{notice.date}</p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      notice.category === "academic"
                        ? "bg-blue-100 text-blue-700"
                        : notice.category === "exams"
                          ? "bg-red-100 text-red-700"
                          : notice.category === "events"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {notice.category.charAt(0).toUpperCase() +
                      notice.category.slice(1)}
                  </span>
                  {notice.important && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-lg">
                      Important
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-50 flex gap-2">
                  <button
                    onClick={() => handleViewPdf(notice.file_path)}
                    className="flex-1 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FiEye size={16} /> View
                  </button>
                  <button
                    onClick={() => handleEditNotice(notice)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors cursor-pointer"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(notice)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 gap-4 mt-6">
            <p className="text-sm text-gray-500 font-medium italic">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredNotices.length)} of{" "}
              {filteredNotices.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <FiChevronLeft size={20} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all cursor-pointer ${
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
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal Integrations */}
      <AnimatePresence>
        {showModal && (
          <NoticeModal
            editMode={editMode}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            currentNotice={currentNotice}
            setShowModal={setShowModal}
            loading={modalLoading}
          />
        )}

        {warningModal && (
          <WarningModal
            title="Delete Notice"
            description="Are you sure you want to delete this notice?"
            handleDelete={handleDeleteNotice}
            setShowModal={setWarningModal}
            isLoading={modalLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoticesTab;

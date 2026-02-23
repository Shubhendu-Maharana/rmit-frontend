import { useEffect, useState } from "react";
import { IoDocumentText, IoDocumentTextOutline } from "react-icons/io5";
import supabase from "../../services/supabase";
import Skeleton from "../../components/ui/Skeleton";
import { motion, AnimatePresence } from "framer-motion";

// Define TypeScript types for notice data
type NoticeCategory =
  | "academic"
  | "administrative"
  | "events"
  | "exams"
  | "all";

type Notice = {
  id: string;
  title: string;
  date: string;
  category: NoticeCategory;
  file_path: string;
  important: boolean;
};

const Notices = () => {
  // State for category filter
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeCategory, setActiveCategory] = useState<NoticeCategory>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const getNotices = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from("notices").select("*");
        if (error) {
          console.error("Error fetching notices:", error);
        } else {
          setNotices(data);
          setFilteredNotices(data);
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getNotices();
  }, []);

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredNotices(notices);
    } else {
      setFilteredNotices(
        notices.filter(
          (notice) => notice.category.toLowerCase() === activeCategory,
        ),
      );
    }
  }, [activeCategory, notices]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Categories for filter
  const categories: { id: NoticeCategory; label: string; color: string }[] = [
    { id: "all", label: "All Notices", color: "bg-gray-100 text-gray-800" },
    {
      id: "academic",
      label: "Academic",
      color: "bg-primary-100 text-primary-800",
    },
    {
      id: "administrative",
      label: "Administrative",
      color: "bg-purple-100 text-purple-800",
    },
    { id: "events", label: "Events", color: "bg-green-100 text-green-800" },
    { id: "exams", label: "Exams", color: "bg-amber-100 text-amber-800" },
  ];

  // Get category color based on category id
  const getCategoryColor = (categoryId: NoticeCategory): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.color : "bg-gray-100 text-gray-800";
  };

  // Notice card component
  const NoticeCard = ({ notice }: { notice: Notice }) => {
    const categoryColor = getCategoryColor(notice.category);

    return (
      <div
        className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
          notice.important ? "border-red-500" : "border-gray-200"
        } transition-all duration-300 hover:shadow-lg`}
      >
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              {notice.important && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                  Important
                </span>
              )}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor}`}
              >
                {notice.category.charAt(0).toUpperCase() +
                  notice.category.slice(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(notice.date)}
            </span>
          </div>

          <h3 className="mt-2 text-lg font-semibold text-gray-800">
            {notice.title}
          </h3>
          <a
            href={notice.file_path}
            target="_blank"
            className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <IoDocumentText className="h-5 w-5 mr-2" />
            View Notice
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Notice Board
          </h1>
          <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto">
            Stay updated with important announcements, events, and deadlines
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filter tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer hover:text-primary-600 hover:bg-primary-50 
                ${
                  activeCategory === category.id
                    ? "text-primary-600"
                    : "text-gray-600"
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Notice summary */}
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeCategory === "all"
              ? "All Notices"
              : `${
                  activeCategory.charAt(0).toUpperCase() +
                  activeCategory.slice(1)
                } Notices`}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredNotices.length} notices
          </span>
        </div>

        {/* Notices grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} />
            ))}
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="text-center py-12">
            <IoDocumentTextOutline className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No notices found
            </h3>
            <p className="mt-1 text-gray-500">
              There are no notices in this category at the moment.
            </p>
          </div>
        ) : (
          <motion.div
            key={activeCategory}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredNotices.map((notice) => (
                <motion.div
                  key={notice.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                    exit: { opacity: 0, scale: 0.95 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <NoticeCard notice={notice} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notices;

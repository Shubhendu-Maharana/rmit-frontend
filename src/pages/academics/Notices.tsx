import { useState } from "react";
import { IoDocumentText } from "react-icons/io5";

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
  category: Exclude<NoticeCategory, "all">;
  content: string;
  important: boolean;
};

const Notices = () => {
  // Sample data for notices
  const notices: Notice[] = [
    {
      id: "n001",
      title: "Final Examination Schedule Released",
      date: "2025-03-15",
      category: "exams",
      content:
        "The final examination schedule for Spring semester has been published. Students should check their email for personalized exam timings and locations.",
      important: true,
    },
    {
      id: "n002",
      title: "Campus Closure: Spring Break",
      date: "2025-03-10",
      category: "administrative",
      content:
        "The campus will be closed from March 22-30 for Spring Break. Administrative offices will reopen on March 31.",
      important: false,
    },
    {
      id: "n003",
      title: "New Course Registration Opens",
      date: "2025-03-05",
      category: "academic",
      content:
        "Registration for Fall semester courses will open on April 1. Students are advised to meet with academic advisors before registering.",
      important: true,
    },
    {
      id: "n004",
      title: "Annual Technology Symposium",
      date: "2025-03-01",
      category: "events",
      content:
        "Join us for the Annual Technology Symposium on April 15-16. Industry experts will discuss emerging trends in AI, blockchain, and sustainable technologies.",
      important: false,
    },
    {
      id: "n005",
      title: "Library Extended Hours",
      date: "2025-02-28",
      category: "administrative",
      content:
        "The main library will extend its operating hours from 8 AM to midnight during the final examination period (April 20-30).",
      important: false,
    },
    {
      id: "n006",
      title: "Scholarship Application Deadline",
      date: "2025-02-25",
      category: "academic",
      content:
        "The deadline for submitting scholarship applications for the next academic year is April 10. Visit the financial aid office for assistance.",
      important: true,
    },
    {
      id: "n007",
      title: "Mid-Term Grades Released",
      date: "2025-02-20",
      category: "exams",
      content:
        "Mid-term grades are now available on the student portal. Students with concerns should contact their instructors during office hours.",
      important: false,
    },
    {
      id: "n008",
      title: "Career Fair: Spring Edition",
      date: "2025-02-15",
      category: "events",
      content:
        "The Spring Career Fair will be held on March 25 in the Student Union building. Over 50 companies will be recruiting for internships and full-time positions.",
      important: true,
    },
  ];

  // State for category filter
  const [activeCategory, setActiveCategory] = useState<NoticeCategory>("all");

  // Filter notices based on active category
  const filteredNotices =
    activeCategory === "all"
      ? notices
      : notices.filter((notice) => notice.category === activeCategory);

  // Sort notices by date (newest first)
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    // Then sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

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
    { id: "academic", label: "Academic", color: "bg-blue-100 text-blue-800" },
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
    const [expanded, setExpanded] = useState(false);
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

          <div
            className={`mt-2 ${
              expanded ? "" : "line-clamp-2"
            } text-gray-600 text-sm`}
          >
            {notice.content}
          </div>

          <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <IoDocumentText className="h-5 w-5 mr-2" />
            View Notice
          </button>
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
                ${
                  activeCategory === category.id
                    ? `${category.color
                        .replace("bg-", "bg-")
                        .replace("text-", "text-")} shadow-sm`
                    : "bg-white text-gray-600 hover:bg-gray-100"
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
            {sortedNotices.length} notices
          </span>
        </div>

        {/* Notices grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sortedNotices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>

        {/* Empty state */}
        {sortedNotices.length === 0 && (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No notices found
            </h3>
            <p className="mt-1 text-gray-500">
              There are no notices in this category at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;

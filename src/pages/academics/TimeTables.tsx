import { useState } from "react";
import { IoDocumentText } from "react-icons/io5";

// Define TypeScript types for timetable data
type Program =
  | "Computer Science"
  | "Business Administration"
  | "Mechanical Engineering"
  | "Web Development"
  | "Electrician";
type Semester = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type ProgramType = "Degree" | "Diploma" | "ITI";

type Timetable = {
  id: string;
  program: Program;
  programType: ProgramType;
  semester: Semester;
  academicYear: string;
  lastUpdated: string;
  fileLink: string;
};

const TimeTables = () => {
  // Sample data for timetables (only 2 examples per your request)
  const timetables: Timetable[] = [
    {
      id: "tt001",
      program: "Computer Science",
      programType: "Degree",
      semester: "3",
      academicYear: "2024-2025",
      lastUpdated: "2025-03-10",
      fileLink: "/sample-files/cs-sem3-timetable.pdf",
    },
    {
      id: "tt002",
      program: "Web Development",
      programType: "Diploma",
      semester: "2",
      academicYear: "2024-2025",
      lastUpdated: "2025-03-12",
      fileLink: "/sample-files/webdev-sem2-timetable.pdf",
    },
  ];

  // State for active filters
  const [activeType, setActiveType] = useState<ProgramType | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter timetables based on active type and search query
  const filteredTimetables = timetables.filter((timetable) => {
    const matchesType =
      activeType === "All" || timetable.programType === activeType;
    const matchesSearch =
      timetable.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      timetable.semester.includes(searchQuery) ||
      timetable.academicYear.includes(searchQuery);
    return matchesType && matchesSearch;
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

  // Program type filters
  const programTypes = [
    { id: "All", label: "All Types" },
    { id: "Degree", label: "Degree" },
    { id: "Diploma", label: "Diploma" },
    { id: "ITI", label: "ITI" },
  ];

  // Get color for program type
  const getProgramTypeColor = (type: ProgramType): string => {
    switch (type) {
      case "Degree":
        return "bg-blue-100 text-blue-800";
      case "Diploma":
        return "bg-purple-100 text-purple-800";
      case "ITI":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Timetable card component
  const TimetableCard = ({ timetable }: { timetable: Timetable }) => {
    const typeColor = getProgramTypeColor(timetable.programType);

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
        <div className="p-5">
          <div className="flex justify-between items-start">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}
            >
              {timetable.programType}
            </span>
            <span className="text-sm text-gray-500">
              Updated: {formatDate(timetable.lastUpdated)}
            </span>
          </div>

          <h3 className="mt-2 text-lg font-semibold text-gray-800">
            {timetable.program}
          </h3>

          <div className="mt-2 flex items-center space-x-2 text-gray-600 text-sm">
            <span className="font-medium">Semester:</span> {timetable.semester}
          </div>

          <div className="mt-1 flex items-center space-x-2 text-gray-600 text-sm">
            <span className="font-medium">Academic Year:</span>{" "}
            {timetable.academicYear}
          </div>

          <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <IoDocumentText className="h-5 w-5 mr-2" />
            View Timetable
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Class Time Tables
          </h1>
          <p className="mt-4 text-xl text-green-100 max-w-2xl mx-auto">
            Find and download the latest timetables for all programs and
            semesters
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and filter section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <label htmlFor="search" className="sr-only">
                Search timetables
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  type="text"
                  placeholder="Search by program, semester, or year"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {programTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id as ProgramType | "All")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium 
                    ${
                      activeType === type.id
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timetable summary */}
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeType === "All"
              ? "All Timetables"
              : `${activeType} Timetables`}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredTimetables.length} timetables available
          </span>
        </div>

        {/* Timetables grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTimetables.map((timetable) => (
            <TimetableCard key={timetable.id} timetable={timetable} />
          ))}
        </div>

        {/* Empty state */}
        {filteredTimetables.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No timetables found
            </h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTables;

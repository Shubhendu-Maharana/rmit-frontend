import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import TimetableCard from "../../components/TimeTableCard";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import type { Timetable, ProgramType } from "@app/types/dataTypes";
import { getTimeTables } from "@services/timeTables";

const programTypes = [
  { id: "All", label: "All Types" },
  { id: "Degree", label: "Degree" },
  { id: "Diploma", label: "Diploma" },
  { id: "ITI", label: "ITI" },
];

const TimeTables = () => {
  const [timeTables, setTimeTables] = useState<Timetable[]>([]);
  const [filteredTimetables, setFilteredTimetables] = useState<Timetable[]>([]);
  const [activeType, setActiveType] = useState<ProgramType | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTimeTables = async () => {
      try {
        setIsLoading(true);
        const data = await getTimeTables();
        setTimeTables(data);
        setFilteredTimetables(data);
      } catch (error) {
        console.error("Error fetching timetables:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeTables();
  }, []);

  useEffect(() => {
    const filtered = timeTables.filter((timetable) => {
      const matchesType =
        activeType === "All" || timetable.program_type === activeType;
      const matchesQuery = timetable.program
        .toLowerCase()
        .startsWith(searchQuery.toLowerCase());
      return matchesType && matchesQuery;
    });
    setFilteredTimetables(filtered);
  }, [activeType, searchQuery, timeTables]);

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
                  <IoSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  type="text"
                  placeholder="Search by program"
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
                  className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer 
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
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-green-600" />
          </div>
        ) : (
          <motion.div
            key={activeType}
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
              {filteredTimetables.map((timetable) => (
                <motion.div
                  key={timetable.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                    exit: { opacity: 0, scale: 0.95 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <TimetableCard timetable={timetable} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty state */}
        {filteredTimetables.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <MdOutlineDateRange className="h-12 w-12 mx-auto text-gray-400" />
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

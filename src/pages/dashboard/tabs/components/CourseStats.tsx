import React from "react";
import { FiBookOpen } from "react-icons/fi";
import { Course } from "../../../../types/dataTypes";

interface CourseStatsProps {
  courses: Course[];
  loading: boolean;
}

export const CourseStats: React.FC<CourseStatsProps> = ({
  courses,
  loading,
}) => {
  const stats = [
    {
      label: "Total Courses",
      value: courses.length,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      label: "RMIT (Graduation)",
      value: courses.filter((c) => c.institute === "RMIT").length,
      color: "bg-gradient-to-br from-violet-500 to-purple-600",
    },
    {
      label: "RMITC (ITI)",
      value: courses.filter((c) => c.institute === "RMITC").length,
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
    {
      label: "HIT (Diploma)",
      value: courses.filter((c) => c.institute === "HIT").length,
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex items-center p-5 relative hover:shadow-md transition-all duration-300"
        >
          <div className="flex-1">
            <span className="text-gray-400 text-sm font-medium block mb-1">
              {stat.label}
            </span>
            <span className="text-3xl font-bold text-gray-800">
              {loading ? "..." : stat.value}
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-lg shadow-gray-150`}
          >
            <FiBookOpen size={22} />
          </div>
        </div>
      ))}
    </div>
  );
};

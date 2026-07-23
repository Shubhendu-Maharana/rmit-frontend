import React from "react";
import { FiBook } from "react-icons/fi";
import { Subject } from "../../../../types/dataTypes";

interface SubjectStatsProps {
  subjects: Subject[];
  loading: boolean;
}

export const SubjectStats: React.FC<SubjectStatsProps> = ({
  subjects,
  loading,
}) => {
  const stats = [
    {
      label: "Total Subjects",
      value: subjects.length,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      label: "Average Credits",
      value: subjects.length
        ? (
            subjects.reduce((sum, s) => sum + s.credits, 0) / subjects.length
          ).toFixed(1)
        : "0.0",
      color: "bg-gradient-to-br from-violet-500 to-purple-600",
    },
    {
      label: "Semester Course Blocks",
      value: Array.from(new Set(subjects.map((s) => s.semester))).length,
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
            <FiBook size={22} />
          </div>
        </div>
      ))}
    </div>
  );
};

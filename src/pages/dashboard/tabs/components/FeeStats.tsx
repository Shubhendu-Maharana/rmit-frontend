import React from "react";
import { FiDollarSign, FiCheckCircle, FiClock } from "react-icons/fi";
import { FeeStructure, FeeReceipt } from "../../../../store/api/feeApi";

interface FeeStatsProps {
  feeStructures: FeeStructure[];
  feeReceipts?: FeeReceipt[];
  isStudent: boolean;
  loading: boolean;
}

export const FeeStats: React.FC<FeeStatsProps> = ({
  feeStructures,
  feeReceipts = [],
  isStudent,
  loading,
}) => {
  if (isStudent) {
    const totalAssigned = feeReceipts.length;
    const paidAmount = feeReceipts
      .filter((r) => r.status === "PAID")
      .reduce((sum, r) => sum + r.feeStructure!.amount, 0);
    const pendingAmount = feeReceipts
      .filter((r) => r.status !== "PAID")
      .reduce((sum, r) => sum + r.feeStructure!.amount, 0);

    const stats = [
      {
        label: "Total Assigned Fees",
        value: totalAssigned,
        desc: "Circular/Exam fees assigned",
        icon: <FiClock size={20} />,
        color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      },
      {
        label: "Paid Fees Amount",
        value: `₹${paidAmount.toLocaleString()}`,
        desc: "Cleared transactions",
        icon: <FiCheckCircle size={20} />,
        color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      },
      {
        label: "Pending Fees Amount",
        value: `₹${pendingAmount.toLocaleString()}`,
        desc: "Awaiting payments",
        icon: <FiDollarSign size={20} />,
        color: "bg-gradient-to-br from-amber-500 to-orange-600",
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
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">
                {stat.label}
              </span>
              <span className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stat.value}
              </span>
              <span className="text-[10px] text-gray-400 block mt-0.5">{stat.desc}</span>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-lg shadow-gray-150`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Staff Stats
  const stats = [
    {
      label: "Total Fee Structures",
      value: feeStructures.length,
      desc: "Global syllabus structures",
      icon: <FiDollarSign size={20} />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
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
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">
              {stat.label}
            </span>
            <span className="text-2xl font-bold text-gray-800">
              {loading ? "..." : stat.value}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">{stat.desc}</span>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-lg shadow-gray-150`}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

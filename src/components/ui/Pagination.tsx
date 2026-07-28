import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  limit: number;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  limit,
  loading = false,
}) => {
  if (totalPages <= 1) return null;

  // Calculate range display (e.g. Showing 1 to 10 of 23 entries)
  const from = (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, totalCount);

  // Generate page numbers range (with ellipsis if total pages > 5)
  const getPagesRange = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Number of pages to show before and after current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - delta - 1 && i > 1) ||
        (i === currentPage + delta + 1 && i < totalPages)
      ) {
        pages.push("...");
      }
    }
    // Filter consecutive duplicate ellipses
    return pages.filter((page, index) => {
      if (page === "...") {
        return pages[index - 1] !== "...";
      }
      return true;
    });
  };

  const pages = getPagesRange();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-gray-100">
      {/* Entries Info */}
      <div className="text-xs text-gray-500 font-medium">
        Showing <span className="font-semibold text-gray-800">{from}</span> to{" "}
        <span className="font-semibold text-gray-800">{to}</span> of{" "}
        <span className="font-semibold text-gray-800">{totalCount}</span>{" "}
        entries
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50/30 active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 disabled:active:scale-100 transition-all duration-200 cursor-pointer"
        >
          <FiChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 font-boldSelectNone font-semibold"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              disabled={loading}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                isActive
                  ? "bg-primary-600 text-white shadow-md shadow-primary-200 scale-105"
                  : "border border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50/30 active:scale-95"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50/30 active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 disabled:active:scale-100 transition-all duration-200 cursor-pointer"
        >
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

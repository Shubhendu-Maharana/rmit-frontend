import React from "react";
import { FiX, FiBookOpen, FiFileText } from "react-icons/fi";
import { Course } from "../../../../types/dataTypes";

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-primary-600 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiBookOpen size={24} />
            <div>
              <h3 className="text-lg font-bold">Course Specifications</h3>
              <p className="text-xs text-white/80 font-mono mt-0.5">
                {course.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-gray-700">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-400 block mb-0.5 uppercase tracking-wider">
                Course Title:
              </span>
              <span className="text-gray-800 font-bold text-base">
                {course.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-0.5 uppercase tracking-wider">
                  Academic Institution:
                </span>
                <span className="text-gray-800 font-semibold text-sm">
                  {course.institute === "RMIT"
                    ? "RMIT (Graduation Courses)"
                    : course.institute === "RMITC"
                      ? "RMITC (ITI / Trade Courses)"
                      : "HIT (Diploma Courses)"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-0.5 uppercase tracking-wider">
                  Institute Code:
                </span>
                <span className="font-mono text-gray-800 text-sm font-bold">
                  {course.institute}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-850 text-sm mb-2 flex items-center gap-2">
              <FiFileText className="text-primary-500" /> Syllabus & Course
              Description
            </h4>
            <div className="bg-white rounded-2xl p-4 border border-gray-150 text-sm text-gray-600 whitespace-pre-line leading-relaxed min-h-[100px]">
              {course.description ||
                "No specific syllabus description has been entered for this course."}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-750 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

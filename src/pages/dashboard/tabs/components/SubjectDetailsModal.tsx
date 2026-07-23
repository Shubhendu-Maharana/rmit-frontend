import React from "react";
import { FiX, FiBook, FiBriefcase, FiCalendar } from "react-icons/fi";
import { Subject } from "../../../../types/dataTypes";

interface SubjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
}

export const SubjectDetailsModal: React.FC<SubjectDetailsModalProps> = ({
  isOpen,
  onClose,
  subject,
}) => {
  if (!isOpen || !subject) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-primary-600 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiBook size={24} />
            <div>
              <h3 className="text-lg font-bold">
                Subject Specification details
              </h3>
              <p className="text-xs text-white/80 font-mono mt-0.5">
                {subject.id}
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
                Subject Title:
              </span>
              <span className="text-gray-805 font-bold text-base">
                {subject.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-gray-700">
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-0.5 uppercase tracking-wider">
                  Subject Code:
                </span>
                <span className="font-mono text-gray-800 font-bold">
                  {subject.code}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-0.5 uppercase tracking-wider">
                  Academic Credits:
                </span>
                <span>{subject.credits} Credits</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-0.5 uppercase tracking-wider">
                  Semester Block:
                </span>
                <span>Semester {subject.semester}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-0.5 uppercase tracking-wider">
                  Academic Year:
                </span>
                <span className="flex items-center gap-1 font-medium text-xs">
                  <FiCalendar /> {subject.academicYear}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-850 text-sm mb-2 flex items-center gap-2">
              <FiBriefcase className="text-primary-500" /> Syllabus Course Path
            </h4>
            <div className="bg-white rounded-2xl p-4 border border-gray-150 text-sm space-y-3">
              <div>
                <span className="text-gray-400 block text-xs">
                  Course Name:
                </span>
                <span className="text-gray-700 font-bold">
                  {subject.course?.name || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">
                  Target Institution:
                </span>
                <span className="text-gray-700 font-semibold">
                  {subject.course?.institute || "GLOBAL"}
                </span>
              </div>
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

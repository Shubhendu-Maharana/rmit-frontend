import React from "react";
import { FiX, FiBell, FiCalendar, FiFileText } from "react-icons/fi";
import { Notice } from "../../../../types/dataTypes";

interface NoticeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: Notice | null;
}

export const NoticeDetailsModal: React.FC<NoticeDetailsModalProps> = ({
  isOpen,
  onClose,
  notice,
}) => {
  if (!isOpen || !notice) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-linear-to-r from-primary-600 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiBell size={24} />
            <div>
              <h3 className="text-lg font-bold">Circular Announcement</h3>
              <p className="text-xs text-white/85 mt-0.5">ID: {notice.id}</p>
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
                Circular Title:
              </span>
              <span className="text-gray-800 font-bold text-base">
                {notice.title}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-0.5 uppercase tracking-wider">
                  Target Audience:
                </span>
                <span className="text-gray-800 font-semibold">
                  {notice.institute
                    ? `${notice.institute} Institute`
                    : "Global (All Institutes)"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-0.5 uppercase tracking-wider">
                  Published Date:
                </span>
                <span className="text-gray-800 font-semibold flex items-center gap-1">
                  <FiCalendar /> {new Date(notice.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {notice.fileUrl && (
            <div>
              <h4 className="font-bold text-gray-850 text-sm mb-2 flex items-center gap-2">
                <FiFileText className="text-primary-500" /> Attached Notice
                Document
              </h4>
              <div className="bg-white rounded-2xl p-4 border border-gray-150 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 truncate max-w-70">
                  {notice.fileUrl.split("/").pop()}
                </span>
                <a
                  href={notice.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-100 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  View Attachment
                </a>
              </div>
            </div>
          )}
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

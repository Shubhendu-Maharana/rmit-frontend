import { useState, useRef } from "react";
import { Notice } from "@app/types/dataTypes";
import { motion } from "motion/react";
import { FiX, FiUpload, FiFileText } from "react-icons/fi";
import { uploadFile } from "@services/fileUpload";

const categoryOptions = [
  { value: "all", label: "All Category" },
  { value: "academic", label: "Academic" },
  { value: "administrative", label: "Administrative" },
  { value: "events", label: "Events" },
  { value: "exams", label: "Exams" },
];

interface NoticeModalProps {
  editMode: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  currentNotice: Notice;
  setShowModal: (modal: boolean) => void;
  loading: boolean;
}

const NoticeModal = ({
  editMode,
  handleSubmit,
  handleInputChange,
  currentNotice,
  setShowModal,
  loading,
}: NoticeModalProps) => {
  const [pdfUrl, setPdfUrl] = useState<string>(currentNotice.file_path);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!pdfFile) {
      setUploadError("No file selected");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const publicUrlData = await uploadFile({
        file: pdfFile,
        bucket: "notices",
      });

      // Update the file URL with the public URL
      if (publicUrlData) {
        setPdfUrl(publicUrlData);

        // Update the currentNotice object with the new file URL
        const e = {
          target: {
            name: "file_path",
            value: publicUrlData,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        handleInputChange(e);
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setUploadError("Failed to upload PDF. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 bg-primary-600 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">
              {editMode ? "Edit Notice" : "Add New Notice"}
            </h3>
            <p className="text-primary-100 text-sm mt-0.5">
              Please fill in the details below
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <FiX size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                Notice Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. End Semester Examination Schedule"
                value={currentNotice.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={currentNotice.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                Category
              </label>
              <select
                name="category"
                value={currentNotice.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                required
              >
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
                Important
              </label>
              <select
                name="important"
                value={currentNotice.important ? "Yes" : "No"}
                onChange={(e) => {
                  handleInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: "important",
                      value: e.target.value === "Yes",
                    },
                  } as unknown as React.ChangeEvent<HTMLSelectElement>);
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* PDF Upload Section - Full Width */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5 ml-1">
              <FiFileText className="text-primary-500" /> Notice PDF
            </label>

            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full flex gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="pdfFile"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 border-dashed rounded-xl hover:bg-gray-100 transition-all text-sm font-medium text-gray-600 flex justify-center items-center gap-2"
                >
                  <FiUpload /> {pdfFile ? pdfFile.name : "Select PDF File"}
                </button>
                {pdfFile && (
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={handleUpload}
                    className={`px-6 py-3 text-sm text-white bg-green-600 rounded-xl font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all ${
                      isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                )}
              </div>
            </div>

            {uploadError && (
              <p className="text-red-500 text-sm ml-1">{uploadError}</p>
            )}

            {/* Current PDF info */}
            {pdfUrl && (
              <div className="text-sm flex items-center gap-2 ml-1 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg mt-2 border border-gray-100">
                <span>Current file:</span>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 font-medium hover:underline flex items-center gap-1"
                >
                  <FiFileText /> View PDF
                </a>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1 ml-1 leading-relaxed">
              Upload a valid PDF file containing the notice contents. Max 10MB.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 sticky bottom-[-29px] shadow-[0_-20px_20px_-20px_rgba(0,0,0,0.1)] bg-white pb-0">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {editMode
                ? loading
                  ? "Updating..."
                  : "Update Notice"
                : loading
                  ? "Adding..."
                  : "Add Notice"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NoticeModal;

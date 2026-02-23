import { useState } from "react";
import supabase from "@services/supabase";

type NoticeCategory = "Academic" | "Administrative" | "Events" | "Exams" | "";

type Notice = {
  id: string;
  title: string;
  date: string;
  category: NoticeCategory;
  file_path: string;
  important: boolean;
};

interface NoticeModalProps {
  editMode: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  currentNotice: Notice;
  setShowModal: (modal: boolean) => void;
}

const NoticeModal = ({
  editMode,
  handleSubmit,
  handleInputChange,
  currentNotice,
  setShowModal,
}: NoticeModalProps) => {
  const [pdfUrl, setPdfUrl] = useState<string>(currentNotice.file_path);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!pdfFile) {
      setUploadError("No file selected");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create a unique file name to prevent overwriting existing files
      const fileExt = pdfFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;

      // Upload the file to Supabase storage
      const { error } = await supabase.storage
        .from("notices")
        .upload(fileName, pdfFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("notices")
        .getPublicUrl(fileName);

      // Update the file URL with the public URL
      if (publicUrlData && publicUrlData.publicUrl) {
        setPdfUrl(publicUrlData.publicUrl);

        // Update the currentNotice object with the new file URL
        const e = {
          target: {
            name: "file_path",
            value: publicUrlData.publicUrl,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        handleInputChange(e);
      }

      console.log("PDF uploaded successfully");
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
    <div className="fixed inset-0 bg-[#000000aa] backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="my-8 bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editMode ? "Edit Notice" : "Add New Notice"}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] overflow-y-auto pr-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Notice Title"
                  value={currentNotice.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={currentNotice.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={currentNotice.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option>Academic</option>
                  <option>Administrative</option>
                  <option>Events</option>
                  <option>Exams</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Important
                </label>
                <select
                  name="important"
                  value={currentNotice.important ? "Yes" : "No"}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          </div>

          {/* PDF Upload Section - Full Width */}
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notice PDF
            </label>

            {/* Current PDF info */}
            {pdfUrl && (
              <div className="text-sm mb-2">
                Current file:
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-primary-600 hover:underline"
                >
                  View PDF
                </a>
              </div>
            )}

            {uploadError && (
              <p className="text-red-500 text-sm">{uploadError}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="file"
                name="pdfFile"
                accept="application/pdf"
                onChange={handleFileChange}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="button"
                disabled={!pdfFile || isUploading}
                onClick={handleUpload}
                className={`px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  !pdfFile || isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUploading ? "Uploading..." : "Upload PDF"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload a PDF file (max 10MB)
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer"
            >
              {editMode ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeModal;

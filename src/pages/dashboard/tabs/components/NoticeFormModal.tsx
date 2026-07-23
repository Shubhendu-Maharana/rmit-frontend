import React, { useState, useEffect } from "react";
import { FiX, FiCheckCircle, FiRefreshCw, FiUploadCloud } from "react-icons/fi";
import { toast } from "react-toastify";
import { Institute, Notice, User } from "../../../../types/dataTypes";

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode: boolean;
  selectedNotice: Notice | null;
  createNotice: (payload: any) => { unwrap: () => Promise<any> };
  updateNotice: (args: { id: string; body: any }) => {
    unwrap: () => Promise<any>;
  };
  uploadFile: (formData: FormData) => { unwrap: () => Promise<any> };
  currentUser: User | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isCreating: boolean;
  isUpdating: boolean;
}

export const NoticeFormModal: React.FC<NoticeFormModalProps> = ({
  isOpen,
  onClose,
  editMode,
  selectedNotice,
  createNotice,
  updateNotice,
  uploadFile,
  currentUser,
  isSuperAdmin,
  isAdmin,
  isCreating,
  isUpdating,
}) => {
  const [title, setTitle] = useState("");
  const [institute, setInstitute] = useState<Institute | "GLOBAL">("GLOBAL");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editMode && selectedNotice) {
      setTitle(selectedNotice.title);
      setInstitute(selectedNotice.institute || "GLOBAL");
      setExistingFileUrl(selectedNotice.fileUrl || "");
      setSelectedFile(null);
    } else {
      setTitle("");
      setInstitute(
        isSuperAdmin
          ? "GLOBAL"
          : currentUser?.adminProfile?.institute || "GLOBAL",
      );
      setExistingFileUrl("");
      setSelectedFile(null);
    }
  }, [isOpen, editMode, selectedNotice, currentUser, isSuperAdmin]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size cannot exceed 10MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Notice title is required.");
      return;
    }

    let fileUrl = existingFileUrl;

    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const response = await uploadFile(formData).unwrap();
        fileUrl = response.data.url;
        toast.success("Document uploaded successfully.");
      } catch (error) {
        const err = error as { data?: { message?: string } };
        const msg = err?.data?.message || "File upload failed";
        toast.error(msg);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    if (!fileUrl) {
      toast.error("Please attach a notice document (PDF/Image).");
      return;
    }

    const payload = {
      title,
      fileUrl,
      institute: institute === "GLOBAL" ? null : institute,
    };

    // Strict boundary checks
    if (!isSuperAdmin) {
      if (!isAdmin) {
        toast.error("You are not authorized to publish notices.");
        return;
      }
      // Force Admin's own institute
      payload.institute = currentUser?.adminProfile?.institute || null;
      if (!payload.institute) {
        toast.error("Admin institute profile not found. Operation aborted.");
        return;
      }
    }

    try {
      if (editMode && selectedNotice) {
        await updateNotice({ id: selectedNotice.id, body: payload }).unwrap();
        toast.success("Notice updated successfully.");
      } else {
        await createNotice(payload).unwrap();
        toast.success("Notice published successfully.");
      }
      onClose();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message || "Failed to save notice.";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            {editMode ? "Modify Notice" : "Publish Official Circular Notice"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Notice Title / Announcement Heading
            </label>
            <input
              type="text"
              placeholder="e.g. Mid Semester Exams Schedule 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Target Academic Institution
            </label>
            <select
              disabled={!isSuperAdmin || editMode}
              value={institute}
              onChange={(e) =>
                setInstitute(e.target.value as Institute | "GLOBAL")
              }
              className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer disabled:bg-gray-100"
              required
            >
              {isSuperAdmin && (
                <option value="GLOBAL">Global (All Institutes)</option>
              )}
              <option value="RMIT">RMIT (Graduation Courses)</option>
              <option value="RMITC">RMITC (ITI / Trade Courses)</option>
              <option value="HIT">HIT (Diploma Courses)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Notice File Document (PDF / Image)
            </label>
            <div className="flex items-center gap-4">
              {selectedFile ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-xs font-semibold shrink-0 shadow-sm">
                  <span className="truncate max-w-45" title={selectedFile.name}>
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-0.5 hover:bg-primary-100 text-primary-500 hover:text-primary-700 rounded-full transition-colors cursor-pointer"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ) : (
                <label className="relative flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-250 hover:bg-gray-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                  <FiUploadCloud size={16} />
                  <span>Choose Notice File</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
              {existingFileUrl && !selectedFile && (
                <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                  <FiCheckCircle /> Existing Notice Attachment
                </span>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 border-t border-gray-100 pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating || isUploading}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-lg shadow-primary-200 disabled:opacity-50"
            >
              {isCreating || isUpdating || isUploading ? (
                <>
                  <FiRefreshCw className="animate-spin" /> Saving...
                </>
              ) : (
                <span className="flex items-center gap-1">
                  <FiCheckCircle /> Publish Notice
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

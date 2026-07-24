import React, { useState, useEffect } from "react";
import { FiX, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";
import { Course } from "../../../../types/dataTypes";
import { FeeStructure } from "../../../../store/api/feeApi";

interface FeeStructureFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode: boolean;
  selectedFee: FeeStructure | null;
  createFeeStructure: (payload: any) => { unwrap: () => Promise<any> };
  updateFeeStructure: (args: { id: string; body: any }) => { unwrap: () => Promise<any> };
  courses: Course[];
  isCreating: boolean;
  isUpdating: boolean;
}

export const FeeStructureFormModal: React.FC<FeeStructureFormModalProps> = ({
  isOpen,
  onClose,
  editMode,
  selectedFee,
  createFeeStructure,
  updateFeeStructure,
  courses,
  isCreating,
  isUpdating,
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (editMode && selectedFee) {
      setTitle(selectedFee.title);
      setAmount(selectedFee.amount.toString());
      setCourseId(selectedFee.courseId);
      setSemester(selectedFee.semester.toString());
      setAcademicYear(selectedFee.academicYear);
      const formattedDate = new Date(selectedFee.dueDate).toISOString().split("T")[0];
      setDueDate(formattedDate);
    } else {
      setTitle("");
      setAmount("");
      setCourseId("");
      setSemester("1");
      setAcademicYear(new Date().getFullYear().toString());
      setDueDate("");
    }
  }, [isOpen, editMode, selectedFee]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !courseId || !semester || !academicYear || !dueDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      title,
      amount: Number(amount),
      courseId,
      semester: Number(semester),
      academicYear,
      dueDate,
    };

    try {
      if (editMode && selectedFee) {
        await updateFeeStructure({ id: selectedFee.id, body: { title, amount: Number(amount), dueDate } }).unwrap();
        toast.success("Fee structure updated successfully.");
      } else {
        await createFeeStructure(payload).unwrap();
        toast.success("Fee structure created successfully.");
      }
      onClose();
    } catch (error: any) {
      const msg = error?.data?.message || "Failed to save fee structure.";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            {editMode ? "Modify Fee Structure" : "Create Global Fee Structure"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Fee Title
            </label>
            <input
              type="text"
              placeholder="e.g. Semester 2 Tuition Fees"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Amount (INR)
              </label>
              <input
                type="number"
                placeholder="e.g. 25000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Semester Block
              </label>
              <select
                disabled={editMode}
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer disabled:bg-gray-100"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem.toString()}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                disabled={editMode}
                placeholder="e.g. 2026"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm disabled:bg-gray-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Associated Syllabus Course
            </label>
            <select
              disabled={editMode}
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer disabled:bg-gray-100"
              required
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.institute})
                </option>
              ))}
            </select>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 border-t border-gray-100 pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-650 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-lg shadow-primary-200 disabled:opacity-50"
            >
              {isCreating || isUpdating ? (
                <>
                  <FiRefreshCw className="animate-spin" /> Saving...
                </>
              ) : (
                <span className="flex items-center gap-1">
                  <FiCheckCircle /> Save Structure
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

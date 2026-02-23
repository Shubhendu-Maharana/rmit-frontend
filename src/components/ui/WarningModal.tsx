import { motion } from "motion/react";

const WarningModal = ({
  title,
  description,
  setShowModal,
  handleDelete,
  isLoading,
}: {
  title: string;
  description: string;
  setShowModal: (showModal: boolean) => void;
  handleDelete: () => void;
  isLoading: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50"
      onClick={() => setShowModal(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{description}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className={
              isLoading
                ? "px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 transition-colors cursor-not-allowed"
                : "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            }
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WarningModal;

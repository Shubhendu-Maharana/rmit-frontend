import { Notice } from "@app/types/dataTypes";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";

type NoticeRowProps = {
  notice: Notice;
  handleEditNotice: (notice: Notice) => void;
  handleDeleteNotice: (notice: Notice) => void;
};

const NoticeRow = ({
  notice,
  handleEditNotice,
  handleDeleteNotice,
}: NoticeRowProps) => {
  const handleViewPdf = (filePath: string) => {
    // Open PDF in a new tab
    window.open(filePath, "_blank");
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">{notice.date}</td>
      <td className="px-4 py-3">{notice.title}</td>
      <td className="px-4 py-3">{notice.category}</td>
      <td className="px-4 py-3">{notice.important ? "Yes" : "No"}</td>
      <td className="px-4 py-3">
        <button
          onClick={() => handleViewPdf(notice.file_path)}
          className="text-green-600 hover:text-green-900 flex items-center sm:inline-flex cursor-pointer mr-3 mb-2 sm:mb-0"
        >
          <FiEye className="mr-1" />
          View
        </button>
      </td>
      <td className="px-4 py-3 flex flex-col sm:flex-row justify-end">
        <button
          onClick={() => handleEditNotice(notice)}
          className="text-primary-600 hover:text-primary-900 mr-3 flex items-center sm:inline-flex cursor-pointer mb-2 sm:mb-0"
        >
          <FiEdit className="mr-1" />
          Edit
        </button>
        <button
          onClick={() => handleDeleteNotice(notice)}
          className="text-red-600 hover:text-red-900 flex items-center sm:inline-flex cursor-pointer"
        >
          <FiTrash2 className="mr-1" />
          Delete
        </button>
      </td>
    </tr>
  );
};

export default NoticeRow;

import { useState } from "react";
import supabase from "../../../../supabase";

type Department = "Degree" | "Diploma" | "ITI" | "";

type Faculty = {
  id: string;
  name: string;
  image: string;
  department: Department;
  specialization: string;
  email: string;
  phone: string;
  education: string;
  is_hod: boolean;
  joining_date: string;
};

interface FacultyModalProps {
  editMode: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  currentFaculty: Faculty;
  setShowModal: (modal: boolean) => void;
}

const FacultyModal = ({
  editMode,
  handleSubmit,
  handleInputChange,
  currentFaculty,
  setShowModal,
}: FacultyModalProps) => {
  const [imageUrl, setImageUrl] = useState<string>(currentFaculty.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!imageFile) {
      setUploadError("No file selected");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create a unique file name to prevent overwriting existing files
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;

      // Upload the file to Supabase storage
      const { error } = await supabase.storage
        .from("faculty-images")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("faculty-images")
        .getPublicUrl(fileName);

      // Update the image URL with the public URL
      if (publicUrlData && publicUrlData.publicUrl) {
        setImageUrl(publicUrlData.publicUrl);

        // Update the currentFaculty object with the new image URL
        const e = {
          target: {
            name: "image",
            value: publicUrlData.publicUrl,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        handleInputChange(e);
      }

      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a temporary URL for preview
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000aa] backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="my-8 bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editMode ? "Edit Faculty Member" : "Add New Faculty Member"}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] overflow-y-auto pr-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Image Upload & Personal Info */}
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <img
                  src={imageUrl}
                  alt="Faculty preview"
                  className="w-32 h-32 rounded-full object-cover mb-2"
                  loading="lazy"
                />
                {uploadError && (
                  <p className="text-red-500 text-sm mb-2">{uploadError}</p>
                )}
                <div className="flex flex-col items-center gap-3 w-full">
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      disabled={imageUrl === "https://placehold.co/128x128"}
                      onClick={() => {
                        setImageUrl("https://placehold.co/128x128");
                        setImageFile(null);

                        // Update the currentFaculty object with the placeholder image
                        const e = {
                          target: {
                            name: "image",
                            value: "https://placehold.co/128x128",
                          },
                        } as React.ChangeEvent<HTMLInputElement>;

                        handleInputChange(e);
                      }}
                      className={`flex-1 px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 ${
                        imageUrl === "https://placehold.co/128x128"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Remove Image
                    </button>
                    <button
                      type="button"
                      disabled={!imageFile || isUploading}
                      onClick={handleUpload}
                      className={`flex-1 px-3 py-1 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50 ${
                        !imageFile || isUploading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentFaculty.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={currentFaculty.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={currentFaculty.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            {/* Right Column - Professional Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={currentFaculty.education}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={
                    currentFaculty.department.length === 0
                      ? ""
                      : currentFaculty.department
                  }
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select Department</option>
                  <option>Degree</option>
                  <option>Diploma</option>
                  <option>ITI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={currentFaculty.specialization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  name="joining_date"
                  value={currentFaculty.joining_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Head of Department
                </label>
                <select
                  name="is_hod"
                  value={currentFaculty.is_hod ? "Yes" : "No"}
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

export default FacultyModal;

import { useRef } from "react";
import axios from "axios";
import BASE_URL from "../../config";

const AddDocumentButton = ({ taskId }) => {
  const fileInputRef = useRef(null);

  const handleAddDocument = () => {
    fileInputRef.current.click(); // Open file picker
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("documents", file);

    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.put(
        `${BASE_URL}/api/projects/assignTask/${taskId}/complete-documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload successful:", response.data);
      // Show success toast or update UI here
    } catch (error) {
      console.error("Upload failed:", error.response || error.message);
      // Show error toast here
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.png"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <button
        onClick={handleAddDocument}
        className="px-4 py-2 text-sm font-medium text-white rounded-md bg-purple-600 hover:bg-purple-700 transition-colors"
      >
        Add Document
      </button>
    </>
  );
};

export default AddDocumentButton;

import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import BASE_URL from "../../config";

export default function UploadDrawingForm({
  onClose,
  onSubmit,
  selectedProject,
}) {
  const [formData, setFormData] = useState({
    name: "",
    remark: "",
    document: null,
    discipline: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const usernameID = user?.id;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    console.log(selectedProject.id)

    const payload = new FormData();
    payload.append("project_id", selectedProject.projectId);
    payload.append("name", formData.name);
    payload.append("remark", formData.remark);
    payload.append("discipline", formData.discipline);
    payload.append("status", "Under Review");
    payload.append("sent_by", usernameID);
    payload.append("previous_versions", "NULL");
    payload.append("latest_version_path", "NULL");
    payload.append("design_documents", formData.document);

    try {
      const response = await fetch(`${BASE_URL}/api/projects/design_drawing`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!response.ok) {
        throw new Error("Failed to upload drawing");
      }
      const result = await response.json();
      // onSubmit(result); // You can pass the result to parent if needed
      await onSubmit();
      onClose();
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="grid grid-cols-2 gap-4 bg-white rounded-lg shadow-md p-6">
        {/* Upload Icon Section as Clickable Upload with Filename */}
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-48 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => document.getElementById("hiddenFileInput").click()}
        >
          <UploadCloud size={48} className="text-purple-500 mb-2" />
          <p className="text-gray-600 text-sm">Click to upload drawing</p>
          {formData.document && (
            <p className="mt-2 text-xs text-gray-500 truncate w-4/5 text-center">
              {formData.document.name}
            </p>
          )}
          <input
            id="hiddenFileInput"
            type="file"
            name="document"
            accept=".pdf,.jpg,.png"
            onChange={handleChange}
            className="hidden"
            
          />
          
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Remarks
          </label>
          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            rows="7"
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            placeholder="Write a comment"
            required
          ></textarea>
        </div>

        {/* File Name */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Drawing Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Drawing Name"
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            required
          />
        </div>

        {/* Discipline */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Discipline
          </label>
          <select
            name="discipline"
            value={formData.discipline}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            required
          >
            <option value="">Select Discipline</option>
            <option value="Architecture">Architecture</option>
            <option value="Interior">Interior</option>
            <option value="Structural">Structural</option>
            <option value="MEP">MEP</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="col-span-2 flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            // className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-800 hover:bg-gray-300"
            className="px-6 py-2 text-sm font-medium text-white-500 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:hover:bg-gray-500 focus:ring-offset-2 transition duration-150 shadow-md flex items-center gap-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-150 shadow-md flex items-center gap-2"
          >
            Upload
          </button>
        </div>
      </div>
    </form>
  );
}






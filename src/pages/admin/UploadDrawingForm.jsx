// components/forms/UploadDrawingForm.jsx
import React, { useState } from "react";
import BASE_URL from "../../config";

export default function UploadDrawingForm({ onClose, onSubmit , selectedProject}) {
  const [formData, setFormData] = useState({
    name: "",
    remark:"",
    document: null,
    discipline: "",

  });

  const user = JSON.parse(localStorage.getItem("user"));
  const usernameID = user?.id;
  // console.log(usernameID);
  


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token"); // Adjust how you store/get the token
  
    const payload = new FormData();
    payload.append("project_id",selectedProject?.projectId); // You can make this dynamic as needed
    payload.append("name", formData.name);
    payload.append("remark", formData.remark);
    payload.append("discipline", formData.discipline);
    payload.append("status", "Under Review");
    payload.append("sent_by", usernameID); // Make this dynamic (probably logged-in user's ID)
    payload.append("previous_versions", "NULL");
    payload.append("latest_version_path", "NULL");
    payload.append("design_documents", formData.document);
  
    try {
      const response = await fetch(`${BASE_URL}/api/projects/design_drawing`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include token in header
        },
        body: payload,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload drawing");
      }
  
      const result = await response.json();
      // console.log("Upload successful:", result);
      // onSubmit(result); // You can pass the result to parent if needed
      onClose();
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 m-4">
      <div className="px-4 py-3 bg-white rounded-lg shadow-md">
      <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Drawing Name</span>
        <input
          type="text"
          name="name"
          placeholder="Drawing Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
        />
        </label>
        <br/>
        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Remark</span>
        <input
          type="text"
          name="remark"
          placeholder="Remark"
          value={formData.remark}
          onChange={handleChange}
          required
          className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
        />
        </label>
        <br/>
        <label className="block mt-4 text-sm">
        <span className="text-gray-700 font-semibold">Add Attachments</span>
        <input
          type="file"
          name="document"
          multiple
          accept=".pdf,.jpg,.png"
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        </label>
        <br/>
        <label className="block text-sm">
        <span className="text-gray-700 text-sm font-semibold">Discipline</span>
        <select
          name="discipline"
          value={formData.discipline}
          onChange={handleChange}
          required
          className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
        >
          <option value="">Select Discipline</option>
          <option value="Architecture">Architecture</option>
          <option value="Interior">Interior</option>
          <option value="Structural">Structural</option>
          <option value="MEP">MEP</option>
          <option value="Others">Others</option>
        </select>
        </label>
        <br/>
        <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
        >
          Submit
        </button>
      </div>
      </div>
    </form>
  );
}

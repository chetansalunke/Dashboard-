import React, { useState } from "react";
import DesignerRoleDropdown from "../../designer/RFI/DesignerRoleDropdown";

export default function CreateRFIForm({
  formData,
  setFormData,
  users,
  userID,
  selectedProjectId,
  onClose,
  onSubmit,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(users);
  console.log(users.role);

  const [dropdownKey, setDropdownKey] = useState(0);
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      documents: files,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="bg-gray-200 p-1 shadow-sm">
        <h1 className="text-xl font-semibold tracking-wide text-gray-500 uppercase">
          Create an RFI
        </h1>
      </div>
      <div className="w-full px-6 py-6 mb-8 bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Title</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Details</span>
          <input
            type="text"
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            required
          />
        </label>

        <DesignerRoleDropdown
          role={["admin"]}
          label="Send To"
          value={formData.send_to}
          onSelect={(selectedUser) =>
            setFormData((prev) => ({
              ...prev,
              send_to: selectedUser?.id || "",
            }))
          }
          width="w-full"
        />

        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Priority</span>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            required
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label className="block mt-4 text-sm mb-4">
          <span className="text-gray-700 text-sm font-semibold">
            Attachments
          </span>
          <input
            name="documents"
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
          />
        </label>

        <input type="hidden" name="status" value="Pending" />
        <input type="hidden" name="created_by" value={userID} />
        <input type="hidden" name="project_id" value={selectedProjectId} />

        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
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

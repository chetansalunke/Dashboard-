import React, { useState, useEffect } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import Header from "../../components/Header";
import axios from "axios";

export default function Projects() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userNames, setUserNames] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const token = localStorage.getItem("accessToken");

  const { id } = JSON.parse(localStorage.getItem("user"));
  console.log(id);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    duration: "",
    projectSize: "",
    assignTo: "",
    documents: [],
    pendingForm: "",
    userId: id,
  });
  useEffect(() => {
    // Fetch users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const names = storedUsers.map((user) => user.fullName);
    setUserNames(names);

    // Load projects from localStorage
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(storedProjects);

    setSelectedUser("");
  }, []);
  // Handle file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };
  // Remove a selected file
  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "documents") {
        formDataToSend.append(key, formData[key]);
      }
    });

    formData.documents.forEach((file) => {
      formDataToSend.append("documents", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/projects/add",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload Successful", response.data);
      alert("Project uploaded successfully!");

      setFormData({
        projectName: "",
        description: "",
        duration: "",
        projectSize: "",
        assignTo: "",
        documents: [],
        pendingForm: "",
        userId: "",
      });
    } catch (error) {
      console.error("Error uploading project", error);
      alert("Upload failed!");
    }
    setIsFormOpen(false);

    console.log(formDataToSend);
  };

  return (
    <div className="bg-gray-100">
      <Header />
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold tracking-wide text-gray-700 uppercase">
              Projects
            </h1>
            <div>
              {isFormOpen && (
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              >
                Create Project
              </button>
            </div>
          </div>

          <br />
          {isFormOpen && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md">
                <label className="block text-sm">
                  <span className="text-gray-700 text-sm font-semibold">
                    Project Name
                  </span>
                  <input
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                    placeholder="Enter Project Name"
                    required
                  />
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 text-sm font-semibold">
                    Description
                  </span>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                    rows="3"
                    placeholder="Enter project details."
                    required
                  ></textarea>
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700 text-sm font-semibold">
                    Duration (Days)
                  </span>
                  <input
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                    type="number"
                    placeholder="Duration in days"
                    required
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700 text-sm font-semibold">
                    Project Size (MB)
                  </span>
                  <input
                    name="projectSize"
                    value={formData.projectSize}
                    onChange={handleInputChange}
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                    type="number"
                    placeholder="Size in MB"
                    required
                  />
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 text-sm font-semibold">
                    Upload Documents
                  </span>
                  <input
                    name="documents"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full mt-1 text-sm border-gray-300 rounded-md shadow-sm"
                  />
                </label>

                {formData.documents.length > 0 && (
                  <div className="mt-3">
                    <h2 className="text-gray-700 text-sm font-semibold">
                      Selected Files:
                    </h2>
                    <ul className="mt-2 space-y-1">
                      {formData.documents.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-200 rounded-md"
                        >
                          <span className="text-gray-800 text-sm">
                            {file.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 text-xs font-bold"
                          >
                            ❌
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <label className="block text-sm">
                  <span className="text-gray-700">Assigned To</span>
                  <select
                    name="assignTo" // ✅ Fixed mismatch
                    value={formData.assignTo || ""} // ✅ Prevent undefined errors
                    onChange={handleInputChange}
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                    required
                  >
                    <option value="">Select a user</option>
                    {userNames.map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex justify-center mt-4">
                  <button className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          )}
          {/* {!isFormOpen && projects.length > 0 && (
            <div className="w-full overflow-hidden rounded-lg shadow-xs mt-6">
              <div className="w-full">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                      <th className="px-4 py-3">Project Name</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Project Size</th>
                      <th className="px-4 py-3">Assigned To</th>
                      <th className="px-4 py-3">Document</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {projects.map((project, index) => (
                      <tr key={index} className="text-gray-700">
                        <td className="px-4 py-3 text-sm break-words">
                          {project.projectName}
                        </td>
                        <td className="px-4 py-3 text-sm break-words">
                          {project.description}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {project.duration} days
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {project.projectSize} MB
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {project.assignedTo}
                        </td>
                        <td className="px-4 py-3">
                          {project.document ? (
                            <a
                              href={project.document}
                              download
                              className="px-3 py-1 text-sm font-medium leading-5 text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none"
                            >
                              Download
                            </a>
                          ) : (
                            <span className="text-gray-500">No file</span>
                          )}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDelete(index)}
                            className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import Header from "../../components/Header";

export default function Projects() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userNames, setUserNames] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    duration: "",
    projectSize: "",
    assignedTo: "",
    document: null,
  }
);

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

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleDelete = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert file to a URL before saving
    const projectWithFile = {
      ...formData,
      document: formData.document
        ? URL.createObjectURL(formData.document)
        : null,
    };

    // Update projects state
    const updatedProjects = [...projects, projectWithFile];
    setProjects(updatedProjects);

    // Save projects to localStorage
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    // Reset the form
    setFormData({
      projectName: "",
      description: "",
      duration: "",
      projectSize: "",
      assignedTo: "",
      document: null,
    });
    setSelectedUser(""); 
    setIsFormOpen(false);
  };
  

  return (
    <div className="bg-gray-100">
      <Header />
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <h1 className="text-xl font-semibold tracking-wide text-left text-gray-500 uppercase">
            Welcome, Manage & Track Your Projects.......
          </h1>
          <br />
          <div
            className={`flex ${isFormOpen ? "justify-between" : "justify-end"}`}
          >
            {isFormOpen && (
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                class="px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              >
                Back
              </button>
              
            )}
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              Create Project
            </button>
            
          </div>
<br/>
          {isFormOpen && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md">
                <label className="block text-sm">
                  <span className="text-gray-700">Project Name</span>
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
                  <span className="text-gray-700">Description</span>
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
                  <span className="text-gray-700">Duration (Days)</span>
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
                  <span className="text-gray-700">Project Size (MB)</span>
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

                <label className="block text-sm">
                  <span className="text-gray-700">Upload Document</span>
                  <input
                    name="document"
                    type="file"
                    onChange={handleInputChange}
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-gray-700">Assigned To</span>
                  <Listbox
                    value={selectedUser}
                    onChange={(value) => {
                      setSelectedUser(value);
                      setFormData((prev) => ({ ...prev, assignedTo: value }));
                    }}
                  >
                    <ListboxButton className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input text-left">
                      {selectedUser || "Select a user"}
                    </ListboxButton>
                    <ListboxOptions className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input">
                      {userNames.map((name, index) => (
                        <ListboxOption
                          key={index}
                          value={name}
                          className={({ active, selected }) =>
                            `px-4 py-2 cursor-pointer text-left ${
                              active || selected
                                ? "bg-purple-600 text-white"
                                : "text-black-300"
                            }`
                          }
                        >
                          {name}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Listbox>
                </label>

                <div className="flex justify-center mt-4">
                  <button className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          )}
          {!isFormOpen && (
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
                      <button onClick={() => handleDelete(index)} className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Delete</button>
                    </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

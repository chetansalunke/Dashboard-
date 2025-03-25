import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { FaTimes, FaDownload } from "react-icons/fa";
import BASE_URL from "../../config";

export default function DesignerHome() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  // Checklist items state (unchecked by default)
  const [checkedItems, setCheckedItems] = useState({});

  // Toggle checkbox state
  const handleCheckboxChange = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle state
    }));
  };

  // Checklist items
  const checklistItems = [
    "Location of ducts",
    "Necessary details",
    "Legend (wall types)",
    "Door-window schedule",
    "Strip sections",
    "Grid references",
    "Detailed dimensions",
    "Levels, dimensions",
    "Duct/Vent termination details",
    "Lift shafts/Service shafts-Clear cutout sizes as per requirements",
    "Grid markings with nos.",
    "Retaining wall thickness",
    "Enlarged detail (optional)",
    "Hardscape finish details",
    "Key plans",
    "Detail Scale",
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      const username = user?.username || "";

      try {
        const response = await fetch(`${BASE_URL}/api/projects/all`);
        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        if (data && Array.isArray(data.projects)) {
          const userProjects = data.projects.filter(
            (project) => project.assignTo === username
          );
          setProjects(userProjects);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-hidden flex">
        {!viewingDocument ? (
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading projects...</p>
            ) : !selectedProject ? (
              <div className="text-gray-500">
                <h5 className="text-2xl font-semibold text-gray-700">
                  Welcome{" "}
                  {JSON.parse(localStorage.getItem("user"))?.username || ""}
                </h5>
                <div className="w-full overflow-hidden rounded-lg shadow mt-4">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full whitespace-no-wrap">
                      <thead>
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                          <th className="px-4 py-3">Task Name</th>
                          <th className="px-4 py-3">Project Name</th>
                          <th className="px-4 py-3">Assigned By</th>
                          <th className="px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y">
                        {projects.length > 0 ? (
                          projects.map((project, index) => (
                            <tr key={index} className="text-gray-700">
                              <td className="px-4 py-3 text-sm">
                                {project.taskName || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {project.projectName}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {project.assignedBy || "Admin"}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <button
                                  onClick={() => setSelectedProject(project)}
                                  className="px-3 py-1 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-4 py-3 text-center text-gray-500"
                            >
                              No projects assigned to you.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              /* 🟢 Task Details & Checklist */
              <div className="w-full overflow-x-auto">
                <p className="text-xl font-semibold text-gray-700">
                  Task Assigned
                </p>
                <div className="mt-5 p-5 bg-white shadow-lg rounded-lg">
                  <div className="flex justify-between">
                    <h2 className="text-xl">{selectedProject.projectName}</h2>
                    {/* Format the Submission Date */}
                    <h6 className="text-xl">
                      Start Date:{" "}
                      {
                        new Date(selectedProject.submissionDate)
                          .toISOString()
                          .split("T")[0]
                      }
                    </h6>

                    {/* Corrected Due Date Calculation */}
                    <h6 className="text-xl">
                      Due Date:{" "}
                      {
                        new Date(
                          new Date(selectedProject.submissionDate).getTime() +
                            selectedProject.duration * 24 * 60 * 60 * 1000
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                    </h6>
                    <button
                      onClick={() => setSelectedProject(null)} // Hide details and show table again
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      X
                    </button>
                  </div>
                  <hr />
                  <p className="mt-2">
                    <strong className="text-gray-7000 text-xm font-semibold">
                      Instructions
                    </strong>
                    <br />
                    {selectedProject.description || "N/A"}
                  </p>
                  <br />
                  <strong className="text-gray-7000 text-xm font-semibold">
                    Input
                  </strong>
                  <p className="px-4 py-2">
                    {selectedProject.documents.length > 0 ? (
                      <div className="flex flex-wrap gap-4">
                        {selectedProject.documents.map((docUrl, index) => {
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                            docUrl
                          ); // Check if it's an image

                          return (
                            <div
                              key={index}
                              className="flex flex-col items-center"
                            >
                              {isImage ? (
                                <img
                                  src={docUrl}
                                  alt="Document Thumbnail"
                                  className="w-12 h-12 object-cover rounded-lg border"
                                />
                              ) : (
                                <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-600 border rounded-lg">
                                  📄
                                </div>
                              )}
                              <a
                                href={docUrl}
                                download
                                className="flex items-center gap-1 text-purple-600 hover:text-purple-800 hover:underline text-sm mt-1"
                              >
                                <FaDownload className="text-purple-600" />
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-500">No files</span>
                    )}
                  </p>
                  <br />
                  <p className="mt-2">
                    <strong className="text-gray-7000 text-xm font-semibold">
                      Checklist
                    </strong>
                    <br />
                    {Array.isArray(selectedProject.documents) &&
                    selectedProject.documents.length > 0 ? (
                      selectedProject.documents.map((docUrl, index) => (
                        <button
                          key={index}
                          onClick={() => setViewingDocument(docUrl)}
                          className="block mt-1 text-purple-600 hover:text-purple-800 hover:underline text-sm"
                        >
                          Document {index + 1}
                        </button>
                      ))
                    ) : (
                      <span className="text-gray-500">No files</span>
                    )}
                  </p>
                  <br />
                  <p className="mt-2">
                    <strong className="text-gray-7000 text-xm font-semibold">
                      Assigned By
                    </strong>
                    <br />
                    {selectedProject.assignedBy || "Admin"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* 🟢 Document Viewer - Only Takes Space Below Navbar */}
        {viewingDocument && (
          <div className="flex-1 flex bg-white shadow-lg">
            {/* Left Side - Document Preview (Takes 2/3 width) */}
            <div className="w-2/3 flex flex-col">
              <div className="p-3 flex justify-end ">
                <button
                  onClick={() => setViewingDocument(null)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              {/\.(jpg|jpeg|png|gif|webp)$/i.test(viewingDocument) ? (
                // If it's an image, scale it up and center it
                <img
                  src={viewingDocument}
                  alt="Document Preview"
                  className="max-w-[90%] max-h-[80vh] object-contain rounded-lg shadow-lg"
                />
              ) : (
                // If it's a PDF or other file, make it full size
                <iframe
                  src={viewingDocument}
                  className="w-full h-[80vh] border-none"
                  title="Document Preview"
                />
              )}
            </div>

            {/* Right Side - "Hello" Content Column (Takes 1/3 width) */}
            <div className="w-1/3 p-5  shadow-lg rounded-lg">
              {/* Checklist Header */}
              <h3 className="text-lg font-semibold mb-3">
                Pre Upload Checklist
              </h3>

              {/* Checklist Items */}
              <ul className="space-y-2">
                {checklistItems.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!!checkedItems[index]} // Ensure it's boolean
                      onChange={() => handleCheckboxChange(index)}
                      className="w-4 h-4"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Final Message & Upload Button */}
              <div className="mt-4 flex justify-center">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

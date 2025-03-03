import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { FaDownload } from "react-icons/fa"; // Import download icon

export default function DesignerHome() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null); // Track selected project

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const username = user?.username || "";

    fetch("http://65.0.178.244:3000/api/projects/all")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.projects)) {
          const userProjects = data.projects.filter(
            (project) => project.assignTo === username
          );
          setProjects(userProjects);
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <div className="bg-gray-100 flex h-screen">
      <div className="flex-1 h-full flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <div className="flex justify-between">
              <h5 className="my-6 text-2xl font-semibold text-gray-700">
                Welcome{" "}
                {JSON.parse(localStorage.getItem("user"))?.username || ""}
              </h5>
            </div>

            {/* Hide table when project details are visible */}
            {!selectedProject && (
              <div className="w-full overflow-hidden rounded-lg shadow">
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
                                onClick={() => setSelectedProject(project)} // Show details
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
            )}

            {/* Project Details Section */}
            {selectedProject && (
              <div className="w-full overflow-x-auto">
                <p className="my-6 text-xl font-semibold text-gray-700">
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
                  <hr />
                  <p className="mt-2">
                    <strong className="text-gray-7000 text-xm font-semibold">
                      Instructions
                    </strong>{" "}
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
                  <p className="mt-2">
                    <br />
                    <strong className="text-gray-7000 text-xm font-semibold">
                      Assigned By
                    </strong>{" "}
                    <br />
                    {selectedProject.assignedBy || "Admin"}
                  </p>
                </div>
              </div>
            )}
            <div className="container px-6 my-6 grid flex justify-end">
              <br />
              {selectedProject && (
                <button
                  onClick={() => handleUpload()}
                  className="ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  Upload
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

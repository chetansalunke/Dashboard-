import React, { useState, useEffect } from "react";
import { FaTimes, FaDownload, FaUserCircle } from "react-icons/fa";
import BASE_URL from "../../config";
import ProjectDropdown from "./ProjectDropdown";
import TaskAssignTable from "./TaskAssignTable";

export default function DesignerHome() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [submittedChecklists, setSubmittedChecklists] = useState([]);

  const [selectedProjectName, setSelectedProjectName] =
    useState("All Projects");

  const handleCheckboxChange = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const usernameID = user?.id;

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setUploadedDocument(fileURL);
    }
  };

  const handleSubmitChecklist = () => {
    const selectedItems = checklistItems.filter(
      (_, index) => checkedItems[index]
    );

    if (uploadedDocument && selectedItems.length > 0) {
      const newChecklist = {
        document: uploadedDocument, // Associate checklist with the document
        checklist: selectedItems,
        timestamp: new Date().toLocaleString(),
      };

      setSubmittedChecklists((prev) => [...prev, newChecklist]);
      setUploadedDocument(null);
      setCheckedItems({});
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const username = user?.username || "";

      try {
        const response = await fetch(
          `${BASE_URL}/api/projects/assigned-projects/${usernameID}`
        );
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        if (data && Array.isArray(data.projects)) {
          const userProjects = data.projects.filter(
            (project) => project.assignTo === username
          );
          setProjects(userProjects);
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
        {!uploadedDocument ? (
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading projects...</p>
            ) : !selectedProject ? (
              <div>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <FaUserCircle className="text-3xl text-gray-500" />
                  <h5 className="text-xl font-semibold tracking-wide text-gray-500 uppercase">
                    Welcome{" "}
                    {JSON.parse(localStorage.getItem("user"))?.username || ""}
                  </h5>

                  {/* Search */}
                  <div className="relative w-[280px]">
                    <div className="absolute inset-y-0 left-3 flex items-center">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      className="w-full pl-10 pr-2 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none"
                      type="text"
                      placeholder="Search"
                      aria-label="Search"
                      onChange={(e) => onSearchChange(e.target.value)}
                    />
                  </div>

                  {/* Dropdown for project filtering */}

                  <div className="flex items-center gap-4">
                    <ProjectDropdown
                      userId={usernameID}
                      onSelectProject={(projectId) => {
                        console.log("Selected Project ID:", projectId);
                        // You can store this projectId in state and use it for submission
                      }}
                    />
                  </div>
                </div>

                <span className="text-[19px] font-semibold tracking-wide text-black">
                  Task Assigned
                </span>

                <div className="w-full max-h-[50vh] overflow-hidden rounded-lg shadow mt-2 mb-4">
                  <div className="w-full max-h-[250px] overflow-y-auto">
                  <TaskAssignTable userId={usernameID} />
                  </div>
                </div>

                <span className="text-[19px] font-semibold tracking-wide text-black">
                  Upcoming Deliverables
                </span>

                <div className="w-full max-h-[50vh] overflow-hidden rounded-lg shadow mt-2">
                  <div className="w-full max-h-[220px] overflow-y-auto">
                    <table className="w-full table-auto">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                          <th className="px-4 py-3">Task Name</th>
                          <th className="px-4 py-3">Project Name</th>
                          <th className="px-4 py-3">Assigned By</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y">
                        {projects
                          .filter((project) =>
                            selectedProjectName === "All Projects"
                              ? true
                              : project.projectName === selectedProjectName
                          )
                          .map((project, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 text-gray-700"
                            >
                              <td className="px-4 py-3 text-sm">
                                {project.taskName || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {project.projectName}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {project.assignedBy || "Admin"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              /* 🟢 Task Details & Checklist */
              <div className="w-full overflow-x-auto">
                <h1 className="text-xl font-semibold tracking-wide text-gray-500 uppercase">
                  Task Assigned
                </h1>
                <div className="mt-5 p-5 bg-white shadow-lg rounded-lg">
                  <div className="flex justify-between">
                    <h1 className="text-xm font-semibold tracking-wide text-gray-500 uppercase">
                      {selectedProject.projectName}
                    </h1>
                    {/* Format the Submission Date */}
                    <h1 className="text-xm font-semibold tracking-wide text-gray-500 uppercase">
                      Start Date:{" "}
                      {
                        new Date(selectedProject.submissionDate)
                          .toISOString()
                          .split("T")[0]
                      }
                    </h1>

                    {/* Corrected Due Date Calculation */}
                    <h1 className="text-xm font-semibold tracking-wide text-gray-500 uppercase">
                      Due Date:{" "}
                      {
                        new Date(
                          new Date(selectedProject.submissionDate).getTime() +
                            selectedProject.duration * 24 * 60 * 60 * 1000
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                    </h1>
                    <button
                      onClick={() => setSelectedProject(null)} // Hide details and show table again
                      className="px-2 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                    >
                      X
                    </button>
                  </div>
                  <hr />
                  <label className="block text-sm mb-4 mt-2">
                    <strong className="text-gray-700 text-xm font-semibold">
                      Instructions
                      <br />
                      {selectedProject.description || "N/A"}
                    </strong>
                  </label>
                  <br />
                  <label className="block text-sm mb-4">
                    <strong className="text-gray-700 text-xm font-semibold">
                      Input
                      <p className="block text-sm mt-3">
                        {selectedProject.documents.length > 0 ? (
                          <div className="flex flex-wrap gap-4">
                            {selectedProject.documents.map((docUrl, index) => {
                              const isImage =
                                /\.(jpg|jpeg|png|gif|webp)$/i.test(docUrl); // Check if it's an image

                              return (
                                <div
                                  key={index}
                                  className="flex flex-col items-center"
                                >
                                  {isImage ? (
                                    <img
                                      src={docUrl}
                                      alt="Document Thumbnail"
                                      className="w-10 h-10 object-cover rounded-lg border"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 border rounded-lg">
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
                    </strong>
                  </label>
                  <br />
                  <label className="block text-sm mb-4">
                    <strong className="text-gray-700 text-xm font-semibold">
                      Checklist
                      <br />
                      {submittedChecklists.length > 0 ? (
                        submittedChecklists.map((submission, index) => (
                          <div key={index} className="pl-4 pt-2">
                            <button
                              onClick={() =>
                                setViewingDocument(submission.document)
                              }
                              className="text-blue-600 hover:underline"
                            >
                              Document {index + 1}
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          No checklists submitted yet.
                        </p>
                      )}
                    </strong>
                  </label>
                  <br />
                  <label className="block text-sm mb-4">
                    <strong className="text-gray-700 text-xm font-semibold">
                      Assigned By
                      <br />
                      {selectedProject.assignedBy || "Admin"}
                    </strong>
                  </label>
                </div>
                <div className="mt-4 flex justify-end">
                  <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="fileUpload"
                    className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  >
                    Upload Document
                  </label>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {viewingDocument && (
          <div className="flex flex-row w-full h-screen overflow-hidden">
            <div className="w-2/3 bg-white p-4 overflow-y-auto overflow-x-hidden scrollbar-fix">
              <div className="flex justify-end">
                <button
                  onClick={() => setViewingDocument(null)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              {/\.(jpg|jpeg|png|gif|webp)$/i.test(viewingDocument) ? (
                <img
                  src={viewingDocument}
                  alt="Document Preview"
                  className="max-w-[90%] max-h-[80vh] object-contain rounded-lg shadow-lg"
                />
              ) : (
                <iframe
                  src={viewingDocument}
                  className="w-full h-[80vh] border-none"
                  title="Document Preview"
                ></iframe>
              )}
            </div>
            <div className="w-1/3 p-5 bg-white shadow-lg">
              <h3 className="text-lg font-semibold mb-3">Uploaded Checklist</h3>
              {submittedChecklists.filter(
                (sub) => sub.document === viewingDocument
              ).length > 0 ? (
                submittedChecklists
                  .filter((sub) => sub.document === viewingDocument) // Only show checklist of this document
                  .map((submission, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 bg-white rounded-lg shadow"
                    >
                      <ul className="list-disc list-inside text-gray-700 mt-2">
                        {submission.checklist.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500">
                  No checklists submitted for this document.
                </p>
              )}
            </div>
          </div>
        )}

        {uploadedDocument && (
          <div className="flex flex-row w-full p-6">
            <div className="w-2/3 bg-white p-4 ">
              <div className="flex justify-end">
                <button
                  onClick={() => setUploadedDocument(null)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <iframe
                src={uploadedDocument}
                className="w-full h-[80vh] border"
                title="Uploaded Document"
              ></iframe>
            </div>

            <div className="w-1/3 p-5 bg-white shadow-lg">
              <h3 className="text-lg font-semibold mb-3">
                Pre Upload Checklist
              </h3>
              <ul className="space-y-2">
                {checklistItems.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!!checkedItems[index]}
                      onChange={() => handleCheckboxChange(index)}
                      className="w-4 h-4"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-center">
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                  onClick={handleSubmitChecklist}
                >
                  Submit Checklist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

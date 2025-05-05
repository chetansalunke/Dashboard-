import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../../config";
import ProjectDropdown from "./ProjectDropdown";

export default function DesignerHome() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [openChecklistTaskId, setOpenChecklistTaskId] = useState(null);
  const [openUploadModalTaskId, setOpenUploadModalTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);


  const user = JSON.parse(localStorage.getItem("user"));
  const usernameID = user?.id;

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

useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/projects/assigned-tasks/${usernameID}`
      );
      const filteredTasks = selectedProjectId
        ? response.data.tasks.filter((task) => task.project_id == selectedProjectId)
        : response.data.tasks;
      setTasks(filteredTasks);        
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  fetchTasks();
}, [selectedProjectId, usernameID]);

  const closeModal = () => {
    setSelectedTask(null);
    setOpenChecklistTaskId(null);
    setOpenUploadModalTaskId(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto p-6">
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <FaUserCircle className="text-3xl text-gray-500" />
              <h5 className="text-xl font-semibold tracking-wide text-gray-500 uppercase">
                Welcome{" "}
                {JSON.parse(localStorage.getItem("user"))?.username || ""}
              </h5>

              {!selectedTask && (
                <>
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
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <ProjectDropdown
                      userId={usernameID}
                      onSelectProject={setSelectedProjectId} // Passing the setter function here
                    />
                  </div>
                </>
              )}
            </div>

            {!selectedTask && (
              <span className="text-[19px] font-semibold tracking-wide text-black">
                Task Assigned
              </span>
            )}

            <div
              className={`w-full rounded-lg mt-2 mb-4  ${
                !selectedTask ? "max-h-[250px] overflow-y-auto" : ""
              }`}
            >
              <div>
                {!selectedTask ? (
                  <table className="w-full table-auto">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                        <th className="px-4 py-3">Task Name</th>
                        <th className="px-4 py-3">Project Name</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                      {tasks.length > 0 ? (
                        tasks.map((task) => (
                          <tr
                            key={task.id}
                            className="hover:bg-gray-50 text-gray-700"
                          >
                            <td className="px-4 py-3 text-sm">
                              {task.task_name}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {task.project_id}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {task.priority}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={() => setSelectedTask(task)}
                                className="px-3 py-1 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center p-4">
                            No tasks found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <>
                    <h1 className="text-xm font-semibold tracking-wide text-gray-500 uppercase">
                      Task Assigned
                    </h1>
                    <div className="bg-white shadow-lg rounded-lg p-3 m-2">
                      <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xm font-semibold tracking-wide text-gray-500 uppercase">
                          Project Name: {selectedTask.project_id}
                        </h1>
                        <h1 className="text-xm font-semibold tracking-wide text-gray-500 uppercase">
                          Start Date:{" "}
                          {
                            new Date(selectedTask.start_date)
                              .toISOString()
                              .split("T")[0]
                          }
                        </h1>
                        <h1 className="text-xm font-semibold tracking-wide text-gray-500 uppercase">
                          Due Date:{" "}
                          {
                            new Date(selectedTask.due_date)
                              .toISOString()
                              .split("T")[0]
                          }
                        </h1>
                        <button
                          onClick={closeModal}
                          className="px-2 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                        >
                          X
                        </button>
                      </div>
                      <hr />

                      <div className="space-y-3 text-gray-700 mt-3">
                        <label className="block mb-4 mt-2">
                          <strong className="text-gray-700 text-xm font-semibold">
                            Task Name <br />
                            {selectedTask.task_name || "N/A"}
                          </strong>
                        </label>

                        <label className="block text-sm mb-4 mt-2">
                          <strong className="text-gray-700 text-xm font-semibold">
                            Priority <br />
                            {selectedTask.priority || "N/A"}
                          </strong>
                        </label>

                        <label className="block text-sm mb-4">
                          <strong className="text-gray-700 text-xm font-semibold">
                            Input
                            <p className="block text-sm mt-3">
                              {selectedTask.assign_task_document ? (
                                <div className="flex flex-wrap gap-4">
                                  <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 border rounded-lg">
                                      📄
                                    </div>
                                    <a
                                      href={`${BASE_URL}/${selectedTask.assign_task_document.replace(
                                        /\\/g,
                                        "/"
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      download
                                      className="flex items-center gap-1 text-purple-600 hover:text-purple-800 hover:underline text-sm mt-1"
                                    >
                                      View
                                    </a>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-500">No files</span>
                              )}
                            </p>
                          </strong>
                        </label>

                        <label className="block text-sm mb-4">
                          <strong className="text-gray-700 text-sm font-semibold">
                            Checklist
                          </strong>
                          <br />
                          <button
                            onClick={() =>
                              setOpenChecklistTaskId((prevId) =>
                                prevId === selectedTask.id
                                  ? null
                                  : selectedTask.id
                              )
                            }
                            className="mt-2 px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-700"
                          >
                            {openChecklistTaskId === selectedTask.id
                              ? "Close"
                              : "Show"}
                          </button>

                          {openChecklistTaskId === selectedTask.id && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                              <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                  <h2 className="text-lg font-semibold text-gray-800">
                                    ✅ Checklist: {selectedTask.task_name}
                                  </h2>
                                </div>
                                {Array.isArray(
                                  JSON.parse(selectedTask.checklist)
                                ) &&
                                  JSON.parse(selectedTask.checklist).map(
                                    (item, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start gap-2 p-3 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm"
                                      >
                                        <svg
                                          className="w-5 h-5 text-green-500 mt-1"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                          {item}
                                        </span>
                                      </div>
                                    )
                                  )}
                              </div>
                            </div>
                          )}
                        </label>

                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() =>
                              setOpenUploadModalTaskId(selectedTask.id)
                            }
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-700 rounded-md hover:bg-purple-700"
                          >
                            Upload
                          </button>
                        </div>

                        {openUploadModalTaskId === selectedTask.id && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="relative w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
                              <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                  📎 Upload
                                </h2>
                                <button
                                  onClick={() => setOpenUploadModalTaskId(null)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  X
                                </button>
                              </div>

                              <div className="flex space-x-6">
                                {/* Left: Document Preview */}
                                <div className="w-1/2 border border-gray-200 rounded-md p-4 bg-gray-50">
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Attachment
                                  </label>
                                  <input
                                    type="file"
                                    className="w-full mb-4"
                                    onChange={(e) =>
                                      setUploadedDocument(e.target.files[0])
                                    }
                                  />

                                  {uploadedDocument ? (
                                    uploadedDocument.type.startsWith(
                                      "image/"
                                    ) ? (
                                      <img
                                        src={URL.createObjectURL(
                                          uploadedDocument
                                        )}
                                        alt="preview"
                                        className="w-full rounded"
                                      />
                                    ) : uploadedDocument.type ===
                                      "application/pdf" ? (
                                      <iframe
                                        src={URL.createObjectURL(
                                          uploadedDocument
                                        )}
                                        title="PDF Preview"
                                        className="w-full h-64 rounded"
                                      />
                                    ) : (
                                      <div className="p-3 bg-white border rounded shadow-sm">
                                        <p className="text-gray-600">
                                          📄 {uploadedDocument.name}
                                        </p>
                                      </div>
                                    )
                                  ) : (
                                    <p className="text-gray-500 text-sm">
                                      No document selected
                                    </p>
                                  )}
                                </div>

                                {/* Right: Checklist */}
                                <div className="w-1/2 overflow-y-auto max-h-[70vh] border border-gray-200 rounded-md p-4 bg-white">
                                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                    Checklist
                                  </h3>
                                  {Array.isArray(
                                    JSON.parse(selectedTask.checklist)
                                  ) &&
                                    JSON.parse(selectedTask.checklist).map(
                                      (item, index) => (
                                        <div
                                          key={index}
                                          className="flex items-start gap-2 p-2 mb-2 bg-gray-50 border border-gray-100 rounded"
                                        >
                                          <svg
                                            className="w-5 h-5 text-green-500 mt-1"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                          <span className="text-sm text-gray-700">
                                            {item}
                                          </span>
                                        </div>
                                      )
                                    )}
                                </div>
                              </div>

                              <div className="flex justify-end mt-4">
                                <button
                                  onClick={() => {
                                    console.log("Uploading:", uploadedDocument);
                                  }}
                                  className="px-4 py-2 text-sm font-medium text-white bg-purple-700 rounded-md hover:bg-purple-800"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {!selectedTask && (
              <>
                <span className="text-[19px] font-semibold tracking-wide text-black">
                  Upcoming Deliverables
                </span>
                <div className="w-full max-h-[250px] overflow-y-auto"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

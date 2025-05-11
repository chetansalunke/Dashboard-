import React, { useState, useEffect } from "react";
import { FaUserCircle, FaCheckCircle, FaClock } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../../config";
import ProjectDropdown from "./ProjectDropdown";

export default function DesignerHome() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [upcomingDeliverables, setUpcomingDeliverables] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [openChecklistTaskId, setOpenChecklistTaskId] = useState(null);
  const [openUploadModalTaskId, setOpenUploadModalTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("accessToken");

  const user = JSON.parse(localStorage.getItem("user"));
  const usernameID = user?.id;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-100";
      case "Medium":
        return "text-orange-600 bg-orange-100";
      case "Low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-100";
      case "In Progress":
        return "text-blue-600 bg-blue-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const username = user?.username || "";

      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(
          `${BASE_URL}/api/projects/assigned-projects/${usernameID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
        const allTasks = response.data.tasks || [];

        // Filter tasks by project if selected
        const filteredTasks = selectedProjectId
          ? allTasks.filter((task) => task.project_id == selectedProjectId)
          : allTasks;

        // Apply search filter if present
        const searchFilteredTasks = searchTerm
          ? filteredTasks.filter(
              (task) =>
                task.task_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                task.projectName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
          : filteredTasks;

        // Sort tasks by due date (closest first)
        const sortedTasks = [...searchFilteredTasks].sort(
          (a, b) => new Date(a.due_date) - new Date(b.due_date)
        );

        setTasks(sortedTasks);

        // setTasks(searchFilteredTasks);

        // // Set upcoming deliverables - tasks that are not completed and due in the next 7 days
        // const now = new Date();
        // const sevenDaysFromNow = new Date();
        // sevenDaysFromNow.setDate(now.getDate() + 7);

        // const upcoming = allTasks.filter((task) => {
        //   const dueDate = new Date(task.due_date);
        //   return (
        //     task.status !== "Completed" &&
        //     dueDate >= now &&
        //     dueDate <= sevenDaysFromNow
        //   );
        // });

        // // Sort by due date (closest first)
        // upcoming.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

        // setUpcomingDeliverables(upcoming);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [selectedProjectId, usernameID, searchTerm]);

  useEffect(() => {
    const fetchDeliverables = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get(
          `${BASE_URL}/api/projects/drawing-list/${usernameID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUpcomingDeliverables(response.data);
      } catch (error) {
        console.error("Error fetching deliverables:", error);
      }
    };

    if (usernameID) {
      fetchDeliverables();
    }
  }, [usernameID]);

  useEffect(() => {
    // Initialize checklist items when a task is selected
    if (selectedTask) {
      const checklistItems = JSON.parse(selectedTask.checklist);
      const initialCheckedState = {};

      // If task is completed, check all items by default
      if (selectedTask.status === "Completed") {
        checklistItems.forEach((item, index) => {
          initialCheckedState[index] = true;
        });
      } else {
        checklistItems.forEach((item, index) => {
          initialCheckedState[index] = false;
        });
      }

      setCheckedItems(initialCheckedState);
    }
  }, [selectedTask]);

  const closeModal = () => {
    setSelectedTask(null);
    setOpenChecklistTaskId(null);
    setOpenUploadModalTaskId(null);
    setUploadedDocument(null);
    setCheckedItems({});
  };

  const handleCheckboxChange = (index) => {
    // Don't allow changes if task is completed
    if (selectedTask?.status === "Completed") return;

    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmit = async () => {
    console.log("outside the try");
    try {
      console.log("Inside try make complete button");
      // Check if all items are checked
      const allChecked = Object.values(checkedItems).every(
        (value) => value === true
      );

      if (!allChecked) {
        alert("Please complete all checklist items before submitting.");
        return;
      }

      // Here you would make an API call to update the task status
      await axios.put(
        `${BASE_URL}/api/projects//assignTask/${selectedTask.id}/status`,
        {
          status: "Completed",
        }
      );

      // Close the modal and refresh tasks
      setOpenUploadModalTaskId(null);
      setSelectedTask(null);

      // Refresh tasks list
      const response = await axios.get(
        `${BASE_URL}/api/projects/assigned-tasks/${usernameID}`
      );
      const filteredTasks = selectedProjectId
        ? response.data.tasks.filter(
            (task) => task.project_id == selectedProjectId
          )
        : response.data.tasks;
      setTasks(filteredTasks);

      // Update upcoming deliverables
      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);

      const upcoming = response.data.tasks.filter((task) => {
        const dueDate = new Date(task.due_date);
        return (
          task.status !== "Completed" &&
          dueDate >= now &&
          dueDate <= sevenDaysFromNow
        );
      });

      upcoming.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      setUpcomingDeliverables(upcoming);
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto p-6">
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
              <FaUserCircle className="text-3xl text-purple-500" />
              <h5 className="text-xl font-semibold tracking-wide text-gray-700">
                Welcome{" "}
                <span className="text-purple-600">
                  {JSON.parse(localStorage.getItem("user"))?.username || ""}
                </span>
              </h5>

              {!selectedTask && (
                <>
                  <div className="relative w-[280px] ml-auto">
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
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <ProjectDropdown
                      userId={usernameID}
                      onSelectProject={setSelectedProjectId}
                    />
                  </div>
                </>
              )}
            </div>

            {!selectedTask && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-semibold tracking-wide text-gray-700 mb-4 flex items-center">
                  <FaCheckCircle className="text-purple-500 mr-2" />
                  Task Assigned
                </h2>
                <div className="max-h-[300px] overflow-y-auto rounded-lg border border-gray-200">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr className="text-xs font-semibold tracking-wide text-left text-gray-600 uppercase border-b">
                        <th className="px-4 py-3">Task Name</th>
                        <th className="px-4 py-3">Project Name</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                      {tasks.length > 0 ? (
                        tasks.map((task) => (
                          <tr
                            key={task.id}
                            className={`hover:bg-gray-50 text-gray-700 ${
                              task.status === "Completed" ? "bg-gray-50" : ""
                            }`}
                          >
                            <td className="px-4 py-3 text-sm">
                              {task.task_name}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {task.projectName}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                                  task.priority
                                )}`}
                              >
                                {task.priority}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  task.status || "Pending"
                                )}`}
                              >
                                {task.status || "Pending"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {formatDate(task.due_date)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={() => setSelectedTask(task)}
                                className={`px-3 py-1 text-sm font-medium text-white ${
                                  task.status === "Completed"
                                    ? "bg-gray-500 hover:bg-gray-600"
                                    : "bg-purple-500 hover:bg-purple-600"
                                } rounded-md transition-colors`}
                              >
                                {task.status === "Completed"
                                  ? "View"
                                  : "Action"}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center p-4">
                            No tasks found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTask && (
              <div className="bg-white shadow-lg rounded-lg p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-800">
                      {selectedTask.task_name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {selectedTask.projectName}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(
                        selectedTask.priority
                      )}`}
                    >
                      {selectedTask.priority}
                    </span>

                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        selectedTask.status || "Pending"
                      )}`}
                    >
                      {selectedTask.status || "Pending"}
                    </span>

                    <button
                      onClick={closeModal}
                      className="p-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Start Date</p>
                    <p className="font-medium">
                      {formatDate(selectedTask.start_date)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Due Date</p>
                    <p className="font-medium">
                      {formatDate(selectedTask.due_date)}
                    </p>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                      Input Document
                    </h3>
                    {selectedTask.assign_task_document ? (
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-10 h-10 flex items-center justify-center bg-purple-100 text-purple-600 rounded-lg mr-3">
                            📄
                          </div>
                          <div>
                            <p className="text-sm font-medium">Document</p>
                            <a
                              href={`${BASE_URL}/${selectedTask.assign_task_document.replace(
                                /\\/g,
                                "/"
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="flex items-center gap-1 text-purple-600 hover:text-purple-800 hover:underline text-sm"
                            >
                              View Document
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No input document available
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                      Requirements Checklist
                    </h3>
                    <button
                      onClick={() =>
                        setOpenChecklistTaskId((prevId) =>
                          prevId === selectedTask.id ? null : selectedTask.id
                        )
                      }
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600 transition-colors"
                    >
                      {openChecklistTaskId === selectedTask.id
                        ? "Hide Checklist"
                        : "View Checklist"}
                    </button>

                    {openChecklistTaskId === selectedTask.id && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                              ✅ Checklist: {selectedTask.task_name}
                            </h2>
                            <button
                              onClick={() => setOpenChecklistTaskId(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          {Array.isArray(JSON.parse(selectedTask.checklist)) &&
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
                  </div>

                  {selectedTask.status !== "Completed" && (
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() =>
                          setOpenUploadModalTaskId(selectedTask.id)
                        }
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors shadow-sm"
                      >
                        Mark as Complete
                      </button>
                    </div>
                  )}

                  {openUploadModalTaskId === selectedTask.id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="relative w-full max-w-6xl p-6 bg-white rounded-lg shadow-lg max-h-[100vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-semibold text-gray-800">
                            Complete Task: {selectedTask.task_name}
                          </h2>
                          <button
                            onClick={() => setOpenUploadModalTaskId(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
                          {/* Left: Input Document Preview */}
                          <div className="w-full lg:w-1/1 border border-gray-200 rounded-md p-4 bg-gray-50">
                            {selectedTask.assign_task_document ? (
                              <div className="flex flex-col items-center">
                                {(() => {
                                  const filePath =
                                    selectedTask.assign_task_document.replace(
                                      /\\/g,
                                      "/"
                                    );
                                  const fileUrl = `${BASE_URL}/${filePath}`;
                                  const fileExtension = filePath
                                    .split(".")
                                    .pop()
                                    .toLowerCase();

                                  // Image formats that can be directly displayed
                                  if (
                                    [
                                      "jpg",
                                      "jpeg",
                                      "png",
                                      "gif",
                                      "svg",
                                      "webp",
                                    ].includes(fileExtension)
                                  ) {
                                    return (
                                      <div className="w-full flex justify-center">
                                        <img
                                          src={fileUrl}
                                          alt="Document Preview"
                                          className="max-w-full max-h-[70vh] object-contain rounded border border-gray-300"
                                        />
                                      </div>
                                    );
                                  }
                                  // PDF files
                                  else if (fileExtension === "pdf") {
                                    return (
                                      <iframe
                                        src={fileUrl}
                                        title="PDF Document Preview"
                                        className="w-full h-[70vh] rounded border border-gray-300"
                                      />
                                    );
                                  }
                                  // All other file types (including RVT)
                                  else {
                                    return (
                                      <div className="text-center py-10">
                                        <div className="mb-4 text-6xl">📄</div>
                                        <p className="text-gray-700 font-medium mb-2">
                                          {filePath.split("/").pop()} (
                                          {fileExtension.toUpperCase()})
                                        </p>
                                        <p className="text-gray-500 mb-4">
                                          Direct preview not available for this
                                          file type
                                        </p>
                                        <a
                                          href={fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 inline-flex items-center"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                            />
                                          </svg>
                                          Download File
                                        </a>
                                      </div>
                                    );
                                  }
                                })()}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">
                                No input document available
                              </p>
                            )}
                          </div>

                          {/* Right: Checklist */}
                          <div className="w-full lg:w-1/3 border border-gray-200 rounded-md p-4 bg-white">
                            <h3 className="text-md font-semibold text-gray-700 mb-3">
                              Completion Checklist
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                              Please verify that all requirements have been met
                              before marking the task as complete.
                            </p>

                            {Array.isArray(
                              JSON.parse(selectedTask.checklist)
                            ) &&
                              JSON.parse(selectedTask.checklist).map(
                                (item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 p-3 mb-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`checklist-item-${index}`}
                                      checked={checkedItems[index] || false}
                                      onChange={() =>
                                        handleCheckboxChange(index)
                                      }
                                      className="w-5 h-5 mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                                      disabled={
                                        selectedTask.status === "Completed"
                                      }
                                    />
                                    <label
                                      htmlFor={`checklist-item-${index}`}
                                      className={`text-sm ${
                                        selectedTask.status === "Completed"
                                          ? "text-gray-500"
                                          : "text-gray-700"
                                      } cursor-pointer`}
                                    >
                                      {item}
                                    </label>
                                  </div>
                                )
                              )}
                          </div>
                        </div>

                        <div className="flex justify-end mt-6">
                          <button
                            onClick={() => setOpenUploadModalTaskId(null)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-3"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-sm font-medium text-white rounded-md bg-purple-600 hover:bg-purple-700 transition-colors"
                          >
                            Mark Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!selectedTask && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold tracking-wide text-gray-700 mb-4 flex items-center">
                  <FaClock className="text-purple-500 mr-2" />
                  Upcoming Deliverables
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingDeliverables &&
                  upcomingDeliverables.drawingList &&
                  upcomingDeliverables.drawingList.length > 0 ? (
                    upcomingDeliverables.drawingList.map((deliverable) => {
                      const daysRemaining = calculateDaysRemaining(
                        deliverable.end_date
                      );

                      return (
                        <div
                          key={deliverable.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-800">
                              {deliverable.drawing_name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                                deliverable.priority || "Medium"
                              )}`}
                            >
                              {deliverable.priority || "Medium"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            Drawing #{deliverable.drawing_number}
                          </p>

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-xs text-gray-500">Due Date</p>
                              <p className="text-sm font-medium">
                                {formatDate(deliverable.end_date)}
                              </p>
                            </div>

                            <div
                              className={`text-sm font-medium ${
                                daysRemaining <= 1
                                  ? "text-red-600"
                                  : daysRemaining <= 3
                                  ? "text-orange-600"
                                  : "text-green-600"
                              }`}
                            >
                              {daysRemaining === 0
                                ? "Due today"
                                : daysRemaining === 1
                                ? "Due tomorrow"
                                : `${daysRemaining} days left`}
                            </div>
                          </div>

                          {/* <button
                            onClick={() => {
                              const task = tasks.find(
                                (t) => t.id === deliverable.id
                              );
                              if (task) setSelectedTask(task);
                            }}
                            className="w-full mt-3 px-3 py-2 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600 transition-colors"
                          >
                            View Details
                          </button> */}
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-3 text-center p-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">
                        No upcoming deliverables in the next 7 days.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

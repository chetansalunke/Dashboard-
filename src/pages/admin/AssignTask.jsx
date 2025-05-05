import React, { useState, useRef, useEffect } from "react";
import BASE_URL from "../../config";
import axios from "axios";
import RoleDropdown from "./RoleDropdown";
import DesignCheckList from "../../components/Checklist/DesignCheckList";
import {
  Paperclip,
  Check,
  X,
  CheckSquare,
  FileText,
  Calendar,
  AlertCircle,
  List,
} from "lucide-react";

export default function AssignTask({ selectedProject, users }) {
  const [activeTab, setActiveTab] = useState("Pending");
  const [dropdownKey, setDropdownKey] = useState(0);
  const [tasks, setTasks] = useState([]);
  const fileInputRef = useRef(null);
  const [openChecklist, setOpenChecklist] = useState(null);
  const [openChecklistInput, setOpenChecklistInput] = useState(false);
  const [viewingAttachment, setViewingAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("accessToken");
  console.log("Task List ");
  console.log(tasks);

  const [newTask, setNewTask] = useState({
    taskName: "",
    priority: "Medium",
    startDate: "",
    dueDate: "",
    assignedTo: null,
    checklist: [],
    attachments: 0,
    file: null,
  });

  // Parse checklist data properly handling different formats
  const parseChecklist = (checklistData) => {
    if (!checklistData) return [];

    try {
      // Handle the case where checklist is already a stringified array
      if (typeof checklistData === "string") {
        // Handle double-stringified JSON (the weird case from your API)
        if (checklistData.startsWith('"[') && checklistData.endsWith(']"')) {
          // Remove the outer quotes and parse
          const innerJson = checklistData.substring(
            1,
            checklistData.length - 1
          );
          return JSON.parse(innerJson);
        }
        // Handle normal stringified JSON
        return JSON.parse(checklistData);
      }
      // If it's already an array, return it
      if (Array.isArray(checklistData)) {
        return checklistData;
      }
      // If it's an object, return empty array
      return [];
    } catch (err) {
      console.error("Error parsing checklist:", err, checklistData);
      return [];
    }
  };

  const fetchTasks = async () => {
    if (!selectedProject?.id) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/projects/${selectedProject.id}/assignTask`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const taskArray = response.data.tasks;
      console.log("Raw tasks from API:", taskArray);

      const formattedTasks = await Promise.all(
        taskArray.map(async (item) => {
          const assignedUser = users.find((user) => user.id === item.assign_to);

          // Parse checklist properly
          const parsedChecklist = parseChecklist(item.checklist);
          console.log(`Task ${item.id} checklist:`, parsedChecklist);

          // If there's a document attached, get its information
          let attachmentInfo = null;
          if (item.assign_task_document) {
            try {
              const docResponse = await axios.get(
                `${BASE_URL}/api/projects/task/${item.id}/document`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              attachmentInfo = docResponse.data;
              console.log(`Task ${item.id} attachment:`, attachmentInfo);
            } catch (err) {
              console.error(
                `Error fetching document info for task ${item.id}:`,
                err
              );
              // Set basic attachment info if API fails
              attachmentInfo = {
                fileName: item.assign_task_document.split("/").pop(),
                fileSize: null,
              };
            }
          }

          return {
            taskName: item.task_name,
            priority: item.priority,
            startDate: item.start_date?.split("T")[0] || "",
            dueDate: item.due_date?.split("T")[0] || "",
            assignedTo: assignedUser?.username || "—",
            assignedUserId: item.assign_to,
            checklist: parsedChecklist,
            attachments: item.assign_task_document ? 1 : 0,
            attachmentInfo: attachmentInfo,
            attachmentPath: item.assign_task_document,
            id: item.id,
            status: item.status || "Pending",
            rawData: item, // Keep raw data for debugging
          };
        })
      );

      const filteredTasks = formattedTasks.filter((task) => {
        if (activeTab === "All") return true;
        if (activeTab === "Completed") return task.status === "Completed";
        if (activeTab === "Pending") return task.status === "Pending";
        return true;
      });

      console.log("Formatted tasks:", filteredTasks);
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedProject, token, activeTab]);

  const handleAddTask = async () => {
    if (
      !newTask.taskName ||
      !newTask.startDate ||
      !newTask.dueDate ||
      !newTask.assignedTo
    ) {
      alert("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("taskName", newTask.taskName);
      formData.append("priority", newTask.priority);
      formData.append("startDate", newTask.startDate);
      formData.append("dueDate", newTask.dueDate);
      formData.append("assignTo", newTask.assignedTo.id);
      formData.append("projectId", selectedProject.id);

      // ✅ Expecting checklist to be a single array like: ["Item 1", "Item 2"]
      const checklistArray = Array.isArray(newTask.checklist)
        ? newTask.checklist
        : [];

      formData.append("checklist", JSON.stringify(checklistArray)); // Must be JSON string

      // Optional file upload
      if (newTask.file) {
        formData.append("documents", newTask.file);
      }

      const response = await axios.post(
        `${BASE_URL}/api/projects/assignTask`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Task added successfully:", response.data);

      // Refresh task list
      await fetchTasks();

      // Reset
      setNewTask({
        taskName: "",
        priority: "Medium",
        startDate: "",
        dueDate: "",
        assignedTo: null,
        checklist: [],
        attachments: 0,
        file: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setDropdownKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error assigning task:", error);
      alert(
        `Failed to add task: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChecklistClick = (task) => {
    console.log("Opening checklist for task:", task);
    setOpenChecklist(openChecklist?.id === task.id ? null : task);
  };

  const handleAttachmentClick = (task) => {
    if (task.attachments > 0) {
      console.log("Opening attachment for task:", task);
      setViewingAttachment(task);
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <main className="h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex">
            <h2 className="text-2xl font-bold text-gray-800 mr-4">
              Task Management
            </h2>
            <div className="flex border border-purple-300 rounded-lg overflow-hidden shadow-md">
              {["All", "Completed", "Pending"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 font-medium transition-colors duration-150 ${
                    activeTab === tab
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <button className="px-4 py-2 text-sm font-medium leading-5 text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow flex items-center">
            <AlertCircle size={16} className="mr-2" />
            Task Tracker
          </button>
        </div>

        <div className="w-full overflow-hidden rounded-lg shadow-xs mt-6">
          <div className="w-full">
            <table className="w-full table-fixed">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                  <th className="px-4 py-3">Task Name</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Assigned To</th>
                  <th className="px-4 py-3">Checklist</th>
                  <th className="px-4 py-3">Attachments</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {isLoading ? (
                  <tr className="text-gray-700">
                    <td colSpan="7" className="px-4 py-3 text-sm">
                      Loading tasks...
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr className="text-gray-700">
                    <td colSpan="7" className="px-4 py-3 text-sm">
                      No tasks found. Add a new task below.
                    </td>
                  </tr>
                ) : (
                  tasks.map((task, idx) => (
                    <tr key={task.id || idx} className="text-gray-700">
                      <td className="px-4 py-3 text-sm">{task.taskName}</td>
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
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1 text-gray-500" />
                          {formatDate(task.startDate)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1 text-gray-500" />
                          {formatDate(task.dueDate)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-2 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                            {task.assignedTo
                              ? task.assignedTo.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                          {/* <span className="text-sm"> */}
                          {task.assignedTo || "—"}
                          {/* </span> */}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {Array.isArray(task.checklist) &&
                        task.checklist.length > 0 ? (
                          <button
                            onClick={() => handleChecklistClick(task)}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <List size={16} className="mr-1" />
                            {/* <span className="underline"> */}
                            View ({task.checklist.length}){/* </span> */}
                          </button>
                        ) : (
                          <span className="text-gray-500 flex items-center">
                            <List size={16} className="mr-1 text-gray-400" />
                            None
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {task.attachments > 0 ? (
                          <button
                            onClick={() => handleAttachmentClick(task)}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <Paperclip size={16} className="mr-1" />
                            {/* <span className="underline"> */}
                            View ({task.attachments}){/* </span> */}
                          </button>
                        ) : (
                          <span className="text-gray-500 flex items-center">
                            <Paperclip
                              size={16}
                              className="mr-1 text-gray-400"
                            />
                            None
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">{task.status}</td>
                    </tr>
                  ))
                )}

                {/* New Task Input Row */}
                <tr className="bg-gray-50 text-sm border-t-2 border-gray-200">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="Task name"
                      value={newTask.taskName}
                      onChange={(e) =>
                        setNewTask({ ...newTask, taskName: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      value={newTask.startDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, startDate: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <RoleDropdown
                      key={dropdownKey}
                      role={["designer", "expert"]}
                      label=""
                      width=""
                      onSelect={(user) =>
                        setNewTask({ ...newTask, assignedTo: user })
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setOpenChecklistInput(true)}
                      className="px-3 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <CheckSquare size={14} className="mr-1" />
                      <span>Checklist</span>
                    </button>
                    {newTask.checklist && newTask.checklist.length > 0 && (
                      <div className="mt-1 text-xs text-gray-600">
                        {newTask.checklist.length} items selected
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <label className="cursor-pointer px-3 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center">
                        <Paperclip size={14} className="mr-1" />
                        <span>Upload</span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          multiple
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              file: e.target.files[0],
                              attachments: e.target.files.length,
                            })
                          }
                          className="hidden"
                        />
                      </label>
                      {newTask.file && (
                        <span className="ml-2 text-xs text-gray-600 truncate max-w-xs">
                          {newTask.file.name}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleAddTask}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium leading-5 text-white ${
                isLoading
                  ? "bg-purple-400"
                  : "bg-purple-600 hover:bg-purple-700"
              } rounded-lg shadow-md transition-colors flex items-center`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Add Task
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Checklist Modal */}
      {openChecklist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 relative max-h-[90vh] overflow-auto">
            <button
              onClick={() => setOpenChecklist(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
            >
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <CheckSquare size={20} className="text-purple-600 mr-2" />
              Checklist: {openChecklist.taskName}
            </h2>
            <div className="space-y-2">
              {Array.isArray(openChecklist.checklist) &&
              openChecklist.checklist.length > 0 ? (
                openChecklist.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <CheckSquare
                      size={18}
                      className="text-green-600 mr-2 flex-shrink-0"
                    />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  No checklist items available.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checklist Input Modal */}
      {openChecklistInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-4xl h-[90vh] overflow-auto rounded-lg p-6 relative">
            <button
              onClick={() => setOpenChecklistInput(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
            >
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <List size={20} className="text-purple-600 mr-2" />
              Add Checklist Items
            </h2>
            <DesignCheckList
              onSave={(selectedItems) => {
                console.log("Selected checklist items:", selectedItems);
                setNewTask((prev) => ({ ...prev, checklist: selectedItems }));
                setOpenChecklistInput(false);
              }}
              preselectedItems={newTask.checklist}
            />
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingAttachment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-2xl rounded-lg p-6 relative max-h-[90vh] overflow-auto">
            <button
              onClick={() => setViewingAttachment(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
            >
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <Paperclip size={20} className="text-purple-600 mr-2" />
              Attachments: {viewingAttachment.taskName}
            </h2>

            {viewingAttachment.attachmentPath ? (
              <div className="p-6 border rounded-lg bg-gray-50 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {viewingAttachment.attachmentPath.split("/").pop() ||
                        "Document"}
                    </h3>
                    {viewingAttachment.attachmentInfo?.fileSize && (
                      <p className="text-gray-500 text-sm">
                        Size:{" "}
                        {Math.round(
                          viewingAttachment.attachmentInfo.fileSize / 1024
                        )}{" "}
                        KB
                      </p>
                    )}
                  </div>
                </div>
                <a
                  href={`${BASE_URL}/api/projects/task/${viewingAttachment.id}/document/download`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center mt-2 shadow-sm transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Paperclip size={16} className="mr-2" />
                  Download Document
                </a>
              </div>
            ) : (
              <div className="p-8 border rounded-lg bg-gray-50 text-center">
                <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  This task has an attachment, but the document information
                  couldn't be retrieved.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  You can still try to download it using the task ID.
                </p>
                <a
                  href={`${BASE_URL}/api/projects/task/${viewingAttachment.id}/document/download`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center mt-4 shadow-sm transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Paperclip size={16} className="mr-2" />
                  Download Document
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

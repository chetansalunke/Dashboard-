import React, { useState, useRef, useEffect } from "react";
import BASE_URL from "../../config";
import axios from "axios";
import RoleDropdown from "./RoleDropdown";

export default function AssignTask({ selectedProject,users }) {
  const [activeTab, setActiveTab] = useState("Pending");
  const [dropdownKey, setDropdownKey] = useState(0);
  const [tasks, setTasks] = useState([]);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("accessToken");

  const [newTask, setNewTask] = useState({
    taskName: "",
    priority: "Medium",
    startDate: "",
    dueDate: "",
    assignedTo: null,
    checklist: "",
    attachments: 0,
    file: null,
  });

  // 🔄 Fetch assign task when selectedProject changes
  const fetchTasks = async () => {
    if (!selectedProject?.id) return;
  
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
  
      // Format the task(s) to fit the table
      const formattedTasks = taskArray.map((item) => {
        const assignedUser = users.find((user) => user.id === item.assign_to);
        return {
          taskName: item.task_name,
          priority: item.priority,
          startDate: item.start_date?.split("T")[0] || "",
          dueDate: item.due_date?.split("T")[0] || "",
          assignedTo: assignedUser?.username || "—",
          checklist: item.checklist ? "Checklist" : "—",
          attachments: item.assign_task_document ? 1 : 0,
        };
      });
  
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  
  

  useEffect(() => {
    fetchTasks();
  }, [selectedProject, token]); // Only trigger when selectedProject or token changes

  const handleAddTask = async () => {
    try {
      const formData = new FormData();
      formData.append("taskName", newTask.taskName);
      formData.append("priority", newTask.priority);
      formData.append("startDate", newTask.startDate);
      formData.append("dueDate", newTask.dueDate);
      formData.append("assignTo", newTask.assignedTo?.id);
      formData.append("projectId", selectedProject.id);
      formData.append("checklist", JSON.stringify(["Checklist"]));
      if (newTask.file) {
        formData.append("documents", newTask.file);
      }

      const response = await fetch(`${BASE_URL}/api/projects/assignTask`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to assign task");
      }

      // const result = await response.json();
      // console.log("Task Assigned Successfully:", result);

      setTasks((prev) => [
        ...prev,
        { ...newTask, assignedTo: newTask.assignedTo?.username },
      ]);

      setNewTask({
        taskName: "",
        priority: "Medium",
        startDate: "",
        dueDate: "",
        assignedTo: null,
        checklist: "",
        attachments: 0,
        file: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setDropdownKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4 mt-4">
          <div className="flex border border-purple-300 rounded-lg overflow-hidden shadow-md">
            {["All", "Completed", "Pending"].map((tab) => (
              <button
                key={tab}
                className={`px-2 py-1 font-medium transition-colors duration-150 ${
                  activeTab === tab
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="px-2 py-1 text-sm font-medium leading-5 text-white bg-orange-600 hover:bg-orange-700">
            Task Tracker
          </button>
        </div>

        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold text-left text-gray-500 uppercase border-b bg-gray-50">
                  <th className="px-4 py-3">Task Name</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Assigned To</th>
                  <th className="px-4 py-3">Checklist</th>
                  <th className="px-4 py-3">Attachments</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {tasks.map((task, idx) => (
                  <tr key={idx} className="text-gray-700">
                    <td className="px-4 py-3 text-sm">{task.taskName}</td>
                    <td className="px-4 py-3 text-sm">{task.priority}</td>
                    <td className="px-4 py-3 text-sm">{task.startDate}</td>
                    <td className="px-4 py-3 text-sm">{task.dueDate}</td>
                    <td className="px-4 py-3 text-sm">
                      {task.assignedTo || "—"}
                    </td>
                    <td className="px-4 py-3 text-blue-500 underline cursor-pointer">
                      {task.checklist}
                    </td>
                    <td className="px-4 py-3 text-blue-500 cursor-pointer">
                      📎 ({task.attachments})
                    </td>
                  </tr>
                ))}

                {/* New Task Input Row */}
                <tr className="bg-gray-50 text-sm">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="Type"
                      value={newTask.taskName}
                      onChange={(e) =>
                        setNewTask({ ...newTask, taskName: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
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
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
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
                      onClick={() =>
                        setNewTask({ ...newTask, checklist: "Checklist" })
                      }
                      className="text-blue-600 underline"
                    >
                      Attach
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          file: e.target.files[0],
                          attachments: 1,
                        })
                      }
                      className="w-full"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-100">
            <button
              onClick={handleAddTask}
              className="px-3 py-1 text-sm font-medium leading-5 text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              Add
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

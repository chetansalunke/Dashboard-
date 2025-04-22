import React, { useState } from "react";

const dummyUsers = ["Priya M.", "Rahul S.", "Ananya K."];

export default function AssignTask() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [tasks, setTasks] = useState([
    {
      taskName: "5th floor certificate to be issued",
      priority: "High",
      startDate: "2024-12-18",
      dueDate: "2024-12-20",
      assignedTo: "Priya M.",
      checklist: "Certificate",
      attachments: 1,
    },
    {
      taskName: "Conduct site visits",
      priority: "Low",
      startDate: "2024-12-22",
      dueDate: "2024-12-22",
      assignedTo: "Priya M.",
      checklist: "Site visit",
      attachments: 0,
    },
    {
      taskName: "Typical floor plan layout",
      priority: "Medium",
      startDate: "2024-12-20",
      dueDate: "2024-12-22",
      assignedTo: "Priya M.",
      checklist: "Floor plans",
      attachments: 3,
    },
  ]);

  const [newTask, setNewTask] = useState({
    taskName: "",
    priority: "Medium",
    startDate: "",
    dueDate: "",
    assignedTo: "",
    checklist: "",
    attachments: 0,
  });

  const handleAddTask = () => {
    setTasks((prev) => [...prev, newTask]);
    setNewTask({
      taskName: "",
      priority: "Medium",
      startDate: "",
      dueDate: "",
      assignedTo: "",
      checklist: "",
      attachments: 0,
    });
  };

  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4 mt-4">
          {/* Tabs */}
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

          {/* Task Tracker */}
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
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${
                          task.priority === "High"
                            ? "bg-red-500"
                            : task.priority === "Medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{task.startDate}</td>
                    <td className="px-4 py-3 text-sm">{task.dueDate}</td>
                    <td className="px-4 py-3 text-sm">{task.assignedTo}</td>
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
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) =>
                        setNewTask({ ...newTask, assignedTo: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    >
                      <option value="">-- Select --</option>
                      {dummyUsers.map((u) => (
                        <option key={u}>{u}</option>
                      ))}
                    </select>
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
                    <button
                      onClick={() =>
                        setNewTask({
                          ...newTask,
                          attachments: newTask.attachments + 1,
                        })
                      }
                      className="text-blue-600 underline"
                    >
                      Attach
                    </button>
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

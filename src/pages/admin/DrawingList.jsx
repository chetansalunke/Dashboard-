import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa"; // Font Awesome Trash icon
import axios from "axios";
import BASE_URL from "../../config";
import RoleDropdown from "./RoleDropdown";

export default function DrawingList({ selectedProject }) {
  const [tasks, setTasks] = useState([]);
  const [dropdownKey, setDropdownKey] = useState(0); // 🔑 key for forcing RoleDropdown re-render

  const token = localStorage.getItem("accessToken");

  const [newTask, setNewTask] = useState({
    projectId: "",
    drawingNo: "",
    drawingName: "",
    startDate: "",
    endDate: "",
    assignedTo: null, // Will store full user object
    documents: [],
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "documents") {
      const fileArray = Array.from(files);
      setNewTask((prev) => ({
        ...prev,
        documents: [...prev.documents, ...fileArray],
      }));
    } else {
      setNewTask((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...newTask.documents];
    updatedFiles.splice(index, 1);
    setNewTask((prev) => ({ ...prev, documents: updatedFiles }));
  };

  const handleAddTask = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/projects/drawingList/add`,
        {
          drawingNumber: newTask.drawingNo,
          drawingName: newTask.drawingName,
          startDate: newTask.startDate,
          endDate: newTask.endDate,
          assignTo: newTask.assignedTo?.id, // or whatever key your backend expects
          projectId: selectedProject.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Adding drawing with data:", {
        drawingNumber: newTask.drawingNo,
        drawingName: newTask.drawingName,
        startDate: newTask.startDate,
        endDate: newTask.endDate,
        assignTo: newTask.assignedTo?.id,
        projectId: selectedProject.id,
      });

      // Append to tasks
      setTasks((prev) => [...prev, response.data]);

      console.log();
      // Reset form
      setNewTask({
        projectId: "",
        drawingNo: "",
        drawingName: "",
        startDate: "",
        endDate: "",
        assignedTo: null,
      });

      // 🔄 Reset the dropdown by updating its key
      setDropdownKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding drawing:", error);
      alert("Failed to add drawing. Check console.");
    }
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold text-left text-gray-500 uppercase border-b bg-gray-50">
                  <th className="px-4 py-3">Project ID</th>
                  <th className="px-4 py-3">Drawing No.</th>
                  <th className="px-4 py-3">Drawing Name</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3">Assigned To</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {tasks.map((task, idx) => (
                  <tr key={idx} className="text-gray-700">
                    <td className="px-4 py-3 text-sm">
                      {selectedProject.project_id}
                    </td>
                    <td className="px-4 py-3 text-sm">{task.drawingNo}</td>
                    <td className="px-4 py-3 text-sm">{task.drawingName}</td>
                    <td className="px-4 py-3 text-sm">{task.startDate}</td>
                    <td className="px-4 py-3 text-sm">{task.endDate}</td>
                    <td className="px-4 py-3 text-sm">
                      {task.assignedTo?.username || "—"}
                    </td>

                    <td className="px-4 py-3 text-red-600 cursor-pointer">
                      <FaTrash onClick={() => handleDelete(idx)} />
                    </td>
                  </tr>
                ))}

                {/* New Task Input Row */}
                <tr className="bg-gray-50 text-sm">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="ID"
                      value={selectedProject.project_id}
                      className="w-full border px-2 py-1 rounded"
                      readOnly
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="No."
                      value={newTask.drawingNo}
                      onChange={(e) =>
                        setNewTask({ ...newTask, drawingNo: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newTask.drawingName}
                      onChange={(e) =>
                        setNewTask({ ...newTask, drawingName: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
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
                      value={newTask.endDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, endDate: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>

                  <td className="px-4 py-2">
                    <RoleDropdown
                      key={dropdownKey} // 👈 Force re-render to clear previous selection
                      role={["designer", "expert"]}
                      label=""
                      width=""
                      onSelect={(user) =>
                        setNewTask({ ...newTask, assignedTo: user })
                      }
                    />
                  </td>

                  <td className="px-4 py-2 text-center text-gray-400">—</td>
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

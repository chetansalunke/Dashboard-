import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../../config";
import RoleDropdown from "./RoleDropdown";

export default function DrawingList({ selectedProject, users }) {
  const [tasks, setTasks] = useState([]);
  const [dropdownKey, setDropdownKey] = useState(0);

  const token = localStorage.getItem("accessToken");

  const [newTask, setNewTask] = useState({
    projectId: "",
    drawingNo: "",
    drawingName: "",
    startDate: "",
    endDate: "",
    assignedTo: null,
    documents: [],
  });

  // Fetch drawing list when selectedProject changes
  const fetchDrawingList = async () => {
    if (!selectedProject?.id) return;

    try {
      const response = await axios.get(
        `${BASE_URL}/api/projects/drawingList/${selectedProject.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const taskArray = response.data.drawings || [];

      const formattedTasks = taskArray.map((item) => {
        const assignedUser = users.find((user) => user.id === item.assign_to);
        return {
          projectId: selectedProject.id,
          drawingNo: item.drawing_number,
          drawingName: item.drawing_name,
          startDate: item.start_date.split("T")[0],
          endDate: item.end_date.split("T")[0],
          assignedTo: assignedUser || null,
        };
      });

      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchDrawingList();
  }, [selectedProject, token]);

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
          assignTo: newTask.assignedTo?.id,
          projectId: selectedProject.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) => [...prev, { ...newTask }]);

      // Reset form
      setNewTask({
        projectId: "",
        drawingNo: "",
        drawingName: "",
        startDate: "",
        endDate: "",
        assignedTo: null,
      });

      // Reset the dropdown by updating its key
      setDropdownKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding drawing:", error);
      alert("Add all drawing details first");
    }
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <>
      {" "}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Create Milestone
      </h2>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full whitespace-nowrap">
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
              <tr key={idx} className="text-gray-700 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  {selectedProject.project_id}
                </td>
                <td className="px-4 py-3 text-sm">{task.drawingNo}</td>
                <td className="px-4 py-3 text-sm">{task.drawingName}</td>
                <td className="px-4 py-3 text-sm">{task.startDate}</td>
                <td className="px-4 py-3 text-sm">{task.endDate}</td>
                <td className="px-4 py-3 text-sm">
                  {task.assignedTo ? (
                    <div className="flex items-center">
                      <div className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-purple-800 font-medium">
                          {task.assignedTo.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span>{task.assignedTo.username}</span>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <FaTrash
                    onClick={() => handleDelete(idx)}
                    className="text-red-600 cursor-pointer hover:text-red-800"
                  />
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
                  className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                  className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                  className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="date"
                  value={newTask.startDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, startDate: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="date"
                  value={newTask.endDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, endDate: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </td>

              <td className="px-4 py-2">
                <RoleDropdown
                  key={dropdownKey}
                  role={["designer"]}
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
      <div className="mt-4">
        <button
          onClick={handleAddTask}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <FaPlus className="mr-2" />
          Add Drawing
        </button>
      </div>
    </>
  );
}

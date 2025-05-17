import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../../config";
import { List } from "lucide-react";

export default function DrawingListView({ selectedProject, users }) {
  const [tasks, setTasks] = useState([]);
  const [dropdownKey, setDropdownKey] = useState(0);

  const token = localStorage.getItem("accessToken");

  // Fetch drawing list when selectedProject changes
  const fetchDrawingList = async () => {
    if (!selectedProject?.id) return;
    console.log("Draeing list token");
    console.log(token);
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
            {tasks.length > 0 ? (
              tasks.map((task, idx) => (
                <tr key={idx} className="text-gray-700 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{selectedProject.id}</td>
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
                      "_"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <FaTrash
                      onClick={() => handleDelete(idx)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-gray-700">
                <td colSpan="8" className="px-4 py-3 text-sm">
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                      <List size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">No Drawing found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

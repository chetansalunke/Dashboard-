import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";

const TaskAssignTable = ({ userId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/projects/assigned-tasks/${userId}`
        );
        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [userId]);

  return (
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
            tasks.map((task, index) => (
              <tr key={task.id} className="hover:bg-gray-50 text-gray-700">
                <td className="px-4 py-3 text-sm">{task.task_name}</td>
                <td className="px-4 py-3 text-sm">
                  {task.project_id}
                </td>
                <td className="px-4 py-3 text-sm">{task.priority}</td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => setSelectedProject(project)}
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
                colSpan="8"
                className="text-center border border-gray-300 p-4"
              >
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
  );
};

export default TaskAssignTable;







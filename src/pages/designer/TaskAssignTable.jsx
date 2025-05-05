
import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";

const TaskAssignTable = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

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

  const closeModal = () => {
    setSelectedTask(null);
  };

  return (
    <div>
      {!selectedTask ? (
        <table className="w-full table-auto">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b">
              <th className="px-4 py-3">Task Name</th>
              <th className="px-4 py-3">Project Name</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 text-gray-700">
                  <td className="px-4 py-3 text-sm">{task.task_name}</td>
                  <td className="px-4 py-3 text-sm">{task.project_id}</td>
                  <td className="px-4 py-3 text-sm">{task.priority}</td>
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
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Task Details</h3>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>

          <div className="space-y-3 text-gray-700">
            <p><strong>Task Name:</strong> {selectedTask.task_name}</p>
            <p><strong>Project Name:</strong> {selectedTask.project_id}</p>
            <p><strong>Start Date:</strong> {selectedTask.start_date}</p>
            <p><strong>End Date:</strong> {selectedTask.due_date}</p>
            <p><strong>Priority:</strong> {selectedTask.priority}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAssignTable;

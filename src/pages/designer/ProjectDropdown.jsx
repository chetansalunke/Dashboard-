import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";

const ProjectDropdown = ({ userId, onSelectProject }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const isProjectSelected = selectedProjectId !== "";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/projects/assigned-projects/${userId}`
        );
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Error fetching assigned projects:", error);
      }
    };

    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    setSelectedProjectId(selectedId);
    onSelectProject && onSelectProject(selectedId);
  };

  return (
    <div className="flex items-center gap-4">
      <select
        value={selectedProjectId}
        onChange={handleChange}
        className={`w-full border border-gray-300 rounded-lg px-2 py-2 shadow-sm text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:shadow-outline-gray 
            `}
      >
        <option value=""className="text-sm font-semibold text-gray-700">-- Select Project --</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id} className="text-sm font-semibold text-gray-700">
            {project.projectName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectDropdown;

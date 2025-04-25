import React from "react";

export default function ProjectDropdown({ projectList, selectedProjectId, onChange }) {
  const isProjectSelected = selectedProjectId !== "";

  return (
    <div className="flex items-center gap-4">
      <select
        id="projectDropdown"
        value={selectedProjectId}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border border-gray-300 rounded-lg px-2 py-2 shadow-sm text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:shadow-outline-gray ${isProjectSelected ? "text-gray-400" : "text-gray-800"}
`}
      >
        <option value=""className="text-sm font-semibold text-gray-700" >-- Select Project --</option>
        {projectList.map((project) => (
          <option key={project.id} value={project.id} className="text-sm font-semibold text-gray-700">
            {project.projectName}
          </option>
        ))}
      </select>
    </div>
  );
}


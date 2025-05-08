import React from "react";

export default function ProjectDropdown({ projectList, selectedProjectId, onChange }) {
  return (
    <div className="flex items-center gap-4">
      <select
        id="projectDropdown"
        value={selectedProjectId}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-gray-300 rounded-lg px-8 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
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



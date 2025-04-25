import React, { useState } from "react";
import ProjectForm from "./ProjectForm";
import AssignTask from "./AssignTask";
import DrawingList from "./DrawingList";
import ProjectTeam from "./ProjectTeam";

export default function ProjectTabs({
  users,
  setIsFormOpen,
  fetchProjects,
  selectedProject,
}) {
  const [activeTab, setActiveTab] = useState("Project Information");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Project Information":
        return <ProjectForm setIsFormOpen={setIsFormOpen} selectedProject={selectedProject} users={users}/>;
      case "Drawing List":
        return <DrawingList selectedProject={selectedProject} users={users}/>;
      case "Assign Task":
        return <AssignTask selectedProject={selectedProject} users={users}/>;
      case "Team":
        return <ProjectTeam selectedProject={selectedProject}/>;
      default:
        return null;
    }
  };

  // Conditionally show extra tabs if a project is selected
  const tabs = [
    "Project Information",
    ...(selectedProject?.id ? ["Drawing List", "Assign Task", "Team"] : []),
  ];

  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        <hr className="mt-2 mb-2 border-gray-400" />

        {/* Tab Buttons */}
        <div className="flex  items-center gap-10 mb-4 bg-white w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1 bg-white rounded hover:bg-gray-300 text-sm font-medium"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="">{renderTabContent()}</div>
      </main>
    </div>
  );
}

import React, { useState } from "react";
import ProjectForm from "./ProjectForm";
import DrawingList from "./DrawingList";
import AssignTask from "./AssignTask";
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
        return (
          <ProjectForm
            setIsFormOpen={setIsFormOpen}
            selectedProject={selectedProject}
            users={users}
          />
        );
      case "Drawing List":
        return <DrawingList selectedProject={selectedProject} users={users} />;
      case "Assign Task":
        return <AssignTask selectedProject={selectedProject} users={users} />;
      case "Team":
        return <ProjectTeam selectedProject={selectedProject} />;
      default:
        return null;
    }
  };

  // Show additional tabs when a project is selected
  const tabs = [
    "Project Information",
    ...(selectedProject?.id ? ["Drawing List", "Assign Task", "Team"] : []),
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg mt-6 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-4 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
}

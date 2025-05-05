import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BASE_URL from "../../config";
import ProjectForm from "./ProjectForm";
import AssignTask from "./AssignTask";
import DrawingList from "./DrawingList";
import ProjectTeam from "./ProjectTeam";

export default function Management() {
  const [users, setUsers] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Project Information");

  const location = useLocation();
  const { projectName } = location.state || {};

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/all`);
      if (!response.ok) throw new Error("HTTP error!");
      const data = await response.json();
      const projects = Array.isArray(data.projects) ? data.projects : [];
      setProjectList(projects);

      // Auto-select project by name if passed from location.state
      if (projectName) {
        const found = projects.find(
          (proj) => proj.name?.toLowerCase() === projectName.toLowerCase()
        );
        if (found) {
          setSelectedProject(found);
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/all`);
      const data = await res.json();
      const filteredUsers = data.users?.filter((u) => u.role !== "admin") || [];
      setUsers(filteredUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  // Tabs to show
  const tabs = [
    "Project Information",
    ...(selectedProject ? ["Drawing List", "Assign Task", "Team"] : []),
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "Project Information":
        return <ProjectForm selectedProject={selectedProject} users={users} />;
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

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="h-full overflow-y-auto">
        <div className="container px-6 py-6">
          {selectedProject ? (
            <>
              <div className="flex items-center gap-4 mb-4 bg-white p-2 rounded">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      activeTab === tab
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div>{renderTabContent()}</div>
            </>
          ) : (
            <div className="text-gray-600">Loading project...</div>
          )}
        </div>
      </main>
    </div>
  );
}

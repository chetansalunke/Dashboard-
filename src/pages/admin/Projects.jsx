import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaPlus, FaSync } from "react-icons/fa";
import BASE_URL from "../../config";
import ProjectList from "./ProjectList";
import ProjectTabs from "./ProjectTabs";
import ProjectForm from "./ProjectForm";

export default function Projects() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isNewProject, setIsNewProject] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null); // Reset error before trying again
    try {
      const response = await fetch(`${BASE_URL}/api/projects/all`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Projects not found (404)");
        } else {
          throw new Error(`Server Error (${response.status})`);
        }
      }

      const data = await response.json();
      setProjectList(Array.isArray(data.projects) ? data.projects : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(error.message || "Unknown error");
      setProjectList([]); // Clear existing list on error
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProjects();
  };

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

  const handleCreateClick = () => {
    setIsFormOpen(true);
    setIsNewProject(true);
    setSelectedProject(null);
  };

  const handleManageClick = (project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
    setIsNewProject(false);
  };

  const handleBack = () => {
    setIsFormOpen(false);
    setIsNewProject(false);
    setSelectedProject(null);
    // Refresh the project list when returning to the list view
    fetchProjects();
  };

  const handleDelete = (index) => {
    setProjectList(projectList.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container px-6 py-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-700">
            {!isFormOpen
              ? "Manage Projects"
              : isNewProject
              ? "Create Project"
              : `Project: ${selectedProject?.projectName}`}
          </h1>
          <div className="flex gap-3">
            {!isFormOpen && (
              <button
                onClick={handleRefresh}
                className={`flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium ${
                  isRefreshing ? "text-purple-600" : "text-gray-700"
                } hover:bg-gray-50 transition-all duration-300`}
                disabled={isRefreshing}
              >
                <FaSync
                  className={`mr-2 ${
                    isRefreshing ? "animate-spin text-purple-600" : ""
                  }`}
                  size={12}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            )}

            {isFormOpen ? (
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FaArrowLeft className="mr-2" size={12} /> Back
              </button>
            ) : (
              <button
                onClick={handleCreateClick}
                className="flex items-center px-4 py-2 bg-purple-600 rounded-md text-sm font-medium text-white hover:bg-purple-700"
              >
                <FaPlus className="mr-2" size={12} /> Create Project
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : isFormOpen ? (
          isNewProject ? (
            <ProjectForm
              users={users}
              setIsFormOpen={setIsFormOpen}
              fetchProjects={fetchProjects}
            />
          ) : (
            <ProjectTabs
              users={users}
              setIsFormOpen={setIsFormOpen}
              fetchProjects={fetchProjects}
              selectedProject={selectedProject}
            />
          )
        ) : projectList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No projects found</div>
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 mx-auto bg-purple-100 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-200"
            >
              <FaSync className="mr-2" size={12} /> Refresh Projects
            </button>
          </div>
        ) : (
          <ProjectList
            projects={projectList}
            onDelete={handleDelete}
            onManage={handleManageClick}
          />
        )}
      </main>
    </div>
  );
}

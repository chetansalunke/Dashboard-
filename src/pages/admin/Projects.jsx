import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import BASE_URL from "../../config";
import ProjectList from "./ProjectList";
import ProjectTabs from "./ProjectTabs";

export default function Projects() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/projects/all`);
      if (!response.ok) throw new Error("HTTP error!");
      const data = await response.json();
      setProjectList(Array.isArray(data.projects) ? data.projects : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjectList([]);
    } finally {
      setIsLoading(false);
    }
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

  const handleManageClick = (project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleBack = () => {
    setIsFormOpen(false);
    setSelectedProject(null);
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
              : selectedProject
              ? `Project: ${selectedProject.projectName}`
              : "Create Project"}
          </h1>
          <div>
            {isFormOpen ? (
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FaArrowLeft className="mr-2" size={12} /> Back
              </button>
            ) : (
              <button
                onClick={() => setIsFormOpen(true)}
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
          <ProjectTabs
            users={users}
            setIsFormOpen={setIsFormOpen}
            fetchProjects={fetchProjects}
            selectedProject={selectedProject}
          />
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

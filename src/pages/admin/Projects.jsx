import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import BASE_URL from "../../config";
import ProjectList from "./ProjectList";
import ProjectTabs from "./ProjectTabs";

export default function Projects() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null); // NEW
  const hasFetchedProjects = useRef(false);
  const token = localStorage.getItem("accessToken");

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/all`);
      if (!response.ok) throw new Error("HTTP error!");
      const data = await response.json();
      setProjectList(Array.isArray(data.projects) ? data.projects : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjectList([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/all`); //http://localhost:3000/api/auth/all
      const data = await res.json();
      const filteredUsers = data.users?.filter((u) => u.role !== "admin") || [];
      setUsers(filteredUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  console.log(users);

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []); // ✅ Only run once on mount

  const handleManageClick = (project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleBack = () => {
    setIsFormOpen(false);
    setSelectedProject(null); // clear selected project when going back
  };

  const handleDelete = (index) => {
    setProjectList(projectList.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <div className="flex justify-between items-center">

            <h1 className="text-xl font-semibold tracking-wide text-gray-500 uppercase ">
              {!isFormOpen
                ? "Projects"
                : selectedProject
                ? selectedProject.projectName
                : "Create Project"}
            </h1>
            <div className="flex justify-end gap-2">
              {isFormOpen ? (
                <button
                  onClick={handleBack}
                  className="px-3 py-1 text-sm font-medium leading-5 text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-3 py-1 text-sm font-medium leading-5 text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  Create Project
                </button>
              )}
            </div>
          </div>

          {isFormOpen ? (
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
              fetchProjects={fetchProjects}
              onManage={handleManageClick}
            />
          )}
        </div>
      </main>
    </div>
  );
}

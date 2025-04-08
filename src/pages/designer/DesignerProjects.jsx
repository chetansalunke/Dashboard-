import React, { useState, useEffect } from "react";
import BASE_URL from "../../config";
import { useNavigate } from "react-router-dom";

export default function DesignerProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const username = user?.username || "";

      try {
        const response = await fetch(`${BASE_URL}/api/projects/all`);
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        if (data && Array.isArray(data.projects)) {
          const userProjects = data.projects.filter(
            (project) => project.assignTo === username
          );
          setProjects(userProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCardClick = (projectId,projectName) => {
    navigate(`/designer-dashboard/projects/communication/rfi`, {
      state: { projectId,projectName }, 
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="h-full overflow-y-auto">
        <div className="container px-6 py-6 grid gap-6">
          <h1 className="text-xl font-semibold tracking-wide text-gray-500 uppercase">Projects</h1>
          {loading ? (
            <p>Loading...</p>
          ) : projects.length === 0 ? (
            <p>No projects assigned.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white shadow-md p-4 cursor-pointer hover:shadow-lg transition relative border"
                  onClick={() => handleCardClick(project.id,project.projectName)} // Pass projectId and projectName here
                >
                  <h4 className="text-xl mb-2">
                    {project.projectName} {project.id}
                  </h4>

                  <div className="mt-4 text-sm text-gray-500">
                    Status:{" "}
                    <span className="font-medium">{project.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

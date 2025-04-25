import React, { useState, useEffect } from "react";
import BASE_URL from "../../config";
import { useNavigate } from "react-router-dom";
import imageLogo from "./imageLogo.jpg";
import { FaUserCircle } from "react-icons/fa";

export default function DesignerProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortOption, setSortOption] = useState("");
  

  const navigate = useNavigate();

    const handleSortByLatest = () => {
      setSortOption("date-latest");
      setShowDropdown(false);
    };
  
    useEffect(() => {
      let sortedProjects = [...projects];
    
      if (sortOption === "date-latest") {
        sortedProjects.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
      } else if (sortOption === "date-oldest") {
        sortedProjects.sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate));
      } else if (sortOption === "a-z") {
        sortedProjects.sort((a, b) => a.projectName.localeCompare(b.projectName));
      }
    
      setProjects(sortedProjects);
    }, [sortOption]);

  useEffect(() => {
    const fetchProjects = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const userID = user?.id || "";

      try {
        const response = await fetch(`${BASE_URL}/api/projects/assigned-projects/${userID}`);
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        if (data && Array.isArray(data.projects)) {
          // Optional: add status if your API doesn't include it
          const enrichedProjects = data.projects.map((p) => ({
            ...p,
            status: "In Progress", // You can randomize or update based on actual API data
          }));
          setProjects(enrichedProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let sortedProjects = [...projects];

    if (sortOption === "date-latest") {
      sortedProjects.sort(
        (a, b) => new Date(b.submissionDate) - new Date(a.submissionDate)
      );
    } else if (sortOption === "date-oldest") {
      sortedProjects.sort(
        (a, b) => new Date(a.submissionDate) - new Date(b.submissionDate)
      );
    } else if (sortOption === "a-z") {
      sortedProjects.sort((a, b) => a.projectName.localeCompare(b.projectName));
    }

    setProjects(sortedProjects);
  }, [sortOption]);

  const handleCardClick = (projectId, projectName) => {
    localStorage.setItem("selectedProject", JSON.stringify({ projectId, projectName }));
    navigate("/designer-dashboard/projects/design");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaUserCircle className="text-3xl text-gray-500" />
        <h5 className="text-xl font-semibold text-gray-600">
          Welcome {JSON.parse(localStorage.getItem("user"))?.username || ""}
        </h5>
      </div>

      {/* Tabs and Sort Button */}
      <div className="flex justify-between items-center gap-3 mb-4 bg-white w-full">
        <div className="flex gap-3">
          {["Concept", "Design Development", "Tendering", "Execution", "Handover"].map(
            (phase, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-white rounded hover:bg-gray-300 text-sm font-medium"
              >
                {phase}
              </button>
            )
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-3 py-1 bg-white border text-sm font-medium"
          >
            Sort by ▼
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-44 bg-white border shadow-lg rounded text-sm z-20">
            <button
                onClick={handleSortByLatest}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Date
              </button>
              <button
                onClick={() => {
                  setSortOption("a-z");
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                A to Z
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Projects */}
      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects assigned.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleCardClick(project.id, project.projectName)}
              className="bg-white max-w-xs w-full mx-auto p-3 border hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center space-y-3"
            >
              <div className="bg-gray-100 w-full p-3 border rounded-2xl">
                <div className="flex justify-center items-center">
                  <img
                    src={imageLogo}
                    alt="Project Logo"
                    className="h-12 object-contain"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full bg-white ${
                      project.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : project.status === "On Hold"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
              <h3 className="text-base font-semibold text-center text-gray-700">
                {project.projectName}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

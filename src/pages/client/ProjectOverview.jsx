import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config"; 

const ProjectOverview = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const clientId = user?.id;
        if (!clientId) return;

        const response = await axios.get(`${BASE_URL}/api/projects/client/${clientId}`);
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold tracking-wide text-gray-700 mb-4 flex items-center">
        Total Projects : {projects.length.toString().padStart(2, "0")}
      </h2>
      <div className="max-h-[240px] overflow-y-auto rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-white sticky top-0 z-10 shadow-sm">
            <tr className="text-left font-semibold text-gray-600 border-b">
              <th className="px-4 py-3">Project Name</th>
              <th className="px-4 py-3">Timeline</th>
              <th className="px-4 py-3">Progress</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {projects.map((proj, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{proj.projectName}</td>
                <td className="px-4 py-3 text-sm">{proj.duration}</td>
                <td className="px-4 py-3 text-sm">
                  {proj.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectOverview;

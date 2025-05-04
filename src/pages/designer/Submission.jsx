import React, { useState, useEffect } from "react";
import BASE_URL from "../../config";
import ProjectDropdown from "./RFI/ProjectDropdown";

export default function Submission() {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [drawings, setDrawings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/all`);
      const data = await response.json();
      setProjectList(Array.isArray(data.projects) ? data.projects : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjectList([]);
    }
  };

  const fetchDrawings = async (projectId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/projects/design_drawing/${projectId}`
      );
      const data = await response.json();
      setDrawings(
        Array.isArray(data.designDrawings) ? data.designDrawings : []
      );
    } catch (error) {
      console.error("Error fetching design drawings:", error);
      setDrawings([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchDrawings(selectedProjectId);
    } else {
      setDrawings([]);
    }
  }, [selectedProjectId]);

  const onSearchChange = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredDrawings = drawings.filter((drawing) =>
    drawing.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <h1 className="text-xl font-semibold tracking-wide text-black uppercase mb-1">
            {selectedProjectName}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4 ">
            <ProjectDropdown
              projectList={projectList}
              selectedProjectId={selectedProjectId}
              onChange={(selectedId) => {
                setSelectedProjectId(selectedId);
                const selectedProject = projectList.find(
                  (p) => p.id === Number(selectedId)
                );
                setSelectedProjectName(selectedProject?.projectName || "");
              }}
            />
            <div className="flex justify-between gap-3">
              {/* Search */}
              <div className="relative w-[280px] mt-0">
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-2 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none"
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>

              {/* View & Filter dropdowns (optional behavior) */}
              <select className="h-9 text-sm border rounded-lg px-6 py-2">
                <option disabled selected>
                  View
                </option>
                <option value="list">List</option>
                <option value="content">Content</option>
              </select>

              <select className="h-9 text-sm border rounded-lg px-6 py-2">
                <option disabled selected>
                  Filter By
                </option>
                <option value="type">Type</option>
                <option value="discipline">Discipline</option>
                <option value="purpose">Purpose</option>
                <option value="sentBy">Sent By</option>
              </select>
            </div>
          </div>

          <hr className="border border-gray-400 m-2" />

          {/* Table */}
          {selectedProjectId ? (
            <div className="w-full overflow-hidden rounded-lg shadow mt-2">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                      <th className="px-4 py-3">Preview</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Discipline</th>
                      <th className="px-4 py-3">Purpose</th>
                      <th className="px-4 py-3">Sent By</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDrawings.length > 0 ? (
                      filteredDrawings.map((drawing) => (
                        <tr key={drawing.id} className="text-gray-700">
                          <td className="px-4 py-3">
                            <a
                              href={`${BASE_URL}/${
                                JSON.parse(drawing.document_path)[0]
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 underline text-sm"
                            >
                              View
                            </a>
                          </td>
                          <td className="px-4 py-3 text-sm">{drawing.name}</td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(
                              drawing.created_date
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm">PDF</td>
                          <td className="px-4 py-3 text-sm">
                            {drawing.discipline}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {drawing.remark}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {drawing.sent_by}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-4 text-gray-500"
                        >
                          No drawings available for this project.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              Please select a project.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

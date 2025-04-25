import React, { useState, useEffect } from "react";
import BASE_URL from "../../config";
import UploadDrawingForm from "./UploadDrawingForm";

export default function AdminDesign({ selectedProject, onBack }) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [drawings, setDrawings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDrawings = async () => {
      if (!selectedProject?.projectId) return; // ✅ Corrected condition

      try {
        const response = await fetch(
          `${BASE_URL}/api/projects/design_drawing/${selectedProject.projectId}` // http://localhost:3000/api/projects/design_drawing/2
        );
        if (!response.ok) throw new Error("Failed to fetch drawings");

        const data = await response.json();
        if (data && Array.isArray(data.designDrawings)) {
          setDrawings(data.designDrawings);
        } else {
          setDrawings([]);
        }
      } catch (error) {
        console.error("Error fetching drawings:", error);
      }
    };

    fetchDrawings();
  }, [selectedProject]);

  const handleUploadSubmit = (data) => {
    console.log("Form Submitted:", data);
    // Handle submission logic
  };

  const filteredDrawings = drawings.filter((drawing) =>
    drawing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        {showUploadForm ? (
          <div className="space-y-4 m-4">
            <h1 className="text-xl font-semibold tracking-wide text-left text-gray-500 uppercase">
              Upload Drawing
            </h1>
            <UploadDrawingForm
              onClose={() => setShowUploadForm(false)}
              onSubmit={handleUploadSubmit}
              selectedProject={selectedProject}
            />
          </div>
        ) : (
          <div className="container px-6 my-6 grid">
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold text-gray-600 mb-2">
                {selectedProject.projectName || "No Project Selected"}
              </h1>
              <div className="flex justify-end gap-4 mb-2">
                <div className="relative w-[280px]">
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => setShowUploadForm(true)}
                  className="px-3 py-1 text-sm font-medium leading-5 text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  Upload Drawing
                </button>
                <button
                  onClick={onBack}
                  className="px-3 py-1 text-sm font-medium leading-5 text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  Back
                </button>
              </div>
            </div>

            <hr className="border border-gray-400" />

            {/* Filters and Tabs */}
            <div className="flex justify-between items-center gap-3 mb-4 bg-white w-full mt-4">
              <div className="flex gap-3">
                {["All", "Architecture", "Interior", "Structural", "MEP", "Others"].map((tab, idx) => (
                  <button key={idx} className="px-3 py-1 bg-white rounded hover:bg-gray-300 text-sm font-medium">
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <select className="text-sm border border-gray-300 rounded-lg px-8 py-2 shadow-sm">
                  <option disabled selected>
                    Filter By
                  </option>
                  <option value="version">Version</option>
                  <option value="sentBy">Sent By</option>
                  <option value="status">Status</option>
                  <option value="discipline">Discipline</option>
                </select>

                <select className="text-sm border border-gray-300 rounded-lg px-8 py-2 shadow-sm">
                  <option disabled selected>
                    Sort By
                  </option>
                  <option value="date">Date</option>
                  <option value="aToZ">A to Z</option>
                </select>
              </div>
            </div>

            {/* Table Section */}
            <div className="w-full overflow-hidden rounded-lg shadow">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                      <th className="px-4 py-3">Document</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Latest Version</th>
                      <th className="px-4 py-3">Discipline</th>
                      <th className="px-4 py-3">Last Updated</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Sent By</th>
                      <th className="px-4 py-3">Previous Versions</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {filteredDrawings.map((drawing) => (
                      <tr key={drawing.id} className="text-gray-700 text-sm">
                        <td className="px-4 py-3">
                          {drawing.document_path && JSON.parse(drawing.document_path).map((path, index) => (
                            <a key={index} href={path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              View Document {index + 1}
                            </a>
                          ))}
                        </td>
                        <td className="px-4 py-3">{drawing.name}</td>
                        <td className="px-4 py-3">{drawing.latest_version_path ? "v1.0" : "N/A"}</td>
                        <td className="px-4 py-3">{drawing.discipline}</td>
                        <td className="px-4 py-3">{new Date(drawing.created_date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{drawing.status}</td>
                        <td className="px-4 py-3">{drawing.sent_by || "Unassigned"}</td>
                        <td className="px-4 py-3">{drawing.previous_versions === "NULL" ? "None" : drawing.previous_versions}</td>
                        <td className="px-4 py-3">
                          <button className="text-sm text-purple-600 hover:underline">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredDrawings.length === 0 && (
                      <tr>
                        <td colSpan="9" className="text-center text-gray-500 py-6">
                          No drawings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

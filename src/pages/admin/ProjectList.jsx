import React from "react";
import { FaDownload } from "react-icons/fa";
import ProjectTabs from "./ProjectTabs";

export default function ProjectList({ projects, onDelete, onManage }) {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-xs mt-6">
      <div className="w-full">
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
              <th className="px-4 py-3">Project Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Project Size</th>
              <th className="px-4 py-3">Assigned To</th>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <tr key={index} className="text-gray-700">
                  <td className="px-4 py-3 text-sm break-words">
                    {project.projectName}
                  </td>
                  <td className="px-4 py-3 text-sm break-words">
                    {project.description}
                  </td>
                  <td className="px-4 py-3 text-sm">{project.duration} days</td>
                  <td className="px-4 py-3 text-sm">
                    {project.projectSize} sqft
                  </td>
                  <td className="px-4 py-3 text-sm">{project.assignTo}</td>
                  <td className="px-4 py-2">
                    {project.documents.length > 0 ? (
                      <div className="flex flex-wrap gap-4">
                        {project.documents.map((docUrl, i) => {
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                            docUrl
                          );
                          return (
                            <div key={i} className="flex flex-col items-center">
                              {isImage ? (
                                <img
                                  src={docUrl}
                                  alt="Document"
                                  className="w-5 h-5 object-cover rounded-lg border"
                                />
                              ) : (
                                <div className="w-5 h-5 flex items-center justify-center bg-gray-200 text-gray-600 border rounded-lg">
                                  📄
                                </div>
                              )}
                              <a
                                href={docUrl}
                                download
                                className="flex items-center gap-1 text-purple-600 hover:underline text-sm mt-1"
                              >
                                <FaDownload />
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-500">No files</span>
                    )}
                  </td>
                  <td className="p-3 ">
                    {/* <button
                      onClick={() => onDelete(index)}
                      className="px-3 py-1 mr-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button> */}
                    <button
                      onClick={() => onManage(project)} // 🔥 Pass the full project object
                      className="px-3 py-1 text-sm font-medium text-white rounded-md bg-purple-600 hover:bg-purple-700"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center border p-2">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

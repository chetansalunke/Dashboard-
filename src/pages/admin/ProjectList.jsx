import React from "react";
import { FaDownload } from "react-icons/fa";

export default function ProjectList({ projects, onDelete, onManage }) {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-lg mt-6 bg-white">
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-600 uppercase border-b bg-gray-100">
              <th className="px-6 py-4">Project Name</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Project Size</th>
              <th className="px-6 py-4">Document</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <tr key={index} className="text-gray-700 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">
                    {project.projectName}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate">
                    {project.description}
                  </td>
                  <td className="px-6 py-4 text-sm">{project.duration} days</td>
                  <td className="px-6 py-4 text-sm">
                    {project.projectSize} sqft
                  </td>
                  <td className="px-6 py-4">
                    {project.documents && project.documents.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {project.documents.slice(0, 3).map((docUrl, i) => {
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                            docUrl
                          );
                          return (
                            <div key={i} className="flex flex-col items-center">
                              {isImage ? (
                                <div className="w-8 h-8 overflow-hidden rounded border">
                                  <img
                                    src={docUrl}
                                    alt="Document"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 border rounded">
                                  📄
                                </div>
                              )}
                              <a
                                href={docUrl}
                                download
                                className="flex items-center text-purple-600 hover:underline text-xs mt-1"
                              >
                                <FaDownload className="mr-1" size={10} />
                              </a>
                            </div>
                          );
                        })}
                        {project.documents.length > 3 && (
                          <span className="text-xs text-gray-500 self-center">
                            +{project.documents.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No files</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onManage(project)}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                    <p className="text-gray-500">No projects found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { FaTimes, FaDownload, FaUserCircle } from "react-icons/fa";
import BASE_URL from "../../config";
const projectData = [
  {
    projectName: "Enclave IT Park",
    timeline: "Jan 2024 - Dec 2025",
    progress: "45%",
  },
  {
    projectName: "GreenField Apartments",
    timeline: "Mar 2023 - Jun 2024",
    progress: "75%",
  },
  {
    projectName: "Metro Plaza Mall",
    timeline: "Jul 2022 - Aug 2025",
    progress: "60%",
  },
  {
    projectName: "Sunshine Villas",
    timeline: "Nov 2023 - Oct 2024",
    progress: "30%",
  },
  {
    projectName: "TechnoHub Towers",
    timeline: "Feb 2024 - Dec 2026",
    progress: "10%",
  },
];

const submissionData = [
  {
    projectName: "Enclave IT Park",
    taskName: "HVAC System Submission",
    assignedBy: "John Doe",
    date: "2025-04-12",
    status: "Pending",
  },
  {
    projectName: "Skyline Heights",
    taskName: "Electrical Layout",
    assignedBy: "Alice Smith",
    date: "2025-04-10",
    status: "Approved",
  },
  {
    projectName: "Riverfront Plaza",
    taskName: "Fire Safety Compliance",
    assignedBy: "Admin",
    date: "2025-04-08",
    status: "In Review",
  },
];

export default function ClientHome() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto p-6">
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <FaUserCircle className="text-3xl text-gray-500" />
              <h5 className="text-xl font-semibold tracking-wide text-gray-500 uppercase">
                Welcome{" "}
                {JSON.parse(localStorage.getItem("user"))?.username || ""}
              </h5>

              {/* Search */}
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
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full max-h-[50vh] overflow-hidden rounded-lg shadow mt-2 mb-4">
              <div className="w-full max-h-[250px] overflow-y-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-700  uppercase border-b bg-gray-50">
                      <th className="px-4 py-3">Project Name</th>
                      <th className="px-4 py-3">Timeline</th>
                      <th className="px-4 py-3">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {projectData.map((project, index) => (
                      <tr key={index} className="text-gray-700 text-sm">
                        <td className=" font-semibold px-4 py-3">
                          {project.projectName}
                        </td>
                        <td className="px-4 py-3">{project.timeline}</td>
                        <td className="px-4 py-3">{project.progress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <span className="text-[19px] font-semibold tracking-wide text-black">
              Latest Submission
            </span>

            <div className="w-full max-h-[50vh] overflow-hidden rounded-lg shadow mt-4 border border-gray-200 gap-4 mb-4">
              <div className="w-full max-h-[220px] overflow-y-auto">
                <table className="w-full table-auto text-sm text-left text-gray-700">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="uppercase text-xs font-semibold tracking-wide border-b border-gray-200">
                      <th className="px-4 py-3">Project Name</th>
                      <th className="px-4 py-3">Submission</th>
                      <th className="px-4 py-3">Submitted By</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {submissionData.length > 0 ? (
                      submissionData.map((project) => (
                        <tr
                          key={
                            project._id ||
                            `${project.projectName}-${project.date}`
                          }
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            {project.projectName || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {project.taskName || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {project.assignedBy || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {project.date
                              ? new Date(project.date).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {project.status || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="px-4 py-3 text-center text-gray-500"
                          colSpan={5}
                        >
                          No project submissions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <span className="text-[19px] font-semibold tracking-wide text-black">
              Upcomming Milestones
            </span>

            <div className="w-full max-h-[50vh] overflow-hidden rounded-lg shadow mt-4 border border-gray-200">
              <div className="w-full max-h-[220px] overflow-y-auto">
                <table className="w-full table-auto text-sm text-left text-gray-700">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="uppercase text-xs font-semibold tracking-wide border-b border-gray-200">
                      <th className="px-4 py-3">Milestone</th>
                      <th className="px-4 py-3">Project Name</th>
                      <th className="px-4 py-3">Submitted By</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {submissionData.length > 0 ? (
                      submissionData.map((project) => (
                        <tr
                          key={
                            project._id ||
                            `${project.projectName}-${project.date}`
                          }
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            {project.projectName || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {project.taskName || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {project.assignedBy || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {project.date
                              ? new Date(project.date).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {project.status || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="px-4 py-3 text-center text-gray-500"
                          colSpan={5}
                        >
                          No project submissions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

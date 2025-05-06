import React, { useEffect, useState } from "react";
import BASE_URL from "../../config";

export default function ReadOnlyProjectInfo({
  setIsFormOpen,
  selectedProject,
  users,
}) {
  const [projectData, setProjectData] = useState({
    projectName: "",
    siteaddress: "",
    description: "",
    projectsize: "",
    timeline: "",
    startdate: "",
    completiondate: "",
    projectid: "",
    clientId: null,
    consultantId: null,
  });

  const [clientInfo, setClientInfo] = useState({
    email: "",
    phone_number: "",
    username: "",
  });

  const [consultantInfo, setConsultantInfo] = useState({
    email: "",
    phone_number: "",
    username: "",
  });

  useEffect(() => {
    if (selectedProject) {
      loadProjectData();
    }
  }, [selectedProject, users]);

  const loadProjectData = () => {
    if (selectedProject && users) {
      const formatDate = (dateString) =>
        dateString
          ? new Date(dateString).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Not specified";

      setProjectData({
        projectName: selectedProject.projectName || "Not specified",
        siteaddress: selectedProject.site_address || "Not specified",
        description: selectedProject.description || "Not specified",
        projectsize: selectedProject.projectSize || "Not specified",
        timeline: selectedProject.duration || "Not specified",
        startdate: formatDate(selectedProject.project_start_date),
        completiondate: formatDate(selectedProject.project_completion_date),
        projectid: selectedProject.project_id || "Not specified",
        clientId: selectedProject.client_id || null,
        consultantId: selectedProject.consultant_id || null,
      });

      // Load client and consultant info
      if (users && users.length > 0) {
        const client = users.find((u) => u.id === selectedProject.client_id);
        const consultant = users.find(
          (u) => u.id === selectedProject.consultant_id
        );

        if (client) {
          setClientInfo({
            email: client.email || "Not available",
            phone_number: client.phone_number || "Not available",
            username: client.username || "Not available",
          });
        }

        if (consultant) {
          setConsultantInfo({
            email: consultant.email || "Not available",
            phone_number: consultant.phone_number || "Not available",
            username: consultant.username || "Not available",
          });
        }
      }
    }
  };

  const InfoField = ({ label, value }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-500 mb-1">
        {label}
      </label>
      <div className="w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg">
        {value || "Not specified"}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="p-6 mt-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Project Details</h2>
          <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            ID: {projectData.projectid}
          </span>
        </div>

        {/* Project Overview Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">
            <span className="text-purple-600 mr-2">●</span>Overview
          </h3>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-lg text-gray-800 mb-2">
              {projectData.projectName}
            </h4>
            <p className="text-gray-600">{projectData.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField label="Site Address" value={projectData.siteaddress} />
            <InfoField label="Project ID" value={projectData.projectid} />
          </div>
        </div>

        {/* Project Metrics Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">
            <span className="text-green-600 mr-2">●</span>Project Metrics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
              <span className="text-xs font-medium text-gray-500 mb-1">
                PROJECT SIZE
              </span>
              <span className="text-lg font-semibold text-gray-800">
                {projectData.projectsize}
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
              <span className="text-xs font-medium text-gray-500 mb-1">
                TIMELINE
              </span>
              <span className="text-lg font-semibold text-gray-800">
                {projectData.timeline}
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
              <span className="text-xs font-medium text-gray-500 mb-1">
                STATUS
              </span>
              <span className="text-lg font-semibold text-green-600">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Project Dates */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">
            <span className="text-orange-600 mr-2">●</span>Timeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
              <span className="text-xs font-medium text-gray-500 mb-1">
                START DATE
              </span>
              <span className="text-lg font-semibold text-gray-800">
                {projectData.startdate}
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
              <span className="text-xs font-medium text-gray-500 mb-1">
                COMPLETION DATE
              </span>
              <span className="text-lg font-semibold text-gray-800">
                {projectData.completiondate}
              </span>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">
            <span className="text-blue-600 mr-2">●</span>Client Information
          </h3>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {clientInfo.username}
                </h4>
                <p className="text-sm text-gray-600">Client</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-700">{clientInfo.email}</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-gray-700">{clientInfo.phone_number}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Consultant Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">
            <span className="text-purple-600 mr-2">●</span>Consultant
            Information
          </h3>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {consultantInfo.username}
                </h4>
                <p className="text-sm text-gray-600">Consultant</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-700">{consultantInfo.email}</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-gray-700">
                  {consultantInfo.phone_number}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section - Placeholder since we can't show actual documents */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">
            <span className="text-yellow-600 mr-2">●</span>Project Documents
          </h3>

          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600">
              Project documents are available for viewing
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Contact administrator for access
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="button"
            onClick={() => setIsFormOpen(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}

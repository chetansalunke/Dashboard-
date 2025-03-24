import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import BASE_URL from "../../config";

export default function AdminDashboard() {
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/projects/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Check if projects exist and set accordingly
        setProjectList(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
        setProjectList([]);
      }
    };

    fetchProjects();
  }, []);
  return (
    <div className="bg-gray-100 flex h-screen">
      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto ">
          <div className="container px-6 mx-auto grid">
            <div className="flex justify-between">
              <h5 className="my-6 text-2l font-semibold text-gray-700 light:text-gray-200">
                Total Project Running 4
              </h5>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-2">
              {/* Cards for Submitted Drawings, Pending RFI */}
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs light:bg-gray-800">
                <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full light:text-blue-100 light:bg-blue-500">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600 light:text-gray-400">
                    Submitted drawings F for approval
                  </p>
                  <p className="text-lg font-semibold text-gray-700 light:text-gray-200">
                    376
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs light:bg-gray-800">
                <div className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full light:text-teal-100 light:bg-teal-500">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600 light:text-gray-400">
                    Pending RFI
                  </p>
                  <p className="text-lg font-semibold text-gray-700 light:text-gray-200">
                    35
                  </p>
                </div>
              </div>
            </div>

            {/* Table - Project Details */}
            {projectList.length > 0 && (
              <div className="w-full overflow-hidden rounded-lg shadow-xs">
                <div className="w-full overflow-x-auto">
                  <table className="w-full whitespace-no-wrap">
                    <thead>
                      <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b light:border-gray-700 bg-gray-50 light:text-gray-400 light:bg-gray-800">
                        <th className="px-4 py-3">Project Name</th>
                        <th className="px-4 py-3">Timeline</th>
                        <th className="px-4 py-3">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y light:divide-gray-700 light:bg-gray-800">
                      {projectList.length > 0 ? (
                        projectList.map((project, index) => (
                          <tr
                            key={index}
                            className="text-gray-700 light:text-gray-400"
                          >
                            <td className="px-4 py-3 text-sm break-words">
                              {project.projectName}
                              {/* <div className="flex items-center text-sm">
                          <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                            <img
                              className="object-cover w-full h-full rounded-full"
                              src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                              alt=""
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <p className="font-semibold">Enclave IT Park</p>
                          </div>
                        </div> */}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {project.duration} days
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {/* <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full light:bg-green-700 light:text-green-100">
                        {project.status} 
                        </span> */}
                              <span
                                className={`px-2 py-1 font-semibold leading-tight rounded-full 
      ${
        project.status === "Approved"
          ? "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100"
          : project.status === "Pending"
          ? "text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100"
          : "text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100"
      }`}
                              >
                                {project.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center border p-2">
                            No projects found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

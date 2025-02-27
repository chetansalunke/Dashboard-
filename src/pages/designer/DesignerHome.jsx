import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

export default function DesignerHome() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-gray-100 flex h-screen">
      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto ">
          <div className="container px-6 mx-auto grid">
            <div className="flex justify-between">
              <h5 className="my-6 text-2l font-semibold text-gray-700 light:text-gray-200">
                Welcome {user.username ? ` ${user.username}` : ""}
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
                    Submitted Project
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
                    Pending Project
                  </p>
                  <p className="text-lg font-semibold text-gray-700 light:text-gray-200">
                    35
                  </p>
                </div>
              </div>
            </div>

            {/* Table - Project Details */}
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b light:border-gray-700 bg-gray-50 light:text-gray-400 light:bg-gray-800">
                      <th className="px-4 py-3">Task Name</th>
                      <th className="px-4 py-3">Project Name</th>
                      <th className="px-4 py-3">Assigned By</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y light:divide-gray-700 light:bg-gray-800">
                    <tr className="text-gray-700 light:text-gray-400">
                      <td className="px-4 py-3 text-sm">Login Functionality</td>
                      <td className="px-4 py-3 text-sm">
                        Inventory Management System
                      </td>
                      <td className="px-4 py-3 text-sm">John</td>
                      <td>
                        <button
                          onClick={() => handleView()}
                          className="px-3 py-1 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import BASE_URL from "../../config";

export default function Submission() {
  const selectedProject = JSON.parse(
    localStorage.getItem("selectedProject") || "{}"
  );

  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <h1 className="text-2xl font-semibold text-gray-600 mb-2">
            {selectedProject.projectName || "No Project Selected"}
          </h1>
          <hr className="border border-gray-400" />
          <div className="flex items-center gap-4 mt-2">
            <h3 className="text-xl font-semibold text-gray-600 mt-3">
              Submission
            </h3>

            {/* Search */}
            <div className="relative w-[280px] mt-4">
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
          <div className="flex items-center justify-between mt-4">
            {/* View Dropdown - aligned to start */}
            <select
              className="text-sm border border-gray-300 rounded-lg px-6 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 light:border-gray-600 light:bg-gray-700 focus:border-purple-400 light:text-gray-300 light:focus:shadow-outline-gray form-input"
              onChange={(e) => onViewChange(e.target.value)}
            >
              <option
                disabled
                selected
                className="text-sm font-semibold text-gray-700"
              >
                View
              </option>
              <option
                value="list"
                className="text-sm font-semibold text-gray-700"
              >
                List
              </option>
              <option
                value="content"
                className="text-sm font-semibold text-gray-700"
              >
                Content
              </option>
            </select>

            {/* Filter Dropdown - aligned to end */}
            <select className="text-sm border border-gray-300 rounded-lg px-6 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 light:border-gray-600 light:bg-gray-700 focus:border-purple-400 light:text-gray-300 light:focus:shadow-outline-gray form-input">
              <option
                disabled
                selected
                className="text-sm font-semibold text-gray-700"
              >
                Filter By
              </option>
              <option
                value="version"
                className="text-sm font-semibold text-gray-700"
              >
                Type
              </option>
              <option
                value="discipline"
                className="text-sm font-semibold text-gray-700"
              >
                Discipline
              </option>
              <option
                value="status"
                className="text-sm font-semibold text-gray-700"
              >
                Purpose
              </option>
              <option
                value="sentBy"
                className="text-sm font-semibold text-gray-700"
              >
                Sent By
              </option>
            </select>
          </div>

          {/* Table */}
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
                    <th className="px-4 py-3">Sent to</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

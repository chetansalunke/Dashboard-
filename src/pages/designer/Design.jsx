import React, { useState, useEffect } from "react";
import BASE_URL from "../../config";
import { useLocation } from "react-router-dom";

export default function Design() {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const location = useLocation();
  const { projectName } = location.state || {};

  const selectedProject = JSON.parse(localStorage.getItem("selectedProject") || "{}");


  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
        <h1 className="text-2xl font-semibold text-gray-600 mb-2">
            {selectedProject.projectName || "No Project Selected"}
          </h1>
          <hr className="border border-gray-400" />

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

          {/* Top Filters and Tabs */}
          <div className="flex justify-between items-center gap-3 mb-4 bg-white w-full mt-4">
            {/* Tabs */}
            <div className="flex gap-3">
              {[
                "All",
                "Architecture",
                "Interior",
                "Structural",
                "MEP",
                "Others",
              ].map((tab, idx) => (
                <button
                  key={idx}
                  className="px-3 py-1 bg-white rounded hover:bg-gray-300 text-sm font-medium"
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dropdowns */}
            <div className="flex gap-4">
              {/* Filter Dropdown */}
              <select className="text-sm border border-gray-300 rounded-lg px-8 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input">
                <option disabled selected className="text-sm font-semibold text-gray-700">
                  Filter By
                </option>
                <option value="version" className="text-sm font-semibold text-gray-700">Version</option>
                <option value="sentBy" className="text-sm font-semibold text-gray-700">Sent By</option>
                <option value="status" className="text-sm font-semibold text-gray-700">Status</option>
                <option value="discipline" className="text-sm font-semibold text-gray-700">Discipline</option>
              </select>

              {/* Sort Dropdown */}
              <select className="text-sm border border-gray-300 rounded-lg px-8 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input">
                <option disabled selected className="text-sm font-semibold text-gray-700">
                  Sort By
                </option>
                <option value="date" className="text-sm font-semibold text-gray-700">Date</option>
                <option value="aToZ" className="text-sm font-semibold text-gray-700">A to Z</option>
              </select>
            </div>
          </div>

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
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

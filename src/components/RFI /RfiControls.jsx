// components/RFI/RfiControls.js

import React from "react";

export default function RfiControls({
  activeTab,
  setActiveTab,
  onSearchChange,
  onCreateClick,
}) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Tabs */}
        <div className="flex border border-purple-300 rounded-md overflow-hidden shadow-md">
          {["All", "Pending", "Resolved"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium transition-colors duration-150 ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

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

        {/* Create RFI */}
        <button
          className="px-4 py-2 text-white text-sm font-medium bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={onCreateClick}
        >
          Create RFI
        </button>
      </div>
    </div>
  );
}

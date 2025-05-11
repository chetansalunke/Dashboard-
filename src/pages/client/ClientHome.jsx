import React, { useState, useEffect } from "react";
import { FaTimes, FaDownload, FaUserCircle } from "react-icons/fa";
import BASE_URL from "../../config";
import LatestSubmissions from "./LatestSubmissions";
import ProjectOverview from "./ProjectOverview";
import StatusCards from "./StatusCards";
import UpcomingMilestones from "./UpcomingMilestones";

export default function ClientHome() {
  const user = JSON.parse(localStorage.getItem("user")); 
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto p-6">
          <div>
            {/* Header and Search */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <FaUserCircle className="text-3xl text-gray-500" />
                <h5 className="text-xl font-semibold tracking-wide text-gray-500 uppercase">
                  Welcome {user.username}
                </h5>
                {/* <h1>{user.id}</h1> */}
              </div>
              <div className="relative w-[280px]">
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
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
                />
              </div>
            </div>

            {/* Overview and Status */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
              <div className="lg:col-span-3">
                <ProjectOverview user={user}/>
              </div>
              <div className="lg:col-span-1 mt-10">
                <StatusCards />
              </div>
            </div>

            {/* Other sections */}
            <LatestSubmissions />
            <UpcomingMilestones />
          </div>
        </div>
      </div>
    </div>
  );
}

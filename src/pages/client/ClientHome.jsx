import React, { useState, useEffect } from "react";

import ProjectOverview from "./ProjectOverview";
import StatusCards from "./StatusCards";
import { Search, User, Bell } from "lucide-react";

// Main Dashboard Component
export default function ClientHome() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Get user from localStorage - replace with your actual user management
    const userData = JSON.parse(localStorage.getItem("user")) || {
      username: "John Doe",
      id: 1,
      email: "john@example.com",
    };
    setUser(userData);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-25 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Welcome Section */}
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Welcome back, {user.username}!
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectOverview user={user} />
      </div>
    </div>
  );
}

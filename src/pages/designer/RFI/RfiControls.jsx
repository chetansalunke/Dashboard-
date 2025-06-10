import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Upload,
  Download,
  Eye,
  Send,
  Check,
} from "lucide-react";

// Enhanced RFI Controls Component
export default function RfiControls({
  activeTab,
  setActiveTab,
  onSearchChange,
  onCreateClick,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Left side - Tabs and Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          {/* Tabs */}
          <div className="inline-flex bg-gray-50 rounded-lg p-1 shadow-inner">
            {["All", "Pending", "Resolved"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 placeholder-gray-500"
              type="text"
              placeholder="Search RFIs..."
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Right side - Create Button */}
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={onCreateClick}
        >
          <Plus className="w-4 h-4" />
          Create RFI
        </button>
      </div>
    </div>
  );
}

import React, { useRef, useState, useEffect } from "react";

export default function ChangeOrderControl({
  user,
  userRole,
  activeTab,
  setActiveTab,
  onSearchChange,
  setSortOption,
  onCreateClick,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const sortButtonRef = useRef(null);
  const [isDesigner, setIsDesigner] = useState(null);

  useEffect(() => {
    if (userRole) {
      setIsDesigner(userRole === "designer");
    }
  }, [user]); // rerun effect whenever `user` changes
  // console.log(userRole);

  const handleSortClick = () => {
    if (!showDropdown && sortButtonRef.current) {
      const rect = sortButtonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4 + "px",
        left: rect.left + "px",
        zIndex: 9999,
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "0.375rem",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        width: "180px",
      });
    }
    setShowDropdown(!showDropdown);
  };

  // Hide dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortButtonRef.current && !sortButtonRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap justify-end items-center gap-4 w-full h-full">
      <div className="flex flex-wrap items-center gap-4">
        {/* Tabs */}
        <div className="flex border border-purple-300 rounded-md overflow-hidden shadow-md">
          {["All", "Pending", "Approved"].map((tab) => (
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
        <div className="relative">
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

        {isDesigner && (
          <button
            className="px-4 py-2 text-white text-sm font-medium bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={onCreateClick} // ✅ use the passed prop
          >
            Create Change Order
          </button>
        )}

        {/* Sort Dropdown */}
        <div>
          <button
            ref={sortButtonRef}
            onClick={handleSortClick}
            className="px-3 py-1 bg-white border text-sm font-medium rounded hover:bg-gray-100"
          >
            Sort by ▼
          </button>
          {showDropdown && (
            <div style={dropdownStyle}>
              <button
                onClick={() => {
                  setSortOption("date");
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Date
              </button>
              <button
                onClick={() => {
                  setSortOption("a-z");
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                A to Z
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

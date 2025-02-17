import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Ensure correct import
import { Outlet } from "react-router-dom"; // Import Outlet for nested routes
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext); // Get user from Context API

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <Sidebar role={user?.role} /> {/* Pass role dynamically */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet /> {/* This will render the child route */}
      </div>
    </div>
  );
};

export default Layout;

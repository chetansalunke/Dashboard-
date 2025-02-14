import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminSidebar from "./AdminSidebar";
import Projects from "./Projects";
import Users from "./Users";

const Admin = () => {
  return (
    <Router>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" Component={AdminDashboard} />
            <Route path="/projects" Component={Projects} />
            <Route path="/users" Component={Users} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default Admin;

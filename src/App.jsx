import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" Component={Dashboard} />
            <Route path="/forms" element={<h1>Forms</h1>} />
            {/* Add other routes */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

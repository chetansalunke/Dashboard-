import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Approval from "./pages/Approval";
import Rfi from "./pages/Rfi";
import ImageView from "./pages/ImageView";
const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" Component={Dashboard} />
            <Route path="/apporval" Component={Approval} />
            <Route path="/rfi" Component={Rfi} />
            <Route path="/image-view" component={ImageView} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

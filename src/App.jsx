import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard"; // Common Dashboard for Client/Designer/Expert
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Layout from "./components/Layout";
import Projects from "./pages/admin/Projects";
import Users from "./pages/admin/Users";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Sign In Route */}
          <Route path="/" element={<SignIn />} />

          {/* Admin Dashboard with Nested Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <Layout>
                <AdminDashboard />
              </Layout>
            }
          >
            {/* Nested Routes */}
            <Route path="" element={<AdminDashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="users" element={<Users />} />
            <Route path="create-users" element={<Users />} />
            <Route path="create-project" element={<Users />} />
          </Route>

          {/* Client Dashboard Route */}
          <Route
            path="/client-dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />

          {/* Designer Dashboard Route */}
          <Route
            path="/designer-dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />

          {/* Expert Dashboard Route */}
          <Route
            path="/expert-dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

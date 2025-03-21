import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Projects from "./pages/admin/Projects";
import Users from "./pages/admin/Users";
import DesignerHome from "./pages/designer/DesignerHome";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";

const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const PublicRoute = ({ element }) => {
  const storedUser = getStoredUser();

  if (storedUser) {
    const roleDashboards = {
      admin: "/admin-dashboard",
      designer: "/designer-dashboard",
      client: "/client-dashboard",
      expert: "/expert-dashboard",
    };
    return <Navigate to={roleDashboards[storedUser.role] || "/"} replace />;
  }

  return element;
};

// Private Route - Allow only authenticated users to access protected pages
const PrivateRoute = ({ element, allowedRoles }) => {
  const storedUser = getStoredUser();

  if (!storedUser) return <Navigate to="/" replace />; // Redirect if not logged in

  if (!allowedRoles.includes(storedUser.role))
    return <Navigate to="/" replace />; // Redirect if role doesn't match

  return element;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute element={<SignIn />} />} />
          <Route
            path="/signup"
            element={<PublicRoute element={<SignUp />} />}
          />

          {/* Protected Routes Wrapped in Layout */}
          <Route element={<Layout />}>
            {/* Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute
                  element={<AdminDashboard />}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route
              path="/admin-dashboard/projects"
              element={
                <PrivateRoute element={<Projects />} allowedRoles={["admin"]} />
              }
            />
            <Route
              path="/admin-dashboard/users"
              element={
                <PrivateRoute element={<Users />} allowedRoles={["admin"]} />
              }
            />

            {/* Designer Routes */}
            <Route
              path="/designer-dashboard"
              element={
                <PrivateRoute
                  element={<DesignerHome />}
                  allowedRoles={["designer"]}
                />
              }
            />

            <Route
              path="/client-dashboard"
              element={
                <PrivateRoute
                  element={<AdminDashboard />}
                  allowedRoles={["client"]}
                />
              }
            />

            <Route
              path="/expert-dashboard"
              element={
                <PrivateRoute
                  element={<AdminDashboard />}
                  allowedRoles={["expert"]}
                />
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

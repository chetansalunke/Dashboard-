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
import Design from "./pages/designer/Design";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import Submission from "./pages/designer/Submission";
import RFI from "./pages/designer/RFI/RFI";
import ClientRFI from "./pages/client/ClientRFI";
import Management from "./pages/designer/Management";
import DesignerProjects from "./pages/designer/DesignerProjects";
import ClientHome from "./pages/client/ClientHome";
import Approvals from "./pages/client/Approvals";
import Received from "./pages/client/Received";
import Send from "./pages/client/Send";
// import AdminDesignerProjects from "./pages/admin/AdminDesignerProjects";
import AdminDesignWrapper from "./pages/admin/AdminDesignWrapper";
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
            <Route
              path="/admin-dashboard/design"
              element={
                <PrivateRoute
                  element={<AdminDesignWrapper />}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route
              path="/admin-dashboard/communication/rfi"
              element={
                <PrivateRoute element={<RFI />} allowedRoles={["admin"]} />
              }
            />

            <Route
              path="/admin-dashboard/communication/submission"
              element={
                <PrivateRoute
                  element={<Submission />}
                  allowedRoles={["admin"]}
                />
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
              path="/designer-dashboard/projects"
              element={
                <PrivateRoute
                  element={<DesignerProjects />}
                  allowedRoles={["designer"]}
                />
              }
            />

            <Route
              path="/designer-dashboard/projects/design"
              element={
                <PrivateRoute
                  element={<Design />}
                  allowedRoles={["designer"]}
                />
              }
            />

            <Route
              path="/designer-dashboard/communication/rfi"
              element={
                <PrivateRoute element={<RFI />} allowedRoles={["designer"]} />
              }
            />

            <Route
              path="/designer-dashboard/communication/submission"
              element={
                <PrivateRoute
                  element={<Submission />}
                  allowedRoles={["designer"]}
                />
              }
            />

            <Route
              path="/designer-dashboard/management"
              element={
                <PrivateRoute
                  element={<Management />}
                  allowedRoles={["designer"]}
                />
              }
            />
            {/* Client Routes */}
            <Route
              path="/client-dashboard"
              element={
                <PrivateRoute
                  element={<ClientHome />}
                  allowedRoles={["client"]}
                />
              }
            />

            <Route
              path="/client-aprovels"
              element={
                <PrivateRoute
                  element={<Approvals />}
                  allowedRoles={["client"]}
                />
              }
            />
            <Route
              path="/client-rif"
              element={
                <PrivateRoute
                  element={<ClientRFI />}
                  allowedRoles={["client"]}
                />
              }
            />
            <Route
              path="/client-files-received"
              element={
                <PrivateRoute
                  element={<Received />}
                  allowedRoles={["client"]}
                />
              }
            />
            <Route
              path="/client-files-send"
              element={
                <PrivateRoute element={<Send />} allowedRoles={["client"]} />
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

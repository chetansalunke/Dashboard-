import { Navigate, Outlet } from "react-router-dom";
import { roleRoutes } from "./routesConfig";

const ProtectedRoute = ({ user }) => {
  if (!user || !user.role) {
    return <Navigate to="/" replace />;
  }

  const allowedRoutes = roleRoutes[user.role] || [];
  return allowedRoutes.length > 0 ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default ProtectedRoute;

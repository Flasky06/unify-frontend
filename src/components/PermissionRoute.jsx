import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

/**
 * PermissionRoute - Route wrapper that enforces role and permission-based access control
 * 
 * @param {React.ReactNode} children - The component to render if authorized
 * @param {string} requiredPermission - Optional permission required to access this route
 * @param {string} requiredRole - Optional role required to access this route
 * @param {string[]} requiredRoles - Optional array of roles (user must have at least one)
 * 
 * Priority: requiredRole > requiredRoles > requiredPermission
 */
const PermissionRoute = ({
  children,
  requiredPermission = null,
  requiredRole = null,
  requiredRoles = null
}) => {
  const { isAuthenticated, user, hasPermission, hasRole, hasAnyRole } = useAuthStore();
  const location = useLocation();

  // First check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for specific required role
  if (requiredRole && !hasRole(requiredRole)) {
    console.warn(
      `Access denied: User ${user?.email} (${user?.role}) attempted to access ${location.pathname} which requires role ${requiredRole}`
    );
    return <Navigate to="/dashboard" replace />;
  }

  // Check for any of the required roles
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    console.warn(
      `Access denied: User ${user?.email} (${user?.role}) attempted to access ${location.pathname} which requires one of roles: ${requiredRoles.join(", ")}`
    );
    return <Navigate to="/dashboard" replace />;
  }

  // Check for required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.warn(
      `Access denied: User ${user?.email} (${user?.role}) attempted to access ${location.pathname} which requires permission ${requiredPermission}`
    );
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PermissionRoute;

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin) {
    try {
      const user = JSON.parse(storedUser);

      if (user?.role !== "admin") {
        return <Navigate to="/landing2" replace />;
      }
    } catch {
      return <Navigate to="/auth" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

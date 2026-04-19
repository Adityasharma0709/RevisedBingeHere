import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false, requireOwner = false }) => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/auth" replace />;
  }

  try {
    const user = JSON.parse(storedUser);

    if (requireAdmin && user?.role !== "admin") {
      return <Navigate to="/landing2" replace />;
    }

    if (requireOwner && user?.role !== "owner") {
      return <Navigate to="/landing2" replace />;
    }
  } catch {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;

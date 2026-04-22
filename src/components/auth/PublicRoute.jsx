import React from "react";
import { Navigate } from "react-router-dom";

const getRedirectPathForUser = (user) => {
  if (user?.role === "admin") return "/admin";
  if (user?.role === "owner") return "/owner/dashboard";
  return "/dashboard";
};

const PublicRoute = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return children;

  try {
    const user = JSON.parse(storedUser);
    return <Navigate to={getRedirectPathForUser(user)} replace />;
  } catch {
    return children;
  }
};

export default PublicRoute;


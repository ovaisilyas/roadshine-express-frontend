import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  // Redirect if no user or role is not Administrator
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  if (user.role !== "Administrator" && user.role !== "Employee") {
    return <Navigate to="/" replace />; // Redirect to home or login page
  }

  return children;
};

export default ProtectedRoute;

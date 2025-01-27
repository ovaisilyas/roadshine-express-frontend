import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  console.log("User Role: "+user?.role);
  // Redirect if no user or role is not Administrator
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "Administrator") {
    return <Navigate to="/" replace />; // Redirect to home or login page
  }

  return children;
};

export default ProtectedRoute;

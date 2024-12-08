import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Authmiddleware = ({ children, restrictedRoutes = [] }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");

    if (authUser) {
      try {
        const token = JSON.parse(authUser).token;
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error("Invalid token:", error);
        setUserRole(null);
      }
    }
  }, []);

  if (!localStorage.getItem("authUser")) {
    return <Navigate to="/login" />;
  }

  if (userRole === "F" && restrictedRoutes.includes(window.location.pathname)) {
    return <Navigate to="/unauthorized" />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default Authmiddleware;

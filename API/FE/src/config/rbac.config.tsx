import { useContext } from "react";
import AuthContext from "../context/auth.context";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const CheckPermission = ({ children }: any) => {
  const { loggedInUser } = useContext(AuthContext); // Access loggedInUser properly

  if (!loggedInUser) {
    // User is not logged in, redirect to login page
    toast.error("Please Login first");
    return <Navigate to="/signin" />;
  }

  if (loggedInUser.role === "admin") {
    return children; // Render admin content if the role is admin
  } else {
    // If not an admin, redirect based on their role and show warning
    toast.warn("You do not have permission to access this panel!");
    return <Navigate to={`/${loggedInUser.role}`} />;
  }
};

export default CheckPermission;

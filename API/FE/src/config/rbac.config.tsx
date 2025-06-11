import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingComponent from '../components/common/loading/loading.component'; // Ensure path is correct
import Errorpage from '../components/common/error/notfounderror'; // Ensure path is correct
import { RootState } from './store.config'; // Ensure path is correct for RootState

interface CheckPermissionProps {
  allowedBy: string[]; // Array of roles allowed to access this route (e.g., ['admin', 'member'])
  children?: React.ReactNode; // ADDED: Allow children to be passed to this component
}

const CheckPermission: React.FC<CheckPermissionProps> = ({ allowedBy, children }) => {
  // Access authLoading and loggedInUser from Redux store
  const authLoading = useSelector((state: RootState) => state.auth.authLoading);
  const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

  console.group("CheckPermission Render Cycle");
  console.log("  CheckPermission: Current authLoading:", authLoading);
  console.log("  CheckPermission: Current loggedInUser:", loggedInUser);
  console.log("  CheckPermission: Allowed roles:", allowedBy);
  console.groupEnd();

  // 1. If authentication check is still in progress, show loading component
  if (authLoading) {
    console.log("CheckPermission: authLoading is TRUE. Displaying LoadingComponent.");
    return <LoadingComponent />;
  }

  // 2. If authLoading is false, proceed to check user status and role
  // If no user is logged in, redirect to sign-in page
  if (!loggedInUser) {
    console.warn("CheckPermission: No user logged in. Redirecting to /signin.");
    return <Navigate to="/signin" replace />;
  }

  // Check if the logged-in user's role is included in the allowedBy roles
  if (allowedBy.includes(loggedInUser.role)) {
    console.log(`CheckPermission: User '${loggedInUser.email}' has role '${loggedInUser.role}', which is allowed. Rendering content.`);
    // If the user has permission, render the children directly
    // Using children prop is more direct when wrapping components,
    // whereas <Outlet /> is typically used when CheckPermission is itself rendered as an element prop in <Route element={...} />
    return <>{children}</>; // Render children directly when used as a wrapper component
  } else {
    // If user is logged in but does not have the required role, show an access denied page
    console.warn(`CheckPermission: User '${loggedInUser.email}' (Role: ${loggedInUser.role}) does not have permission. Allowed roles: ${allowedBy}.`);
    return (
      <Errorpage
        url="/admin" // Redirect back to admin dashboard or a more appropriate page
        label="Go To Dashboard"
        // message="Access Denied: You do not have permission to view this page." // Message prop removed in previous fix
      />
    );
  }
};

export default CheckPermission;

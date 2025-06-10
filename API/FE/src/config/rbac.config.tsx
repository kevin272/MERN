import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from './store.config';
import { logoutUser, clearAuthError } from '../components/reducer/user.reducer';

const CheckPermission = ({ children, allowedBy }: { children: React.ReactNode; allowedBy: string[] }) => {
  const dispatch: AppDispatch = useDispatch();
  const alreadyWarnedRef = React.useRef(false);

  const { loggedInUser, authLoading, authError } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
    authLoading: state.auth.authLoading,
    authError: state.auth.authError
  }));

  useEffect(() => {
    if (authError) {
      if (
        authError.includes("Failed to get logged in user") ||
        authError.includes("jwt expired") ||
        authError.includes("invalid token")
      ) {
        toast.error("Your session has expired. Please log in again.");
        dispatch(logoutUser());
      } else {
        toast.error(`Authentication error: ${authError}`);
      }
      dispatch(clearAuthError());
    }
  }, [authError, dispatch]);

  useEffect(() => {
    if (!authLoading && !loggedInUser) {
      toast.error("Please log in first.");
    }
  }, [authLoading, loggedInUser]);

  if (authLoading) return <div>Loading permissions...</div>;

  if (!loggedInUser) return <Navigate to="/signin" />;

  if (!allowedBy.includes(loggedInUser.role)) {
    if (!alreadyWarnedRef.current) {
      toast.warn("You do not have permission to access this panel!");
      alreadyWarnedRef.current = true;
    }
    return <Navigate to={`/${loggedInUser.role}`} />;
  }

  return <>{children}</>;
};
export default CheckPermission;

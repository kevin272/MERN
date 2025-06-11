import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoadingComponent from '../components/common/loading/loading.component';
import Errorpage from '../components/common/error/notfounderror';
import { RootState } from './store.config';

interface CheckPermissionProps {
  allowedBy: string[];
  children?: React.ReactNode;
}

const CheckPermission: React.FC<CheckPermissionProps> = ({ allowedBy, children }) => {
  const authLoading = useSelector((state: RootState) => state.auth.authLoading);
  const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

  console.group("CheckPermission Render Cycle");
  console.log("  CheckPermission: Current authLoading:", authLoading);
  console.log("  CheckPermission: Current loggedInUser:", loggedInUser);
  console.log("  CheckPermission: Allowed roles:", allowedBy);
  console.groupEnd();

  if (authLoading) {
    console.log("CheckPermission: authLoading is TRUE. Displaying LoadingComponent.");
    return <LoadingComponent />;
  }

  if (!loggedInUser) {
    console.warn("CheckPermission: No user logged in. Redirecting to /signin.");
    return <Navigate to="/signin" replace />;
  }

  if (allowedBy.includes(loggedInUser.role)) {
    console.log(`CheckPermission: User '${loggedInUser.email}' has role '${loggedInUser.role}', which is allowed. Rendering content.`);
    return <>{children}</>;
  } else {
    console.warn(`CheckPermission: User '${loggedInUser.email}' (Role: ${loggedInUser.role}) does not have permission. Allowed roles: ${allowedBy}.`);
    return (
      <Errorpage
        url="/admin"
        label="Go To Dashboard"
      />
    );
  }
};

export default CheckPermission;

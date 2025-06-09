import React, { useEffect, useRef } from 'react'; // Import useRef
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../layout/layout';
import Landingpage from '../pages/landing';
import { Signin, ForgotPassword } from '../pages/signin/signin';
import Contact from '../pages/contactpage';
import Aboutuspage from '../pages/About Us';
import {
    CampaignCreatePage,
    Campaignlistingpage,
    CampaignEditPage,
} from '../pages/campaign/index';
// REMOVED: No longer using AuthContext for global auth state
// import AuthContext from '../context/auth.context';
// REMOVED: authSvc directly called in Routerconfig is replaced by Redux thunk
// import authSvc from '../pages/auth/auth.service';
import AdminLayout from '../layout/cms.page';
import { AdminDashboard } from '../pages/dashboard';
import CheckPermission from './rbac.config';
import LoadingComponent from '../components/common/loading/loading.component';
import Errorpage from '../components/common/error/notfounderror';
import CampaignPage from '../pages/campaign/campaignpage';
import ResetPassword from '../pages/signin/reset-password.page';
import UserActivation from '../pages/auth/activate/activate.user.page';
import CampaignOverview from '../pages/campaign/campaign.overview.component';
import UserOverview from '../pages/Our Team/user.overview.component';
import Ourteamcomponent from '../components/Our Team/ourteamcard';
import {
    UserCreatePage,
    UserListingPage,
    UserEditPage,
} from '../pages/Our Team/exporting';
import OverallDonationSummary from '../pages/dashboard/donation.summary';
import UserDonationDashboard from '../pages/dashboard/userdonation.dashboard';

// NEW IMPORTS FOR REDUX
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedInUserRedux, setLoggedInUserForRedux } from '../components/reducer/user.reducer'; // Adjust path
import { RootState, AppDispatch } from './store.config'; // Adjust path
export const Routerconfig = () => {
    const dispatch: AppDispatch = useDispatch();
    const authLoading = useSelector((state: RootState) => state.auth.authLoading);
    const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

    // Use a ref to ensure the initial authentication check runs only once.
    const initialAuthCheckPerformed = useRef(false);

    // Enhanced logging for Routerconfig component renders
    console.group("Routerconfig Render Cycle");
    console.log("  Current authLoading state (from Redux):", authLoading);
    console.log("  Current loggedInUser state (from Redux):", loggedInUser);
    console.log("  initialAuthCheckPerformed.current (ref value):", initialAuthCheckPerformed.current);
    console.groupEnd();


    useEffect(() => {
        // This useEffect runs once on mount to kick off the initial auth check.
        // It should NOT re-run due to changes in authLoading or loggedInUser,
        // as the ref ensures a single execution.
        console.groupCollapsed("Routerconfig useEffect Triggered");
        console.log("  initialAuthCheckPerformed.current at useEffect start:", initialAuthCheckPerformed.current);

        if (!initialAuthCheckPerformed.current) {
            initialAuthCheckPerformed.current = true; // Mark as performed
            console.log("  Routerconfig: Performing initial authentication check.");

            const token = localStorage.getItem('_at');
            console.log("  Routerconfig: Token found in localStorage:", token ? "YES" : "NO");

            if (token) {
                // If a token exists, dispatch the thunk to fetch user details.
                // The Redux slice (user.reducer.tsx) will handle setting authLoading to false
                // once the thunk is fulfilled or rejected.
                console.log("  Routerconfig: Token exists, dispatching getLoggedInUserRedux().");
                dispatch(getLoggedInUserRedux());
            } else {
                // If no token exists, explicitly set loggedInUser to null and authLoading to false.
                // This immediately resolves the initial loading state for unauthenticated users.
                console.log("  Routerconfig: No token, dispatching setLoggedInUserForRedux(null).");
                dispatch(setLoggedInUserForRedux(null)); // This action sets authLoading: false in the slice
            }
        } else {
            console.log("  Routerconfig: Initial authentication check already performed.");
        }
        console.groupEnd();
    }, [dispatch]); // Dependency on dispatch is good practice, but it's stable.

    // Display a global loading component while the authentication status is being determined.
    // This blocks rendering of routes until auth status is known.
    if (authLoading) {
        console.log("Routerconfig: authLoading is TRUE. Displaying LoadingComponent.");
        return <LoadingComponent />;
    }

    console.log("Routerconfig: authLoading is FALSE. Rendering application routes.");

    return (
        <>
            <Routes>
                {/* ==================== Public Routes ==================== */}
                <Route element={<Layout />}>
                    <Route index element={<Landingpage />} />
                    <Route path="/aboutus" element={<Aboutuspage />} />

                    {/* Our Team (now displaying Users) - Public Access */}
                    <Route path="/ourteam" element={<Ourteamcomponent />} />
                    <Route path="/ourteam/:id" element={<UserOverview />} />

                    {/* Campaigns - Public Access to Overview */}
                    <Route path="/campaign" element={<CampaignPage />} />
                    <Route path="/campaign/:id" element={<CampaignOverview />} />

                    <Route path="/contact" element={<Contact />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/activate/:token" element={<UserActivation />} />
                    <Route path="*" element={<Errorpage url="/" label="Go To Home" />} />
                </Route>

                {/* ==================== Signin Route (MUST NOT BE PROTECTED) ==================== */}
                <Route path="/signin" element={<Signin />} />

                {/* ==================== Protected Admin/Dashboard Routes ==================== */}
                {/* All admin and member functionalities are now consolidated under /admin */}
                <Route
                    path="/admin"
                    element={
                        // CheckPermission now reads auth state directly from Redux,
                        // ensuring consistent authentication logic.
                        <CheckPermission allowedBy={['admin', 'member']}>
                            <AdminLayout />
                        </CheckPermission>
                    }
                >
                    {/* Default admin dashboard view */}
                    <Route index element={<AdminDashboard />} />

                    {/* User-specific donation history */}
                    <Route path="donations" element={<OverallDonationSummary />} />
                    <Route path="donation" element={<UserDonationDashboard />} />

                    {/* Campaign Management routes */}
                    <Route path="campaign" element={<Campaignlistingpage />} />
                    <Route path="campaign/create" element={<CampaignCreatePage />} />
                    <Route path="campaign/edit/:id" element={<CampaignEditPage />} />

                    {/* User Management routes */}
                    <Route path="users" element={<UserListingPage />} />
                    <Route path="users/create" element={<UserCreatePage />} />
                    <Route path="users/edit/:id" element={<UserEditPage />} />

                    {/* Catch-all for unknown paths under /admin */}
                    <Route path="*" element={<Errorpage url="/admin" label="Go To Dashboard" />} />
                </Route>

                {/* Redirect /dashboard to /admin for consistency */}
                <Route path="/dashboard/*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </>
    );
};

export default Routerconfig;

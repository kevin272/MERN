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
import ChatViewPage from '../pages/chat/chat.view'; // This is your admin chat page
import GuestChatPage from '../components/chat/guest.chat'; // This is your guest chat page

// REDUX Imports
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedInUserRedux, setLoggedInUserForRedux } from '../components/reducer/user.reducer';
import { RootState, AppDispatch } from './store.config';

export const Routerconfig = () => {
    const dispatch: AppDispatch = useDispatch();
    const authLoading = useSelector((state: RootState) => state.auth.authLoading);
    const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

    // Use a ref to ensure initial auth check runs only once per app lifecycle
    const initialAuthCheckPerformed = useRef(false);

    // Detailed console logging for render cycles
    console.group("Routerconfig Render Cycle");
    console.log("  Current authLoading state (from Redux):", authLoading);
    console.log("  Current loggedInUser state (from Redux):", loggedInUser);
    console.log("  initialAuthCheckPerformed.current (ref value):", initialAuthCheckPerformed.current);
    console.groupEnd();

    useEffect(() => {
        // This useEffect runs once on mount to kick off the initial auth check.
        console.groupCollapsed("Routerconfig useEffect Triggered");
        console.log("  initialAuthCheckPerformed.current at useEffect start:", initialAuthCheckPerformed.current);

        if (!initialAuthCheckPerformed.current) {
            initialAuthCheckPerformed.current = true; // Mark as performed
            console.log("  Routerconfig: Performing initial authentication check.");

            const token = localStorage.getItem('_at');
            console.log("  Routerconfig: Token found in localStorage:", token ? "YES" : "NO");

            if (token) {
                console.log("  Routerconfig: Token exists, dispatching getLoggedInUserRedux().");
                dispatch(getLoggedInUserRedux());
            } else {
                // If no token exists, explicitly set loggedInUser to null and authLoading to false.
                // This ensures the loading state resolves even if no token is found.
                console.log("  Routerconfig: No token, dispatching setLoggedInUserForRedux(null).");
                dispatch(setLoggedInUserForRedux(null)); // This action sets authLoading: false in the slice
            }
        } else {
            console.log("  Routerconfig: Initial authentication check already performed.");
        }
        console.groupEnd();
    }, [dispatch]); // Dependency on dispatch is good practice, but it's stable.

    // Display a global loading component while the authentication status is being determined.
    // This is critical to prevent rendering protected routes before auth state is known.
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

                    {/* Our Team*/}
                    <Route path="/ourteam" element={<Ourteamcomponent />} />
                    <Route path="/ourteam/:id" element={<UserOverview />} />

                    {/* Campaigns*/}
                    <Route path="/campaign" element={<CampaignPage />} />
                    <Route path="/campaign/:id" element={<CampaignOverview />} />

                    <Route path="/contact" element={<Contact />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/activate/:token" element={<UserActivation />} />

                    {/* Guest Chat Route - Publicly accessible */}
                    <Route path="/chat/guest" element={<GuestChatPage />} />

                    {/* Catch-all for unknown paths */}
                    <Route path="*" element={<Errorpage url="/" label="Go To Home" />} />
                </Route>

                {/* ==================== Signin Route ==================== */}
                <Route path="/signin" element={<Signin />} />

                {/* ==================== Protected Admin/Dashboard Routes ==================== */}
                <Route
                    path="/admin"
                    element={
                        // CheckPermission uses loggedInUser and authLoading from Redux state
                        // It will only render AdminLayout if permissions are met
                        <CheckPermission allowedBy={['admin', 'member']}>
                            <AdminLayout />
                        </CheckPermission>
                    }
                >
                    {/* Default admin dashboard view */}
                    <Route index element={<AdminDashboard />} />

                    {/*Donation history */}
                    <Route path="donations" element={<OverallDonationSummary />} />
                    <Route path="donation" element={<UserDonationDashboard />} />

                    {/* Campaign Management */}
                    <Route path="campaign" element={<Campaignlistingpage />} />
                    <Route path="campaign/create" element={<CampaignCreatePage />} />
                    <Route path="campaign/edit/:id" element={<CampaignEditPage />} />

                    {/* User Management */}
                    <Route path="users" element={<UserListingPage />} />
                    <Route path="users/create" element={<UserCreatePage />} />
                    <Route path="users/edit/:id" element={<UserEditPage />} />

                    {/* Chat Management (Admin Panel) */}
                    <Route path="chat" element={<ChatViewPage />} />

                    {/* Catch-all for unknown paths under /admin */}
                    <Route path="*" element={<Errorpage url="/admin" label="Go To Dashboard" />} />
                </Route>
                <Route path="/dashboard/*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </>
    );
};

export default Routerconfig;

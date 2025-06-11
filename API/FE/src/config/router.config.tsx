import React, { useEffect, useRef } from 'react';
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
import ChatViewPage from '../pages/chat/chat.view';
import GuestChatPage from '../components/chat/guest.chat';

import { useDispatch, useSelector } from 'react-redux';
import { getLoggedInUserRedux, setLoggedInUserForRedux } from '../components/reducer/user.reducer';
import { RootState, AppDispatch } from './store.config';

export const Routerconfig = () => {
    const dispatch: AppDispatch = useDispatch();
    const authLoading = useSelector((state: RootState) => state.auth.authLoading);
    const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

    // Use a ref to ensure initial auth check runs only once per app lifecycle
    const initialAuthCheckPerformed = useRef(false);

    useEffect(() => {
        // This useEffect runs once on mount to kick off the initial auth check.
        if (!initialAuthCheckPerformed.current) {
            initialAuthCheckPerformed.current = true;
            const token = localStorage.getItem('_at');
            if (token) {
                dispatch(getLoggedInUserRedux());
            } else {
                dispatch(setLoggedInUserForRedux(null));
            }
        }
    }, [dispatch]);

    // Display a global loading component while the authentication status is being determined.
    if (authLoading) {
        return <LoadingComponent />;
    }

    // Application routes
    return (
        <>
            <Routes>
                {/* ==================== Public Routes ==================== */}
                <Route element={<Layout />}>
                    <Route index element={<Landingpage />} />
                    <Route path="/aboutus" element={<Aboutuspage />} />
                    <Route path="/ourteam" element={<Ourteamcomponent />} />
                    <Route path="/ourteam/:id" element={<UserOverview />} />
                    <Route path="/campaign" element={<CampaignPage />} />
                    <Route path="/campaign/:id" element={<CampaignOverview />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/activate/:token" element={<UserActivation />} />
                    <Route path="/chat/guest" element={<GuestChatPage />} />
                    <Route path="*" element={<Errorpage url="/" label="Go To Home" />} />
                </Route>

                {/* ==================== Signin Route ==================== */}
                <Route path="/signin" element={<Signin />} />

                {/* ==================== Protected Admin/Dashboard Routes ==================== */}
                <Route
                    path="/admin"
                    element={
                        <CheckPermission allowedBy={['admin', 'member']}>
                            <AdminLayout />
                        </CheckPermission>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="donations" element={<OverallDonationSummary />} />
                    <Route path="donation" element={<UserDonationDashboard />} />
                    <Route path="campaign" element={<Campaignlistingpage />} />
                    <Route path="campaign/create" element={<CampaignCreatePage />} />
                    <Route path="campaign/edit/:id" element={<CampaignEditPage />} />
                    <Route path="users" element={<UserListingPage />} />
                    <Route path="users/create" element={<UserCreatePage />} />
                    <Route path="users/edit/:id" element={<UserEditPage />} />
                    <Route path="chat" element={<ChatViewPage />} />
                    <Route path="*" element={<Errorpage url="/admin" label="Go To Dashboard" />} />
                </Route>
                <Route path="/dashboard/*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </>
    );
};

export default Routerconfig;

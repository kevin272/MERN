import React, { useEffect, useState } from 'react';
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
import AuthContext from '../context/auth.context';
import authSvc from '../pages/auth/auth.service';
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

export const Routerconfig = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getLoggedInUser = async () => {
        try {
            setLoading(true);
            const { data }: any = await authSvc.getRequest('/auth/me', { auth: true });
            setLoggedInUser(data);
        } catch (exception) {
            console.error('Error fetching user:', exception); // Changed to console.error for better visibility
            // You might want to clear the token if the /auth/me call fails due to invalid token
            localStorage.removeItem('_at');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('_at');
        if (token) {
            getLoggedInUser();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <>
            {loading ? (
                <LoadingComponent />
            ) : (
                <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
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

                        {/* ==================== Signin Route ==================== */}
                        <Route path="/signin" element={<Signin />} />

                        {/* ==================== Protected Admin/Dashboard Routes ==================== */}
                        {/* All admin and member functionalities are now consolidated under /admin */}
                        <Route
                            path="/admin"
                            element={
                                <CheckPermission
                                    allowedBy={['admin', 'member']}
                                    children={<AdminLayout />}
                                />
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
                </AuthContext.Provider>
            )}
        </>
    );
};

export default Routerconfig;

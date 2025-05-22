import { Route, Routes } from "react-router-dom";
import Layout from "../layout/layout";
import Landingpage from "../pages/landing";
import {Signin, ForgotPassword} from "../pages/signin/signin";
import Contact from "../pages/contactpage";
import Aboutuspage from "../pages/About Us";
import { CampaignCreatePage, Campaignlistingpage, CampaignEditPage } from "../pages/campaign/index";
import { useEffect, useState } from "react";
import AuthContext from "../context/auth.context";
import authSvc from "../pages/auth/auth.service";
import AdminLayout from "../layout/cms.page";
import { AdminDashboard } from "../pages/dashboard";
import CheckPermission from "./rbac.config";
import LoadingComponent from "../components/common/loading/loading.component";
import Errorpage from "../components/common/error/notfounderror";
import CampaignPage from "../pages/campaign/campaignpage";
import ResetPassword from "../pages/signin/reset-password.page";
import UserActivation from "../pages/auth/activate/activate.user.page";
import CampaignOverview from "../pages/campaign/campaign.overview.component";
import UserOverview from "../pages/Our Team/user.overview.component"; // Renamed from TeamOverview
import Ourteamcomponent from "../components/Our Team/ourteamcard"; // Assumed this now exports OurTeamComponent which uses UserSvc
import { UserCreatePage, UserListingPage, UserEditPage } from "../pages/Our Team/exporting"; // Updated imports for admin user management

export const Routerconfig = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLoggedInUser = async () => {
    try {
      setLoading(true)
      const {data}: any = await authSvc.getRequest('/auth/me', { auth: true });
      setLoggedInUser(data);
      
    } catch (exception) {
      console.log("Error fetching user:", exception);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("_at");
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
            {/* Public Routes */}
            <Route element={<Layout />}>
              <Route index element={<Landingpage />} />
              <Route path="/aboutus" element={<Aboutuspage />} />

              {/* Our Team (now displaying Users) */}
              <Route path="/ourteam" element={<Ourteamcomponent />} />
              <Route path="/ourteam/:id" element={<UserOverview />} /> {/* Uses UserOverview */}

              {/* Campaigns */}
              <Route path="/campaign" element={<CampaignPage />} />
              <Route path="/campaign/:id" element={<CampaignOverview/>} />

              <Route path="/contact" element={<Contact />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/activate/:token" element={<UserActivation/>} />
              <Route path="*" element={<Errorpage url="/" label="Go To Home" />} />
            </Route>
          
            {/* Signin Route - outside main layout if it's a full-page login */}
            <Route path="/signin" element={<Signin />} />

            {/* Admin Routes - Protected by CheckPermission */}
            <Route path="/admin" element={<CheckPermission allowedBy={['admin', 'member']} children={<AdminLayout />} />}>
              <Route index element={<AdminDashboard />} />
              <Route path="*" element={<Errorpage url="/admin" label="Go To Dashboard" />} />
              
              {/* Campaign Management */}
              <Route path="campaign" element={<Campaignlistingpage />} />
              <Route path="campaign/create" element={<CampaignCreatePage />} />
              <Route path="campaign/edit/:id" element={<CampaignEditPage />} />
              
              {/* User Management (formerly Team Members) */}
              <Route path="users" element={<UserListingPage/>} /> {/* Updated path and element */}
              <Route path="users/create" element={<UserCreatePage/>} /> {/* Updated path and element */}
              <Route path="users/edit/:id" element={<UserEditPage/>} /> {/* Updated path and element */}
            </Route>
          </Routes>
        </AuthContext.Provider>
      )}
    </>
  );
};

export default Routerconfig;
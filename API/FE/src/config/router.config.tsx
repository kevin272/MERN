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
import { PracticeCreatePage, PracticeEditPage, PracticeListingPage } from "../pages/Areasofpractice";
import UserActivation from "../pages/auth/activate/activate.user.page";
import CampaignOverview from "../pages/campaign/campaign.overview.component";
import AreasOfPracticeComponentforpage from "../pages/Areasofpractice/practice.page.component";
import PracticeOverview from "../pages/Areasofpractice/practice.overview";

export const Routerconfig = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLoggedInUser = async () => {
    try {
      setLoading(true)
      const {data}: any = await authSvc.getRequest('/auth/me', { auth: true });
      // console.log("User data fetched:", response);
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
  // console.log({loggedInUser})
  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Landingpage />} />
              <Route path="/aboutus" element={<Aboutuspage />} />

              <Route path="/areaofpractice" element={<AreasOfPracticeComponentforpage />} />
              <Route path="/areaofpractice/:id" element={< PracticeOverview/>} />

              <Route path="/campaign" element={<CampaignPage />} />
              <Route path="/campaign/:id" element={<CampaignOverview/>} />

              <Route path="/contact" element={<Contact />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/activate/:token" element={<UserActivation/>} />
              <Route path="*" element={<Errorpage url="/" label="Go To Home" />} />
            </Route>
          
            
            <Route path="/signin" element={<Signin />} />

            <Route path="/admin" element={<CheckPermission allowedBy={['admin', 'member']} children={<AdminLayout />} />}>

              <Route index element={<AdminDashboard />} />
              <Route path="*" element={<Errorpage url="/admin" label="Go To Dashboard" />} />
              <Route path="campaign" element={<Campaignlistingpage />} />
              <Route path="campaign/create" element={<CampaignCreatePage />} />
              <Route path="campaign/edit/:id" element={<CampaignEditPage />} />
              

              <Route path="areasofpractice" element={<PracticeListingPage />} />
              <Route path="areasofpractice/create" element={<PracticeCreatePage />} />
              <Route path="areasofpractice/edit/:id" element={<PracticeEditPage />} />

              
            </Route>
          </Routes>
        </AuthContext.Provider>
      )}
    </>
  );
};

export default Routerconfig;

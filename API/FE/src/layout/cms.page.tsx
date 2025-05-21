import { Outlet } from "react-router-dom";
import AdminHeader from "../components/common/header/header-admin.component";
import CMSSidebar from "../components/cmssidebar/cms.sidebar.component";
const AdminLayout = () => {
  return (
    <>
      <div className="antialiased bg-gray-50 dark:bg-gray-900">
        <AdminHeader/>

       <CMSSidebar/>

        <main className="p-4 md:ml-64 h-auto pt-20">
          <Outlet/>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;

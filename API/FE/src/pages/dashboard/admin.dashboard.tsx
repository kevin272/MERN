import CMSSidebar from "../../components/cmssidebar/cms.sidebar.component";
import AdminHeader from "../../components/common/header/header-admin.component";

const AdminDashboard = () => {
    return(
        <>
        <CMSSidebar/>
        <AdminHeader/>
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-red-800">WELCOME TO ADMIN PANEL</h1>
      </div>
    </div>
        </>
    )
}

export default AdminDashboard;

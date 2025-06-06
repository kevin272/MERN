import React from "react";
import CMSSidebar from "../../components/cmssidebar/cms.sidebar.component"; 
import AdminHeader from "../../components/common/header/header-admin.component";

const AdminDashboard = () => {
    return (
        <>
            <CMSSidebar />
            <AdminHeader />

            {/* Main content area for the dashboard */}
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-100 to-green-200 p-4 md:p-8">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-emerald-800 tracking-tight leading-tight">
                        Welcome to the Admin Panel
                    </h1>
            </div>
        </>
    );
};

export default AdminDashboard;

import { HiMenu, HiUser } from "react-icons/hi";
import logo from "../../../assets/logo.svg"; // Assuming logo is in the correct path
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../../context/auth.context";
import { toast } from "react-toastify";

const AdminHeader = () => {
  const loggedInUser = useContext(AuthContext);
  const { setLoggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("_at");
    localStorage.removeItem("_rt");
    setLoggedInUser(null);
    toast.success("You have been logged out.");
    navigate("/signin");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex justify-start items-center">
          <button
            data-drawer-target="drawer-navigation"
            data-drawer-toggle="drawer-navigation"
            aria-controls="drawer-navigation"
            className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <HiMenu />
            <span className="sr-only">Toggle sidebar</span>
          </button>

          {/* Logo added here */}
          <NavLink to="/">
            <img src={logo} className="mr-3 h-30 w-40" alt="Admin Logo" />
          </NavLink>
        </div>
        <div className="flex items-center lg:order-2">
          <button
            onClick={handleSignOut}
            className="flex items-center text-sm bg-red-800 text-white rounded-full p-2"
          >
            {loggedInUser && loggedInUser.image ? (
              <img className="w-8 h-8 rounded-full" src={loggedInUser.image} alt="user photo" />
            ) : (
              <HiUser className="w-8 h-8" />
            )}
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;

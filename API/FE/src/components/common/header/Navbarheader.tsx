import React from "react"; // No longer need useEffect for initial user fetch
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Navbar } from "flowbite-react"; // Assuming these are from flowbite-react
import Logo from "../../../assets/logo2.svg"; // Adjust path as necessary

// Import Redux hooks and types
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../config/store.config"; // Adjust path to your store types
import { logoutUser } from "../../reducer/user.reducer"; // Import the logoutUser action from your user slice

export const Homeheader = () => {
  // REMOVED: No longer using local state for loggedInUser or direct authSvc calls here.
  // const [loggedInUser, setLoggedInUser] = useState<any>(null);
  // const getLoggedInUser = async () => { ... };
  // useEffect(() => { ... }, []);

  // Access loggedInUser directly from the Redux store
  // Assuming your userReducer is mounted under the 'auth' key in your store.
  const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);
  const dispatch: AppDispatch = useDispatch(); // Initialize useDispatch
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch the Redux logout action
    navigate("/signin"); // Redirect to signin page after logout
  };

  return (
    <Navbar fluid className="bg-white shadow-md h-20 sm:h-24 px-4 sm:px-8">
      <Navbar.Brand href="/">
        <img src={Logo} className="h-12 sm:h-16" alt="LLS Logo" />
      </Navbar.Brand>

      <div className="flex items-center gap-4 md:order-2">
        {loggedInUser ? (
          <>
            <NavLink
              to={`/${loggedInUser.role}`}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm font-medium ${
                  isActive ? "text-green-600" : "text-blue-700"
                }`
              }
            >
              {loggedInUser.image && ( // FIX: Use loggedInUser.image for profile picture (as per User interface)
                <img
                  src={loggedInUser.image} // FIX: Use loggedInUser.image
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                  onError={(e) => { // Fallback for broken images
                    e.currentTarget.src = "https://placehold.co/100x100/CCCCCC/FFFFFF?text=User";
                    e.currentTarget.onerror = null; // Prevent infinite loop
                  }}
                />
              )}
              {loggedInUser.name}
            </NavLink>

            {loggedInUser.role === "admin" && (
              <Button
                onClick={() => navigate("/admin")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Admin Panel
              </Button>
            )}

            {/* Add a Logout Button */}
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            onClick={() => navigate("/signin")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Sign In
          </Button>
        )}

        <Navbar.Toggle className="text-blue-700 focus:outline-none" />
      </div>

      <Navbar.Collapse className="bg-white text-center mt-4 sm:mt-0">
        {[
          { path: "/", label: "HOME" },
          { path: "/aboutus", label: "ABOUT US" },
          { path: "/ourteam", label: "OUR TEAM" },
          { path: "/campaign", label: "CAMPAIGNS" },
          { path: "/contact", label: "CONTACT" },
        ].map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `block px-3 py-2 text-sm font-medium rounded-md ${
                isActive ? "text-green-600" : "text-blue-700"
              } hover:text-green-600 transition-colors`
            }
          >
            {label}
          </NavLink>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
};

import { Button, Navbar } from "flowbite-react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo.svg";
import { useState, useEffect } from "react";
import authSvc from "../../../pages/auth/auth.service";

export const Homeheader = () => {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const navigate = useNavigate();

  const getLoggedInUser = async () => {
    try {
      const response: any = await authSvc.getRequest("/auth/me", { auth: true });
      setLoggedInUser(response.data);
    } catch (exception) {
      console.log(exception);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("_at");
    if (token) {
      getLoggedInUser();
    }
  }, []);

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
              {loggedInUser.profilePic && (
                <img
                  src={loggedInUser.profilePic}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                />
              )}
              {loggedInUser.fullname}
            </NavLink>

            {loggedInUser.role === "admin" && (
              <Button
                onClick={() => navigate("/admin")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Admin Panel
              </Button>
            )}
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

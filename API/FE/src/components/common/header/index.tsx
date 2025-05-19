import { Button, Navbar, NavbarToggle, NavbarCollapse,   } from "flowbite-react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/logo.svg";
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
    const token = localStorage.getItem('_at');
    if (token) {
      getLoggedInUser();
    }
  }, []);

  return (
    <Navbar fluid className="bg-black h-20 sm:h-32 relative z-50">
      <a href="https://SajhaBiz.com.np" className="flex items-center">
        <img src={Logo} className="h-16 w-32 sm:h-28 sm:w-64" alt="LLS Logo" />
      </a>

      <div className="flex items-center gap-4 md:order-2">
        {loggedInUser ? (
          <>
            <NavLink
              to={`/${loggedInUser.role}`}
              className={({ isActive }) =>
                `flex items-center gap-2 text-[15px] ${isActive ? "text-red-800" : "text-white"}`
              }
            >
              {loggedInUser.profilePic && (
                <img
                  src={loggedInUser.profilePic}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              {loggedInUser.fullname}
            </NavLink>

            {loggedInUser.role === "admin" && (
              <Button
                onClick={() => navigate("/admin")}
                color="failure"
                className="w-[150px] h-[45px] bg-red-800"
                pill
              >
                Admin Panel
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={() => navigate("/signin")}
            color="failure"
            className="w-[150px] h-[45px] bg-red-800"
            pill
          >
            Sign In
          </Button>
        )}

        <NavbarToggle className="text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50" />
      </div>

      <NavbarCollapse className="decoration-white bg-black text-center z-50">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block text-[15px] p-2 ${isActive ? "text-red-800" : "text-white"}`
          }
        >
          HOME
        </NavLink>
        <NavLink
          to="/aboutus"
          className={({ isActive }) =>
            `block text-[15px] p-2 ${isActive ? "text-red-800" : "text-white"}`
          }
        >
          ABOUT US
        </NavLink>
        <NavLink
          to="/ourteam"
          className={({ isActive }) =>
            `block text-[15px] p-2 ${isActive ? "text-red-800" : "text-white"}`
          }
        >
          OUR TEAM
        </NavLink>
        <NavLink
          to="/areaofpractice"
          className={({ isActive }) =>
            `block text-[15px] p-2 ${isActive ? "text-red-800" : "text-white"}`
          }
        >
          AREAS OF PRACTICE
        </NavLink>
        <NavLink
          to="/blogs"
          className={({ isActive }) =>
            `block text-[15px] p-2 ${isActive ? "text-red-800" : "text-white"}`
          }
        >
          BLOGS
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `block text-[15px] p-2 ${isActive ? "text-red-800" : "text-white"}`
          }
        >
          CONTACT
        </NavLink>
      </NavbarCollapse>
    </Navbar>
  );
};
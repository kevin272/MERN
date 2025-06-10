import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Navbar } from "flowbite-react";
import Logo from "../../../assets/logo2.svg";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../config/store.config";
import { logoutUser } from "../../reducer/user.reducer";

export const Homeheader = () => {
  const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/signin");
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
              {loggedInUser.image && (
                <img
                  src={loggedInUser.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/100x100/CCCCCC/FFFFFF?text=User";
                    e.currentTarget.onerror = null;
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

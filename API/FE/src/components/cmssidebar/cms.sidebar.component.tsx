import React, { useState, useEffect } from "react";
import { HiDocumentAdd, HiHome, HiUserAdd, HiCurrencyDollar, HiChatAlt2  } from "react-icons/hi"; // Added HiCurrencyDollar for donations
import { NavLink } from "react-router-dom";

// Define the menu items, now including Donation History
const adminMenu = [
  { name: "Home", url: "/admin", icons: <HiHome className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" /> },
  { name: "Team Member Management", url: "/admin/users", icons: <HiUserAdd className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" /> },
  { name: "Campaign Management", url: "/admin/campaign", icons: <HiDocumentAdd className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" /> },
  { name: "Donation History", url: "/admin/donations", icons: <HiCurrencyDollar className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" /> },
  { name: "Chatlist", url: "/admin/chat", icons: <HiChatAlt2 className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" /> },
];

const CMSSidebar = () => {
  // State for sidebar open/close, default to open on larger screens
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  // Effect to handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Open sidebar on desktop
      } else {
        setIsOpen(false); // Close sidebar on mobile
      }
    };
    window.addEventListener("resize", handleResize); // Add resize listener
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button (only visible on small screens) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-emerald-600 text-white rounded-md md:hidden shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      {/* Sidebar navigation aside */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          bg-white border-r border-gray-200 
          md:translate-x-0 
          dark:bg-gray-800 dark:border-gray-700
          shadow-lg md:shadow-none`}
        aria-label="Sidenav"
      >
        <div className="overflow-y-auto py-5 px-3 h-full"> {/* Added overflow for scrollable content */}
          <ul className="space-y-2">
            {adminMenu.map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-medium rounded-lg transition duration-150 ease-in-out group
                    ${isActive
                      ? "bg-emerald-50 text-emerald-700 font-semibold" // Active state
                      : "text-gray-800 hover:bg-gray-50"} 
                    dark:text-white dark:hover:bg-gray-700`
                  }
                  onClick={() => { // Close sidebar on mobile after clicking a link
                    if (window.innerWidth < 768) {
                      setIsOpen(false);
                    }
                  }}
                >
                  {/* Render the icon component */}
                  {item.icons} 
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default CMSSidebar;

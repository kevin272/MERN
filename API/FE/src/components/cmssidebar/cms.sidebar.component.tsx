import  { useState, useEffect } from "react";
import { HiDocumentAdd, HiHome, HiScale, HiUserAdd } from "react-icons/hi";
import { NavLink } from "react-router-dom";

const adminMenu = [
  { name: "Home", url: "/admin", icons: <HiHome /> },
  { name: "Team Member Management", url: "/admin/teammembers", icons: <HiUserAdd /> },
  { name: "Blogs Management", url: "/admin/blogs", icons: <HiDocumentAdd /> },
  { name: "Areas of Practice", url: "/admin/areasofpractice", icons: <HiScale /> }
];

const CMSSidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white-800 text-white rounded-md md:hidden"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidenav"
        id="drawer-navigation"
      >
        <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
          {adminMenu.map((item, i) => (
            <li key={i}>
              <NavLink
                to={item.url}
                className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                {item.icons}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default CMSSidebar;

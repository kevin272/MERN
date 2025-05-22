import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const Heading1 = ({ children }: { children: ReactNode }) => {
  return (
    <h1 className="text-2xl font-semibold text-green-600 dark:text-green-500">
      {children}
    </h1>
  );
};

export const HeadingWithLink = ({
  title,
  link,
  btntxt,
}: {
  title: string;
  link: string;
  btntxt: string;
}) => {
  return (
    <div className="flex justify-between items-center mb-4 md:mb-6">
      <Heading1>{title}</Heading1>
      <NavLink
        to={link}
        className="inline-flex items-center justify-center py-2 px-4 rounded-md bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-600 dark:focus:ring-opacity-50 transition-colors duration-300"
      >
        <FaPlus className="me-2 h-4 w-4" />
        {btntxt}
      </NavLink>
    </div>
  );
};

export default Heading1;
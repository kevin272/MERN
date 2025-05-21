import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {FaPlus} from "react-icons/fa";
const Heading1 = ({ children }: { children: ReactNode }) => {
  
  return (
    <>
      <h1 className="text-bold text-red-800 text-center text-5xl ">
        {children}
      </h1>
      <br/>
      
    </>
  );
};

export const HeadingWithLink = ({title, link, btntxt}: {title: string, link:string, btntxt:string }) =>{
    return(<>
    <div className="flex justify-between">
      <Heading1>{title}</Heading1>
      <NavLink to={link} className={"bg-red-800 text-white p-3.5 rounded-lg flex justify-center text-center"}>
        <FaPlus className="me-3 h-5 pt-1"/>{btntxt}
      </NavLink>
    </div>
    </>)
} 

export default Heading1;

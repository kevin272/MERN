import Heading1 from "../common/title";
import { Button } from "flowbite-react";
import logo from "../../assets/public/logo.svg";
const Aboutus =() => {
    return(
      
        <>
        <br/>
        
        <Heading1>About Us</Heading1>
        <br/>
        <div className="flex items-center justify-between p-8 bg-gray-100">
            <div className="w-1/2">
                <img 
                    src={logo}
                    alt="About Us" 
                    className="w-3/4 h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                />
            </div>
            <div className="w-1/2 pl-8">
                <h2 className="text-[30px] font-bold mb-4 font-serif">A Tradition of Excellence: 40 Years of Legal Expertise in Nepal<br/></h2>
                <p className="text-lg text-gray-700 text-justify">
                Since 1984, Legacy Legal Services has been a distinguished provider of legal expertise in Nepal, offering more than 40 years of trusted counsel and advocacy. Our firm’s name, Legacy, signifies our enduring commitment to excellence and the aspiration to pass on a tradition of trust, integrity, and legal expertise to future generations.

We focus primarily on litigation, handling complex disputes across diverse sectors. Additionally, we provide representation in domestic and international arbitration, ensuring that our clients benefit from efficient dispute resolution, both locally and abroad.<br/> </p>
    <br/> 
    <div className="flex justify-end"> <Button href="/aboutus" style={{width:200, height:45}} className="bg-red-800 size-3/12 hover:bg-red-600 transition-transform duration-300 hover:scale-105">READ MORE ABOUT US</Button>
    </div>
               
                
            </div>
        </div>
        
       
        </>
    
    )
}
export default Aboutus;
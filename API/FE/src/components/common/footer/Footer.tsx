import { Footer } from "flowbite-react";
import {   BsFacebook,   BsTwitter } from "react-icons/bs";
import { GoLaw } from "react-icons/go";


const Footercomponent=()=>{
    return(
        <>
    <Footer container className="bg-black rounded-none text-white">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div> <a href="/">
            <img  className="w-64 h-32" src="https://legacylegal.com.np/wp-content/uploads/2024/10/Untitled.bmp" alt="logos"  /> </a></div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title className="text-white" title="Navigate" />
              <Footer.LinkGroup col>
                <Footer.Link className="text-white" href="/">Home</Footer.Link>
                <Footer.Link className="text-white" href="/ourteam">Our Team</Footer.Link>
                <Footer.Link className="text-white" href="/areaofpractice">Areas of Practice</Footer.Link>
                <Footer.Link className="text-white" href="/blogs">Blogs</Footer.Link>
                <Footer.Link className="text-white" href="/contact">Contact</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title className="text-white" title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Icon className="text-white" href="facebook.com" icon={BsFacebook}/>
                <Footer.Icon className="text-white" href="x.com" icon={BsTwitter}/>
              </Footer.LinkGroup>
            </div>
           <div >
           <Footer.Title className="text-white mx-7" title="Working Hours " />
             <div className="flex mx-20"><GoLaw/></div> <br/>
             Sunday-Friday: 9:30PM to 5PM
           </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between md:justify-center">
          <Footer.Copyright className="text-white" href="facebook.com/jenithacharya" by="Jenith Sharma Acharya" year={2024} />
          
        </div>
      </div>
    </Footer>
        </>
    )
}

export default Footercomponent;
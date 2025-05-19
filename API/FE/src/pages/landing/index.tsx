import Herosection from "../../components/herosection/herosection.tsx";
import Aboutus from "../../components/AboutUsCard";
import Areasofpracticecomponent from "../../components/practice/aop.tsx";
import TeamSection from "../Our Team/index.tsx";


const Landingpage=() => {

    return(
         <>
        
        <Herosection/> 
        <br/>    
        
        <Aboutus/>
        <br />
        <br/>
        <Areasofpracticecomponent/>
        <br/>
        <TeamSection/>
        <br/>   
        
        </>
    )
}

export default Landingpage;

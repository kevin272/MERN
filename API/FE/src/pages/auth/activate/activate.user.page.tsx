import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authSvc from "../auth.service";
import {toast} from "react-toastify"
import LoadingComponent from "../../../components/common/loading/loading.component";
import { Modal, Button, } from "flowbite-react";

const UserActivation = () => {
    const [openModal, setOpenModal] =useState(false);
    const params= useParams();
    const [loading, setLoading]= useState(true);
    let [msg, setMessage] =useState("")
    let navigate = useNavigate();
    let [counter, setCounter] = useState(10)


    const activateUser =async() => {
        try{
            await authSvc.getRequest('/auth/activate/'+params.token)
            setMessage("Your account has been successfully activated, Please Login to proceed further.")
            setInterval(()=>{
                setCounter(counter--)
                if(counter===0){
                    navigate('/login')
                }
            },1000)
        }catch(exception :any){
            if(+exception.status === 422 && exception.data.message === 'Token Expired'){
                setOpenModal(true)
            }
            toast.error(exception.data.message)
            navigate('/login')
        }finally {
            setLoading(false)
        }
    }

   
        const resendToken = async() =>{
            try{
                await authSvc.getRequest("resend-activationtoken/"+params.token)
                toast.success("A new token has been forward in your email. Please check your email")
                setLoading(false);
                setOpenModal(false);
            

        }catch(exception){
            toast.error("Error sending reset Token")
        }
    };

        useEffect(()=>{
            activateUser()
        }, [])

       
    
    return(<>
    <section className="bg-white">
        <div className="grid px-8 sm:px-12 lg:px-16 min-h-screen">
            {
                loading ? <div className="flex items-center justify-center">
                <LoadingComponent/></div> : <>
                <div className="flex justify-center pt-10 mt-10 text-xl text-red-900">
                    {msg}
                </div>
                </>
            }
        </div>
    </section>

    <Modal dismissible show={openModal} data-backdrop="static" data-keyboard="false" >
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
             It seems, the token has been expired. If you want to contunue, click the resend button below or cancel for new registration
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={resendToken}>I accept</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>)


}


export default UserActivation;
import Heading1 from "../../components/common/title";
import { toast } from "react-toastify";
import { useState } from "react";
import UserSvc from "./user.service";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../components/common/loading/loading.component";
import TeamFormComponent from "../../components/team/team-form.component"; // This component needs to be updated too

const UserCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitEvent = async (data: any) => {
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', data.fullname); 
      submitData.append('email', data.email);
      submitData.append('password', data.password);
      submitData.append('confirmPassword', data.confirmPassword);
      submitData.append('role', data.role.value); // Ensure role is a string
      submitData.append('title', data.title);
      submitData.append('expertise', data.expertise);
      submitData.append('bio', data.description); // Map 'description' from form to 'bio' for backend
      
      if (data.facebook) submitData.append('facebook', data.facebook);
      if (data.twitter) submitData.append('twitter', data.twitter);
      if (data.linkedin) submitData.append('linkedin', data.linkedin);
      
     
      if (data.phone) {
        submitData.append('phone', data.phone ? data.phone.toString() : '');

      }
      // Handle image file
      if (data.image) { 
          submitData.append('image', data.image);
      }

      console.log("Frontend (UserCreatePage): FormData contents before sending:");
      for (let pair of submitData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]); 
      }

      await UserSvc.createUser(submitData); // Using the specific createUser method
      toast.success("User (Team member) registered successfully");
      navigate("/admin/users"); 
    } catch (exception: any) {
      console.error("Error while adding user (team member):", exception);
      const errorMessage = exception.response?.data?.message || "Error while adding user (team member)";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <Heading1>Create New User (Team Member)</Heading1>
        <br />
        <hr />
      </div>

      <div>
        <div className="py-3 px-4 lg:py-14">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white"></h2>
          {loading ? (
            <LoadingComponent />
          ) : (

            <TeamFormComponent submitEvent={submitEvent} loading={loading} />
          )}
        </div>
      </div>
    </>
  );
};

export default UserCreatePage;
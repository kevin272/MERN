import Heading1 from "../../components/common/title";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserSvc from "./user.service";
import { useNavigate } from "react-router-dom";
import TeamFormComponent from "../../components/team/team-form.component";
import LoadingComponent from "../../components/common/loading/loading.component";

const UserEditPage = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [originalEmail, setOriginalEmail] = useState<string | null>(null); // State to store original email

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (!id) {
          toast.error("User ID is missing.");
          setLoading(false);
          return;
        }
        const response: any = await UserSvc.getUserById(id);
        console.log("UserEditPage: Fetched raw user data (response.result):", response.result); // Log raw fetched data
        
        if (response.result) {
          // Destructure properties we handle explicitly or exclude
          const { password, email, fullname, description, ...rest } = response.result; 
          setOriginalEmail(email); 

          const processedFormData = {
            ...rest, // Includes _id, activationToken, activatedFor, image, etc.
            name: fullname || rest.name || '', // Map fullname to name
            bio: description || rest.bio || '', // Map description to bio
            email: email, // Explicitly add email
            role: { label: response.result.role, value: response.result.role },
            phone: response.result.phone, 
            // Ensure image is explicitly handled if it wasn't consistently in 'rest'
            // If response.result.image exists, it will be in ...rest. No change needed here.
          };
          
          setFormData(processedFormData);
          console.log("UserEditPage: Prepared formData for TeamFormComponent:", processedFormData); // Log final formData
        } else {
          toast.error("User data not found.");
          navigate("/admin/users");
        }
      } catch (exception: any) {
        console.error("UserEditPage: Error fetching user data for edit:", exception);
        toast.error(exception.response?.data?.message || "Error fetching user data for edit.");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const submitEvent = async (data: any) => {
    setLoading(true);
    try {
      const { password, email, ...dataToSubmit } = data; 
      
      const submitData = {
        ...dataToSubmit,
        email: originalEmail, 
        role: data.role.value,
        phone: data.phone, 
      };
      
      await UserSvc.updateUser(id!, submitData);
      toast.success("User (Team member) updated successfully");
      navigate("/admin/users");
    } catch (exception: any) {
      console.error("UserEditPage: Error updating user:", exception);
      toast.error(exception.response?.data?.message || "Error updating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-6 sm:py-8 lg:py-12">
      <div className="max-w-screen-md px-4 md:px-8 mx-auto">
        <div className="mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl font-semibold text-center text-green-600 dark:text-green-500">
            Edit Member
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 md:text-lg">
            Modify user details here.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <LoadingComponent />
          </div>
        ) : (
          formData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* TeamFormComponent receives initialData. Ensure it uses name, bio, image from initialData */}
              <TeamFormComponent initialData={formData} submitEvent={submitEvent} loading={loading} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserEditPage;

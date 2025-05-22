// src/pages/Our Team/user.edit-page.tsx
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
        console.log("Fetched user data for edit:", response.result);
        if (response.result) {
          setFormData({
            ...response.result,
            role: { label: response.result.role, value: response.result.role },
            // Ensure phone is an array when setting form data for edit
            phone: response.result.phone,
          });
        } else {
          toast.error("User data not found.");
          navigate("/admin/users");
        }
      } catch (exception: any) {
        console.error("Error fetching user data for edit:", exception);
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
      const submitData = {
        ...data,
        role: data.role.value,
        phone: [data.phone], // Ensure phone is sent as an array
      };
      await UserSvc.updateUser(id!, submitData);
      toast.success("User (Team member) updated successfully");
      navigate("/admin/users");
    } catch (exception: any) {
      console.error("Error while updating user (team member):", exception);
      toast.error(exception.response?.data?.message || "Error while updating user (team member)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <Heading1>Edit User (Team Member)</Heading1>
        <br />
        <hr />
      </div>

      <div>
        <div className="py-3 px-4 lg:py-14">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white"></h2>
          {loading ? (
            <LoadingComponent />
          ) : (
            formData && <TeamFormComponent initialData={formData} submitEvent={submitEvent} loading={loading} />
          )}
        </div>
      </div>
    </>
  );
};

export default UserEditPage;
import Heading1 from "../../components/common/title";
import { toast } from "react-toastify";
import { useState } from "react";
import TeamSvc from "./team.service";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../components/common/loading/loading.component"; // Ensure this is the correct import for your loading component.
import TeamFormComponent from "../../components/team/team-form.component";

const TeamCreatePage = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitEvent = async (data: any) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        role: data.role.value,
      };
      await TeamSvc.postRequest("/member/", submitData, { auth: true, file: true });
      toast.success("Team member registered successfully");
      navigate("/admin/teammembers/");
    } catch (exception) {
      console.error(exception);
      toast.error("Error while adding team member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <Heading1>Create Team Member</Heading1>
        <br />
        <hr />
      </div>

      <div>
        <div className="py-3 px-4 lg:py-14">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white"></h2>
          {loading ? (
            <>
              <LoadingComponent />
            </>
          ) : (
            <TeamFormComponent submitEvent={submitEvent} loading={loading} />
          )}
        </div>
      </div>
    </>
  );
};

export default TeamCreatePage;

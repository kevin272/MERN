import Heading1 from "../../components/common/title";
import { toast } from "react-toastify";
import { useState } from "react";
import { useParams } from "react-router-dom";
import TeamSvc from "./team.service";
import { useNavigate } from "react-router-dom";
import TeamFormComponent from "../../components/team/team-form.component";

const TeamEditPage = () => {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const submitEvent = async (data: any) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        role: data.role.value, // Ensure role is properly formatted
      };
      await TeamSvc.patchRequest("/member/"+params.id, submitData, { auth: true, file: true });
      toast.success("Team member updated successfully");
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
        <Heading1>Edit Team Member</Heading1>
        <br />
        <hr />
      </div>

      <div>
        <div className="py-3 px-4 lg:py-14">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white"></h2>
          <TeamFormComponent submitEvent={submitEvent} loading={loading} />
        </div>
      </div>
    </>
  );
};

export default TeamEditPage;

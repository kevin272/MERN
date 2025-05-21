import Heading1 from "../../components/common/title";
import { toast } from "react-toastify";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PracticeSvc from "./practice.service"; 
import { useNavigate } from "react-router-dom";
import PracticeFormComponent from "../../components/practice/practice.form.component";

const PracticeEditPage = () => {
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const navigate = useNavigate();

  const submitEvent = async (data: any) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        status: data.status.value 
      };
      await PracticeSvc.patchRequest("/practice/"+params.id, submitData, { auth: true, file: true });
      toast.success("Practice created successfully");
      navigate("/admin/areasofpractice/");
    } catch (exception) {
      console.error(exception);
      toast.error("Error while creating practice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <Heading1>Edit Areas of Practice</Heading1>
        <br />
        <hr />
      </div>

      <div>
        <div className="py-3 px-4 lg:py-14">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white"></h2>
          <PracticeFormComponent submitEvent={submitEvent} loading={loading} />
        </div>
      </div>
    </>
  );
};

export default PracticeEditPage;

import Heading1 from "../../components/common/title";
import { toast } from "react-toastify";
import { useState } from "react";
import BlogsSvc from "./blogs.service";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../components/common/loading/loading.component"; 
import BlogsformComponent from "../../components/blogs/blogs.form.component"; 
const BlogsCreatePage = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitEvent = async (data: any) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        status: data.status.value,
      };
      await BlogsSvc.postRequest("/blogs/", submitData, { auth: true, file: true });
      toast.success("Blog created successfully");
      navigate("/admin/blogs/");
    } catch (exception) {
      console.error(exception);
      toast.error("Error while creating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <Heading1>Create Blogs</Heading1>
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
            <BlogsformComponent submitEvent={submitEvent} loading={loading} />
          )}
        </div>
      </div>
    </>
  );
};

export default BlogsCreatePage;

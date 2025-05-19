import Heading1 from "../../components/common/title";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import BlogsSvc from "./blogs.service";
import { useNavigate, useParams } from "react-router-dom";
import BlogsformComponent from "../../components/blogs/blogs.form.component";
import LoadingComponent from "../../components/common/loading/loading.component";

const BlogsEditPage = () => {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [blogs, setblogs] = useState<any>();
  const navigate = useNavigate();

  const getDetail = async () => {
    try {
      const detail: any = await BlogsSvc.getRequest("/blogs/"+params.id, {
        auth: true
      });
      
      console.log(detail)
      
      setblogs(detail.data);
      setLoading(false);

    }catch(exception) {
      toast.error("error while fetching data");
      navigate("/admin/blogs")
    }
  };

  useEffect(() => {
    getDetail();
  }, [params]);

  const submitEvent = async (data: any) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        status: data.status.value,
      };

      // console.log("submitData", submitData)
      //
      await BlogsSvc.patchRequest("/blogs/"+params.id, submitData, {
        auth: true,
        file: true,
      });
      toast.success("blogs updated sucessfully");
      navigate("/admin/blogs/");
    } catch (exception) {
      console.error(exception);
      toast.error("Error while updating blog");
    } finally {
      setLoading(false);
    }
  };

  // console.log(blogs)
  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <Heading1>Edit Blogs</Heading1>
        <br />
        <hr />
      </div>

      <div>
        <div className="py-3 px-4 lg:py-14">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white"></h2>
          {loading ? (
            <>
              {" "}
              <LoadingComponent />
            </>
          ) : (
            <>
              {" "}
              <BlogsformComponent detail = {{
                        Authorname:blogs?.Authorname,
                        date: blogs?.date, 
                        title: blogs?.title,
                        link: blogs?.link,
                        status: {
                            label: blogs?.status === "active" ? "Publish" : "Unpublish" ,
                            value: blogs?.status
                        },
                        image: blogs?.image,
                        description: blogs?.description,

              }} submitEvent={submitEvent} loading={loading} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogsEditPage;

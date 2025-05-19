import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BlogsSvc from "./blogs.service";
import LoadingComponent from "../../components/common/loading/loading.component";

const BlogOverview = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);

  const GetBlog = async () => {
    try {
      const response: any = await BlogsSvc.getRequest(`/blogs/${id}`);
      setBlog(response.data);
      console.log(response.data);
    } catch (exception) {
      console.log(exception);
    }
  };

  useEffect(() => {
    GetBlog();
  }, [id]);

  return (
    <>
      {blog ? (
        <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
          <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
              <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                <img
                  className="w-full dark:hidden rounded-lg shadow-lg"
                  src={blog.image}
                  alt="Blog Image"
                />
              </div>

              <div className="mt-6 sm:mt-8 lg:mt-0">
                <h1 className="text-3xl font-semibold text-red-800 sm:text-4xl dark:text-white">
                  {blog.title}
                </h1>
                <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                  <p className="text-lg text-black dark:text-gray-400">
                    Published on {blog.date} <br />
                  </p>
                </div>

                <hr className="my-6 md:my-8 border-red-800 dark:border-gray-800" />

                {/* Preserve description formatting */}
                <p
                  className="mb-6 text-black dark:text-gray-400"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {blog.description}
                </p>

                <p className="mb-6 text-red-800 dark:text-gray-400 text-right">
                  Written by - {blog.Authorname}
                  <br />
                  Legacy Legal Services
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default BlogOverview;

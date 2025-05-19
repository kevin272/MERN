import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import BlogsSvc from "../../pages/blogs/blogs.service";
import { HiPencil } from "react-icons/hi";
import LoadingComponent from "../common/loading/loading.component";

export const BlogsComponentforPage = () => {
  const [blogs, setblogs] = useState<any | null>();
  const Getallblogs = async () => {
    try {
      const response: any = await BlogsSvc.getRequest("/blogs/list-home");
      setblogs(response.data);

    } catch (exception) {
      console.log(exception);
    }
  };

  useEffect(() => {
    Getallblogs();
  }, []);

  return (
    <>
      <section className="bg-white dark:bg-gray-900 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="text-center lg:mb-16 mb-8">
        <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-red-800 dark:text-white">
          Our Blog
        </h2>
        <p className="font-light text-red-800 sm:text-xl dark:text-gray-400">
          Our firm employs a proactive approach to evaluate legal strategies, allowing us to address client needs efficiently and effectively while adapting to evolving circumstances.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
      {blogs && Array.isArray(blogs) ? (
  blogs
    .filter(blog => blog.status === "active" || blog.status === "Publish")
    .map(blog => (
      <article
        key={blog._id}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 shadow-md dark:border-gray-700 overflow-hidden"
      >
        <a href={`/blogs/${blog._id}`}>  
        <img
          className="w-full h-56 object-cover"
          src={blog.image}
          alt={blog.title}
        />
        </a>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-red-800 dark:text-white">
            <NavLink to={`/blogs/${blog._id}`}>{blog.title}</NavLink>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {blog.description.length > 150
              ? blog.description.substring(0, 150) + "..."
              : blog.description}
          </p>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <HiPencil />

              <span className="text-sm font-semibold text-gray-800 dark:text-white hover:text-red-700 dark:hover:text-red-500 transition-colors duration-200">
                {blog.Authorname}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <NavLink
              to={`/blogs/${blog._id}`}
              className="inline-flex items-center text-red-800 dark:text-primary-500 font-medium hover:underline"
            >
              Read more
              <svg
                className="ml-2 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </NavLink>
          </div>
        </div>
      </article>
    ))
) : (
  <LoadingComponent/>
)}

      </div>
    </section>
    </>
  );
};

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TeamSvc from "./team.service";
import LoadingComponent from "../../components/common/loading/loading.component";

const TeamOverview = () => {
  const { id } = useParams();
  const [team, setTeam] = useState<any>(null);

  const GetBlog = async () => {
    try {
      const response: any = await TeamSvc.getRequest(`/member/${id}`);
      setTeam(response.data);
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
      {team ? (
        <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
          <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
              <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                <img
                  className="w-full dark:hidden rounded-lg shadow-lg"
                  src={team.image}
                  alt="Blog Image"
                />
              </div>

              <div className="mt-6 sm:mt-8 lg:mt-0">
                <h1 className="text-3xl font-semibold text-red-800 sm:text-4xl dark:text-white">
                  {team.fullname}
                </h1>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  {team.expertise}
                </p>
                <div className="mt-4 sm:items-center sm:gap-4 sm:flex"></div>

                <hr className="my-6 md:my-8 border-red-800 dark:border-gray-800" />

                {/* Preserve spaces, tabs, and line breaks */}
                <p
                  className="mb-6 text-black dark:text-gray-400"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {team.description}
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

export default TeamOverview;

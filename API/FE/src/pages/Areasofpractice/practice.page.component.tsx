import { useEffect, useState } from "react";
import LoadingComponent from "../../components/common/loading/loading.component";
import PracticeSvc from "../../pages/Areasofpractice/practice.service";
import Breadcrumbnavigation from "../../components/common/breadcrumb navigation/breadcrumb component";

export const AreasOfPracticeComponentforpage = () => {
  const [practice, setPractice] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllAreas = async () => {
    try {
      const response: any = await PracticeSvc.getRequest("/practice/list-home");

      setPractice(response.data );
    } catch (exception) {
      console.error("Error fetching practice areas:", exception);
      setPractice([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAreas();
  }, []);

  return (
    <>
    <Breadcrumbnavigation>Areas of Practice</Breadcrumbnavigation>

    <section className="bg-white dark:bg-gray-900 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <h1 className="text-4xl font-bold text-center text-red-800 mb-8">
          Areas Of Practice
          </h1>
      <div className="text-center lg:mb-16 mb-8">
      <p className="text-center text-red-800 mt-2">
             We offer expertise across a wide range of legal practice areas to help
          you navigate complex legal challenges confidently.
        </p>
      </div>

      {loading ? (
        <LoadingComponent />
      ) : practice && practice.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          {practice
            .filter(area => !area.status || area.status === "active" || area.status === "Publish")
            .map(area => (
              <article
                key={area._id}
                className="relative group rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105"
              >
                <a href={`/areaofpractice/${area._id}`}> 
                  <img
                    className="w-full h-40 object-cover"
                    src={area.image}
                    alt={area.title}
                  />
                  <div className="absolute inset-0 bg-red-800 opacity-0 group-hover:opacity-75 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white text-lg font-bold">{area.title}</p>
                  </div>
                </a>
              </article>
            ))}
        </div>
      ) : (
        <div className="text-center text-red-800">No practice areas found.</div>
      )}

      </section>
    </>);
};

export default AreasOfPracticeComponentforpage;

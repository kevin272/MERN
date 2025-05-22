import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import UserSvc from "./user.service"; // Updated import
import LoadingComponent from "../../components/common/loading/loading.component";

const UserOverview = () => { // Renamed component
  const { id } = useParams();
  const [user, setUser] = useState<any>(null); // Renamed state to 'user'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => { // Renamed function
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          setError("User ID is missing.");
          setLoading(false);
          return;
        }
        // *** Updated API call to /user/:id ***
        const response: any = await UserSvc.getUserById(id); 
        console.log("Fetched user data for overview:", response.result);
        setUser(response.result); // Assuming response.result contains the user object
      } catch (exception: any) {
        console.error("Error fetching user details:", exception);
        setError(exception.message || "Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]); // Depend on 'id'

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
        <p>Could not load user details. Please try again.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 p-8">
        User not found.
      </div>
    );
  }

  return (
    <>
      <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              <img
                className="w-full dark:hidden rounded-lg shadow-lg"
                src={user.image} // Assuming 'image' holds the user's profile picture URL
                alt={user.name} // Assuming 'name' is the user's full name
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x300/cccccc/000000?text=No+Image"; // Fallback
                }}
              />
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-3xl font-semibold text-red-800 sm:text-4xl dark:text-white">
                {user.name} {/* Display user's name */}
              </h1>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                {user.role} {/* Display user's role */}
              </p>
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex"></div>

              <hr className="my-6 md:my-8 border-red-800 dark:border-gray-800" />

              <p
                className="mb-6 text-black dark:text-gray-400"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {user.bio || user.description} {/* Assuming 'bio' or 'description' for user details */}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserOverview;
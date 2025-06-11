import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import UserSvc from "./user.service";
import LoadingComponent from "../../components/common/loading/loading.component";

interface User {
  _id: string;
  name: string;
  title?: string;
  expertise?: string;
  bio?: string;
  image?: string;
}

const UserOverview = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const IMAGE_SIZE = 200;

  useEffect(() => {
    if (!id) {
      setError("User ID is missing.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching user with ID:", id);
        const response: any = await UserSvc.getUserById(id);
        console.log("Response from getUserById:", response.result);
        setUser(response.result);
      } catch (exception: any) {
        console.error("Error fetching user details:", exception);
        setError(exception.message || "Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4 max-w-md mx-auto mt-10 bg-red-100 rounded-md shadow-md">
        <p className="font-semibold">Error: {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 p-6 max-w-md mx-auto mt-10 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md">
        User details not found.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="w-full max-w-xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="flex justify-center pt-8">
            <div
              style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
              className="rounded-full overflow-hidden border-4 border-green-600 dark:border-green-400"
            >
              <img
                src={user.image || ""}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/${IMAGE_SIZE}x${IMAGE_SIZE}/cccccc/000000?text=No+Image`;
                }}
              />
            </div>
          </div>

          <div className="mt-6 px-6 pb-10 text-center">
            <h1 className="text-3xl font-semibold text-green-800 dark:text-green-400 sm:text-4xl">
              {user.name}
            </h1>

            {(user.title || user.expertise) && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {[user.title, user.expertise].filter(Boolean).join(" | ")}
              </p>
            )}

            <hr className="my-8 border-green-800 dark:border-gray-700" />

            {user.bio ? (
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {user.bio}
              </p>
            ) : (
              <p className="text-gray-400 italic">No biography available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;

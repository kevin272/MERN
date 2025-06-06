import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import UserSvc from "./user.service";
import LoadingComponent from "../../components/common/loading/loading.component";

const UserOverview = () => {
    const { id } = useParams();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fixedWidth = 200;
    const fixedHeight = 200;

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!id) {
                    setError("User ID is missing.");
                    setLoading(false);
                    return;
                }
                console.log("Fetching user with ID:", id); // Log the ID
                const response: any = await UserSvc.getUserById(id);
                console.log("Response from getUserById:", response.result); // Log the response
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
            <div className="text-center text-green-600 p-4">
                <p>Error: {error}</p>
                <p>Could not load user details. Please try again.</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center text-gray-600 dark:text-gray-400 p-4">
                User details not found.
            </div>
        );
    }

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
            <div className="w-full md:w-4/5 lg:w-3/5 xl:w-1/2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="shrink-0 max-w-md lg:max-w-lg mx-auto flex justify-center">
                        <div style={{ width: fixedWidth, height: fixedHeight, overflow: 'hidden', borderRadius: '50%' }}>
                            <img
                                className="w-full h-full object-cover"
                                src={user.image}
                                alt={user.name}
                                onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://placehold.co/${fixedWidth}x${fixedHeight}/cccccc/000000?text=No+Image`;
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8 lg:mt-0 text-center">
                        <h1 className="text-3xl font-semibold text-green-800 sm:text-4xl dark:text-white">
                            {user.name}
                        </h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            {user.title} | {user.expertise}
                        </p>
                        <div className="mt-4 sm:items-center sm:gap-4 sm:flex justify-center"></div>

                        <hr className="my-6 md:my-8 border-green-800 dark:border-gray-800" />

                        <p
                            className="mb-6 text-black dark:text-gray-400"
                            style={{ whiteSpace: "pre-wrap" }}
                        >
                            {user.bio}
                        </p>

                        <div className="flex justify-center gap-2">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserOverview;
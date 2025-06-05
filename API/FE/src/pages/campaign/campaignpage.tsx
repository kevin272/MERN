import React, { useEffect, useState } from "react";
import Breadcrumbnavigation from "../../components/common/breadcrumb navigation/breadcrumb component";
import CampaignSvc from "./campaigns.service"; 
import LoadingComponent from "../../components/common/loading/loading.component"; 
import { Link } from "react-router-dom"; 
import { toast } from "react-toastify";

const CampaignPage = () => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPublicCampaigns = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch, for example, 6 active campaigns for the public view
                const response: any = await CampaignSvc.getActiveCampaignsForPublicHome(6); 
                console.log("Public Campaign List API Response (from campaignpage.tsx):", response);

                setCampaigns(response.result || []); 
            } catch (err: any) {
                console.error("Error fetching public campaigns (from campaignpage.tsx):", err);
                setError(err.message || "Failed to load campaigns.");
                toast.error("Failed to load campaigns for public view.");
            } finally {
                setLoading(false);
            }
        };

        fetchPublicCampaigns();
    }, []); // Empty dependency array means this runs once on component mount

    if (loading) {
        return <LoadingComponent />;
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                <p>Error: {error}</p>
                <p>Please try again later.</p>
            </div>
        );
    }

    return (
        <>
            <Breadcrumbnavigation>Campaigns</Breadcrumbnavigation>
            
            {/* Main Content Area */}
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Page Title */}
                    <h1 className="text-4xl font-bold text-center text-emerald-800 dark:text-emerald-300 mb-10">
                        Explore Our Campaigns
                    </h1>
                    
                    {/* Campaigns Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {campaigns.length > 0 ? (
                            campaigns.map((campaign) => (
                                <div
                                    key={campaign._id} 
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
                                               transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                                               border border-emerald-100 dark:border-gray-700"
                                >
                                    {/* Campaign Image */}
                                    <img
                                        className="w-full h-48 object-cover object-center rounded-t-xl"
                                        src={campaign.image}
                                        alt={campaign.title}
                                        onError={(e: any) => {
                                            e.target.onerror = null; 
                                            e.target.src = "https://placehold.co/400x300/e0e0e0/555555?text=No+Image"; // Fallback image
                                        }}
                                    />
                                    {/* Campaign Details */}
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-2 line-clamp-2">
                                            {campaign.title}
                                        </h2>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                            {campaign.description}
                                        </p>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                Goal: <span className="text-emerald-700 dark:text-emerald-400">${campaign.goalAmount.toLocaleString()}</span>
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                Raised: <span className="text-emerald-700 dark:text-emerald-400">${campaign.raisedAmount.toLocaleString()}</span>
                                            </span>
                                        </div>
                                        {/* Learn More Button */}
                                        <Link
                                            to={`/campaign/${campaign._id}`}
                                            className="inline-block w-full text-center bg-emerald-700 text-white px-4 py-2 rounded-lg 
                                                       hover:bg-emerald-800 transition duration-300 transform hover:scale-103
                                                       font-semibold shadow-md"
                                        >
                                            Learn More
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // No Campaigns Found Message
                            <div className="col-span-full text-center text-gray-600 dark:text-gray-400 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                                <p className="text-lg font-medium">No active campaigns found at the moment.</p>
                                <p className="text-sm mt-2">Check back soon for new opportunities!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CampaignPage;
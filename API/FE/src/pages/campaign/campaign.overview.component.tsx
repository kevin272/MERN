import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CampaignSvc from "./campaigns.service"; // Ensure this path is correct
import LoadingComponent from "../../components/common/loading/loading.component";

const CampaignOverview = () => {
  const { id } = useParams(); // Get the campaign ID from the URL
  const [campaign, setCampaign] = useState<any>(null); // Renamed to 'campaign' for consistency
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true); // Set loading to true when fetching starts
      setError(null); // Clear any previous errors
      try {
        if (!id) { // Handle case where ID might be missing from URL
          setError("Campaign ID is missing.");
          setLoading(false);
          return;
        }

        console.log("Fetching single campaign with ID:", id); // Log the ID being fetched
        
        // *** CRITICAL FIX HERE: Use the specific service method `getCampaign` ***
        // This method is defined in your campaigns.service.ts as:
        // async getCampaign(id: string) { return await this.getRequest(`/campaign/${id}`, { auth: true }); }
        const response: any = await CampaignSvc.getCampaign(id); 
        
        console.log("Single Campaign API Response:", response); // Log the full response

        // *** CRITICAL FIX HERE: Access response.result for the campaign data ***
        setCampaign(response.result); 
        console.log("Campaign state updated to:", response.result);

      } catch (exception: any) {
        console.error("Error fetching single campaign:", exception); // Log the actual error
        setError(exception.message || "Failed to load campaign details.");
        // Optionally, redirect to a 404 page or campaign list if campaign not found
      } finally {
        setLoading(false); // Set loading to false when fetching completes
        console.log("Loading state set to false for CampaignOverview.");
      }
    };

    fetchCampaign();
  }, [id]); // Dependency array: Re-run effect if 'id' changes

  if (loading) {
    return <LoadingComponent />; // Show loading spinner while fetching
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
        <p>Could not load campaign details. Please try again.</p>
      </div>
    );
  }

  // If no campaign data is found after loading, display a message
  if (!campaign) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 p-8">
        Campaign not found.
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
                src={campaign.image} // Use 'campaign' state
                alt={campaign.title} // Use campaign.title for alt text
                onError={(e: any) => {
                  e.target.onerror = null; // Prevent infinite loop on error
                  e.target.src = "https://placehold.co/400x300/cccccc/000000?text=No+Image"; // Fallback image
                }}
              />
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-3xl font-semibold text-red-800 sm:text-4xl dark:text-white">
                {campaign.title}
              </h1>
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-lg text-black dark:text-gray-400">
                  Published on {new Date(campaign.createdAt).toLocaleDateString()} <br /> {/* Use createdAt for date */}
                </p>
              </div>

              <hr className="my-6 md:my-8 border-red-800 dark:border-gray-800" />

              {/* Preserve description formatting */}
              <p
                className="mb-6 text-black dark:text-gray-400"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {campaign.description}
              </p>

              <p className="mb-6 text-red-800 dark:text-gray-400 text-right">
                Created by - {campaign.createdBy?.name || "N/A"} {/* Access createdBy.name */}
                <br />
                SajhaBiz
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CampaignOverview;
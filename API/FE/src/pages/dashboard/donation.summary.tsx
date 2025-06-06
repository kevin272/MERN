import React, { useState, useEffect, useContext } from 'react';
import CampaignSvc from '../../pages/campaign/campaigns.service'; // Adjust path as needed
import AuthContext from '../../context/auth.context';
import LoadingComponent from '../../components/common/loading/loading.component';

// Define the expected structure for our summary data
interface DonationSummary {
    totalCampaigns: number;
    totalDonationsAmount: number;
    totalUniqueDonors: number;
    topCampaigns?: Array<{
        campaignId: string;
        campaignTitle: string;
        donatedAmount: number;
    }>;
}

const OverallDonationSummary = () => {
    const [summary, setSummary] = useState<DonationSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { loggedInUser } = useContext(AuthContext); 

    useEffect(() => {
        const fetchData = async () => {
            if (!loggedInUser || loggedInUser.role !== 'admin') {
                setError("Access Denied: Only administrators can view this page.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response: any = await CampaignSvc.getCampaigns({ limit: 1000 });

                let totalAmount = 0;
                const uniqueDonors = new Set<string>();
                const campaignSums: { [key: string]: { title: string; amount: number } } = {};

                if (response?.result && Array.isArray(response.result)) {
                    response.result.forEach((campaign: any) => {
                        // Initialize campaign sum for accurate aggregation
                        if (!campaignSums[campaign._id]) {
                            campaignSums[campaign._id] = { title: campaign.title, amount: 0 };
                        }

                        // Sum donations and track unique donors for each campaign
                        if (campaign.donors && Array.isArray(campaign.donors)) {
                            campaign.donors.forEach((donor: any) => {
                                totalAmount += donor.amount;
                                uniqueDonors.add(String(donor.userId._id)); // Add donor ID to Set for uniqueness
                                campaignSums[campaign._id].amount += donor.amount; // Sum donations per campaign
                            });
                        }
                    });
                }

                // Convert campaign sums to an array and sort for top campaigns
                const finalTopCampaigns = Object.keys(campaignSums)
                    .map(key => ({
                        campaignId: key, 
                        campaignTitle: campaignSums[key].title,
                        donatedAmount: campaignSums[key].amount
                    }))
                    .sort((a, b) => b.donatedAmount - a.donatedAmount)
                    .slice(0, 5); // Get top 5 campaigns

                // Set the aggregated summary data
                setSummary({
                    totalCampaigns: response?.result?.length || 0,
                    totalDonationsAmount: totalAmount,
                    totalUniqueDonors: uniqueDonors.size,
                    topCampaigns: finalTopCampaigns
                });

            } catch (err: any) {
                // Simple error message for the user
                setError("Failed to load donation summary. Please try again.");
                console.error("Error fetching data:", err); // Log full error for debugging
            } finally {
                setLoading(false);
            }
        };

        // Only start fetching data if loggedInUser is available (meaning auth check is likely done)
        if (loggedInUser) {
            fetchData();
        }

    }, [loggedInUser]); 

    // Simple loading indicator
    if (loading) {
        return <LoadingComponent />;
    }

    // Simple error display
    if (error) {
        return <div className="text-red-500 p-4 bg-red-100 rounded-md border border-red-200">{error}</div>;
    }

    // Display if no summary data is available
    if (!summary) {
        return <div className="text-gray-600 p-4">No donation data available.</div>;
    }

    // Simple JSX for the main content
    return (
        <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4 text-center">Donation Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-emerald-100 p-4 rounded-md text-center shadow-sm">
                    <h3 className="text-md font-semibold text-emerald-700">Total Campaigns</h3>
                    <p className="text-3xl font-bold text-emerald-900 mt-1">{summary.totalCampaigns}</p>
                </div>
                <div className="bg-emerald-100 p-4 rounded-md text-center shadow-sm">
                    <h3 className="text-md font-semibold text-emerald-700">Total Donations</h3>
                    <p className="text-3xl font-bold text-emerald-900 mt-1">${summary.totalDonationsAmount.toFixed(2)}</p>
                </div>
                <div className="bg-emerald-100 p-4 rounded-md text-center shadow-sm">
                    <h3 className="text-md font-semibold text-emerald-700">Unique Donors</h3>
                    <p className="text-3xl font-bold text-emerald-900 mt-1">{summary.totalUniqueDonors}</p>
                </div>
            </div>

            {/* Top Campaigns List */}
            {summary.topCampaigns && summary.topCampaigns.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Top Campaigns</h3>
                    <ul className="space-y-2">
                        {summary.topCampaigns.map((campaign) => (
                            <li key={campaign.campaignId} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
                                <span className="text-gray-700 font-medium">{campaign.campaignTitle}</span>
                                <span className="text-emerald-700 font-bold">${campaign.donatedAmount.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default OverallDonationSummary;

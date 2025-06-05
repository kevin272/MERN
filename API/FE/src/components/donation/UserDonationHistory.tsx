import React, { useState, useEffect, useContext } from 'react';
import CampaignSvc from '../../pages/campaign/campaigns.service'; // Adjust path as needed
import AuthContext from '../../context/auth.context'; // Import AuthContext directly
import LoadingComponent from '../../components/common/loading/loading.component'; // Assuming you have this

// Define an interface for the expected donation data structure
interface Donation {
    campaignId: string;
    campaignTitle: string;
    amount: number;
    donationDate?: string; // Optional, depending on your backend transformation
}

const UserDonationHistory = () => {
    const [donations, setDonations] = useState<Donation[]>([]); // Use the defined interface
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // CORRECTED: Destructure loggedInUser from AuthContext
    const { loggedInUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchDonationHistory = async () => {
            // Use loggedInUser.id for the check and API call
            if (!loggedInUser?.id) {
                setError("User not authenticated or user ID is missing. Please log in.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Pass loggedInUser.id to the service
                const response = await CampaignSvc.getUserDonationHistory(loggedInUser.id);
                // Ensure response structure matches what CampaignSvc returns (e.g., response.result, assuming result is the array of donations)
                // Assuming CampaignSvc.getUserDonationHistory now returns a flattened array of { campaignId, campaignTitle, amount, donationDate }
                setDonations(response?.data || []); // Access the 'result' property from the backend response
            } catch (err: any) {
                console.error("Failed to fetch donation history:", err);
                setError(err.message || "Failed to fetch donation history.");
            } finally {
                setLoading(false);
            }
        };

        // Trigger fetch only if loggedInUser is available
        // This ensures the effect doesn't run with an undefined user on initial render
        if (loggedInUser) {
            fetchDonationHistory();
        }
    }, [loggedInUser]); // Depend on loggedInUser to re-run when it changes

    if (loading) {
        return <LoadingComponent />;
    }

    if (error) {
        return <div className="text-red-500 p-4 bg-red-100 rounded-md border border-red-200">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Donation History</h2>
            {donations.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Campaign Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount Donated
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Donation Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {donations.map((donation) => (
                                <tr key={donation.campaignId}> {/* Use campaignId as key if available and unique */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {donation.campaignTitle}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        ${donation.amount ? donation.amount.toFixed(2) : '0.00'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {donation.donationDate ? new Date(donation.donationDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-600 p-4 bg-gray-50 rounded-md">You haven't donated to any campaigns yet.</p>
            )}
        </div>
    );
};

export default UserDonationHistory;

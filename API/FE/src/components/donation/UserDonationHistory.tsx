import React, { useState, useEffect, useContext } from 'react';
import CampaignSvc from '../../pages/campaign/campaigns.service'; // Adjust path as needed
import AuthContext from '../../context/auth.context';
import LoadingComponent from '../../components/common/loading/loading.component'; // Assuming you have this

const UserDonationHistory = () => {
    const [donations, setDonations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchDonationHistory = async () => {
            if (!user?.id) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await CampaignSvc.getUserDonationHistory(user.id);
                setDonations(response?.data || []);
            } catch (err: any) {
                setError(err.message || "Failed to fetch donation history.");
            } finally {
                setLoading(false);
            }
        };

        fetchDonationHistory();
    }, [user?.id]);

    if (loading) {
        return <LoadingComponent />;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Donation History</h2>
            {donations.length > 0 ? (
                <ul className="space-y-4">
                    {donations.map(campaign => {
                        const donation = campaign.donors.find((d: any) => String(d.userId._id) === user?.id);
                        return (
                            <li key={campaign._id} className="bg-gray-100 dark:bg-gray-700 rounded-md p-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300">{campaign.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Amount Donated: ${donation?.amount?.toLocaleString()}
                                </p>
                                {/* You can add more details about the campaign if needed */}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-600 dark:text-gray-400">You haven't donated to any campaigns yet.</p>
            )}
        </div>
    );
};

export default UserDonationHistory;
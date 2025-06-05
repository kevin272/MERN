import React, { useState, useEffect, useContext } from 'react';
import CampaignSvc from '../campaign/campaigns.service';
import  useAuth  from '../../context/auth.context';
import LoadingComponent from '../../components/common/loading/loading.component';

const UserDonationDashboard = () => {
    const [donations, setDonations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } =  useContext(useAuth); 

    useEffect(() => {
        const fetchDonationHistory = async () => {
            if (!user?.id) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await CampaignSvc.getUserDonationHistory(user.id);
                setDonations(response?.data || []);
            } catch (err: any) {
                setError(err.message || "Failed to fetch donation history");
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
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div>
            <h2>My Donation History</h2>
            {donations.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Campaign Title</th>
                            <th>Amount Donated</th>
                            {/* Add other relevant columns */}
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map(donation => (
                            <tr key={donation._id}>
                                <td>{donation.title}</td>
                                <td>{donation.donors.find((d: any) => String(d.userId._id) === String(user?.id))?.amount}</td>
                                {/* Display other donation details */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>You haven't donated to any campaigns yet.</p>
            )}
        </div>
    );
};

export default UserDonationDashboard;
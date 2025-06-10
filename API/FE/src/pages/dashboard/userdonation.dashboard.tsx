import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDonations } from '../../components/reducer/donation.reducer';
import { RootState, AppDispatch } from '../../config/store.config';
//import AuthContext from '../../context/auth.context';
import LoadingComponent from '../../components/common/loading/loading.component';

const UserDonationDashboard = () => {
    const dispatch: AppDispatch = useDispatch();
    const { donations, loading, error } = useSelector((state: RootState) => state.donations);
//    const { loggedInUser } = useContext(AuthContext);
const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

console.log("🧠 loggedInUser in Donation Dashboard:", loggedInUser);

    useEffect(() => {
    if (loggedInUser?._id) {
        console.log("✅ Dispatching fetchUserDonations with ID:", loggedInUser._id);
        dispatch(fetchUserDonations(loggedInUser._id));
    }
}, [dispatch, loggedInUser?._id]);


    if (loading) return <LoadingComponent />;
    if (error) return <div className="text-red-500 p-4 bg-red-100 rounded-md">{error}</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Donation History</h2>
            {donations.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Donated</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donation Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {donations.map((donation) => (
                                <tr key={donation.campaignId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.campaignTitle}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${donation.amount.toFixed(2)}</td>
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

export default UserDonationDashboard;

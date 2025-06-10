import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDonationSummary } from '../../components/reducer/donationsummary.reducer';
import { RootState, AppDispatch } from '../../config/store.config';
import LoadingComponent from '../../components/common/loading/loading.component';

const OverallDonationSummary = () => {
  const dispatch: AppDispatch = useDispatch();
  const { summary, loading, error } = useSelector((state: RootState) => state.donationSummary);
  const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

  useEffect(() => {
    if (loggedInUser?.role === 'admin') {
      dispatch(fetchDonationSummary());
    }
  }, [loggedInUser, dispatch]);

  if (!loggedInUser) return null;
  if (loggedInUser.role !== 'admin') {
    return <div className="text-red-500 p-4 bg-red-100 rounded-md border border-red-200">Access Denied: Admins only.</div>;
  }
  if (loading) return <LoadingComponent />;
  if (error) return <div className="text-red-500 p-4 bg-red-100 rounded-md border border-red-200">{error}</div>;
  if (!summary) return <div className="text-gray-600 p-4">No donation data available.</div>;

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

      {summary.topCampaigns.map((campaign: {
  campaignId: string;
  campaignTitle: string;
  donatedAmount: number;
}) => (
  <li key={campaign.campaignId} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
    <span className="text-gray-700 font-medium">{campaign.campaignTitle}</span>
    <span className="text-emerald-700 font-bold">${campaign.donatedAmount.toFixed(2)}</span>
  </li>
))}

    </div>
  );
};

export default OverallDonationSummary;

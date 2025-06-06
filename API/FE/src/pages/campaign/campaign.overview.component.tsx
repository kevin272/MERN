import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CampaignSvc from "./campaigns.service";
import LoadingComponent from "../../components/common/loading/loading.component";
import { toast } from 'react-toastify';

const CampaignOverview = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDonateInput, setShowDonateInput] = useState(false);
    const [donationAmount, setDonationAmount] = useState<number | undefined>();
    const fixedWidth = 300;
    const fixedHeight = 200;

    useEffect(() => {
        const fetchCampaign = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!id) {
                    setError("Campaign ID is missing.");
                    setLoading(false);
                    return;
                }
                const response: any = await CampaignSvc.getCampaign(id);
                setCampaign(response.result);
            } catch (exception: any) {
                setError(exception.message || "Failed to load campaign details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [id]);

    const handleDonateClick = () => {
        setShowDonateInput(true);
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setDonationAmount(isNaN(value) ? undefined : value);
    };

    const handleConfirmDonation = async () => {
        if (!id) {
            toast.error('Campaign ID missing.');
            return;
        }
        if (donationAmount === undefined || donationAmount <= 0) {
            toast.error('Enter a valid donation amount.');
            return;
        }

        try {
            const userId = '6526ba6b6b597b0a8876c669'; // Replace with actual user ID
            const response: any = await CampaignSvc.donateToCampaign(id, userId, donationAmount);
            if (response) {
                toast.success('Thank you for your donation!');
                setCampaign({ ...campaign, raisedAmount: response.result.raisedAmount });
                setShowDonateInput(false);
                setDonationAmount(undefined);
            } else {
                toast.error('Donation failed.');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Donation failed.');
        }
    };

    if (loading) {
        return <LoadingComponent />;
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                Error: {error}
                <p className="mt-1 text-sm">Could not load campaign. Please try again.</p>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="text-center text-gray-500 p-4">
                Campaign details not found.
            </div>
        );
    }

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-full md:w-4/5 lg:w-3/5 xl:w-1/2">
                <div className="flex justify-center">
                    <div style={{ width: fixedWidth, height: fixedHeight, overflow: 'hidden', borderRadius: '0.375rem' }}>
                        <img
                            className="w-full h-full object-cover rounded-t-lg"
                            src={campaign.image}
                            alt={campaign.title}
                            onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = `https://placehold.co/${fixedWidth}x${fixedHeight}/cccccc/888888?text=No+Image`;
                            }}
                        />
                    </div>
                </div>

                <div className="p-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                        {campaign.title}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Published: {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4" style={{ whiteSpace: "pre-wrap" }}>
                        {campaign.description}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Created by: <span className="font-semibold">{campaign.createdBy?.name || "N/A"}</span>
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                                Goal: ${campaign.goalAmount?.toLocaleString()}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                Raised: ${campaign.raisedAmount?.toLocaleString()}
                            </p>
                        </div>
                        {!showDonateInput ? (
                            <button
                                onClick={handleDonateClick}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            >
                                Donate
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-green-500 focus:border-green-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    onChange={handleAmountChange}
                                />
                                <button
                                    onClick={handleConfirmDonation}
                                    className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => setShowDonateInput(false)}
                                    className="px-3 py-2 text-gray-500 hover:text-gray-700 rounded-md text-sm font-medium focus:outline-none"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignOverview;
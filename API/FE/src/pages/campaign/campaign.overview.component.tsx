import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import CampaignSvc from "./campaigns.service";
import LoadingComponent from "../../components/common/loading/loading.component";
import { toast } from "react-toastify";

interface Campaign {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  goalAmount: number;
  raisedAmount: number;
  createdBy?: { name: string };
}

const CampaignOverview = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDonateInput, setShowDonateInput] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number | "">("");

  const IMAGE_WIDTH = 320;
  const IMAGE_HEIGHT = 220;

  useEffect(() => {
    if (!id) {
      setError("Campaign ID is missing.");
      setLoading(false);
      return;
    }

    const fetchCampaign = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: any = await CampaignSvc.getCampaign(id);
        setCampaign(response.result);
      } catch (err: any) {
        setError(err.message || "Failed to load campaign details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleDonateClick = useCallback(() => {
    setShowDonateInput(true);
  }, []);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setDonationAmount("");
      return;
    }
    const parsed = parseInt(val, 10);
    setDonationAmount(isNaN(parsed) ? "" : parsed);
  }, []);

  const handleConfirmDonation = useCallback(async () => {
    if (!id) {
      toast.error("Campaign ID missing.");
      return;
    }
    if (typeof donationAmount !== "number" || donationAmount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    try {
      const userId = "6526ba6b6b597b0a8876c669"; // Replace with actual user ID from auth context
      const response: any = await CampaignSvc.donateToCampaign(id, userId, donationAmount);
      if (response?.result) {
        toast.success("Thank you for your donation!");
        setCampaign((prev) =>
          prev ? { ...prev, raisedAmount: response.result.raisedAmount } : prev
        );
        setShowDonateInput(false);
        setDonationAmount("");
      } else {
        toast.error("Donation failed.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Donation failed.");
    }
  }, [donationAmount, id]);

  if (loading) return <LoadingComponent />;

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center text-red-600 bg-red-100 p-6 rounded-md mt-10 shadow-md">
        <p className="font-semibold mb-2">Error: {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-md mx-auto text-center text-gray-600 bg-gray-100 p-6 rounded-md mt-10 shadow-md">
        <p className="font-medium">Campaign details not found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden max-w-3xl w-full">
        {/* Image */}
        <div
          style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
          className="mx-auto rounded-t-xl overflow-hidden"
        >
          <img
            src={campaign.image}
            alt={campaign.title}
            className="object-cover w-full h-full"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/${IMAGE_WIDTH}x${IMAGE_HEIGHT}/d1fae5/065f46?text=No+Image`;
            }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <h1 className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-400 mb-3">
            {campaign.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Published on:{" "}
            <time dateTime={campaign.createdAt}>
              {new Date(campaign.createdAt).toLocaleDateString()}
            </time>
          </p>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-8">
            {campaign.description}
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Created by:{" "}
                <span className="font-semibold">{campaign.createdBy?.name || "N/A"}</span>
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-semibold">
                Goal: ${campaign.goalAmount.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                Raised: ${campaign.raisedAmount.toLocaleString()}
              </p>
            </div>

            {!showDonateInput ? (
              <button
                onClick={handleDonateClick}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 shadow-lg text-white font-semibold transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500"
              >
                Donate Now
              </button>
            ) : (
              <div className="flex items-center gap-3 w-full max-w-xs mx-auto sm:mx-0">
                <input
                  type="number"
                  placeholder="Amount"
                  min={1}
                  step={1}
                  value={donationAmount === "" ? "" : donationAmount}
                  onChange={handleAmountChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  onClick={handleConfirmDonation}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-semibold transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowDonateInput(false)}
                  className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors focus:outline-none"
                  aria-label="Cancel donation"
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

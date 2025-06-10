import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CampaignSvc from '../../pages/campaign/campaigns.service';


export const fetchDonationSummary = createAsyncThunk(
  'donationSummary/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CampaignSvc.getCampaigns({ limit: 1000 });
      if (!response?.result || !Array.isArray(response.result)) {
        throw new Error('Invalid data format from API');
      }

      let totalAmount = 0;
      const uniqueDonors = new Set<string>();
      const campaignSums: { [key: string]: { title: string; amount: number } } = {};

      response.result.forEach((campaign: any) => {
        if (!campaignSums[campaign._id]) {
          campaignSums[campaign._id] = { title: campaign.title, amount: 0 };
        }

        campaign.donors?.forEach((donor: any) => {
          totalAmount += donor.amount ?? 0;
          uniqueDonors.add(String(donor.userId?._id ?? donor.userId ?? 'unknown'));
          campaignSums[campaign._id].amount += donor.amount ?? 0;
        });
      });

      const finalTopCampaigns = Object.entries(campaignSums)
        .map(([id, data]) => ({
          campaignId: id,
          campaignTitle: data.title,
          donatedAmount: data.amount,
        }))
        .sort((a, b) => b.donatedAmount - a.donatedAmount)
        .slice(0, 5);

      return {
        totalCampaigns: response.result.length,
        totalDonationsAmount: totalAmount,
        totalUniqueDonors: uniqueDonors.size,
        topCampaigns: finalTopCampaigns,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load donation summary');
    }
  }
);



interface TopCampaign {
  campaignId: string;
  campaignTitle: string;
  donatedAmount: number;
}

interface DonationSummary {
  totalCampaigns: number;
  totalDonationsAmount: number;
  totalUniqueDonors: number;
  topCampaigns: TopCampaign[];
}

interface DonationSummaryState {
  summary: DonationSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: DonationSummaryState = {
  summary: null,
  loading: false,
  error: null,
};

const donationSummarySlice = createSlice({
  name: 'donationSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonationSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonationSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
        state.loading = false;
      })
      .addCase(fetchDonationSummary.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default donationSummarySlice.reducer;

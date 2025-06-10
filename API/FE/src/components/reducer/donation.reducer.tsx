import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CampaignSvc from "../../pages/campaign/campaigns.service";

export const fetchUserDonations = createAsyncThunk(
  "donations/fetchUserDonations",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await CampaignSvc.getUserDonationHistory(userId);
      console.log("🎯 API Response in Thunk:", response);
      return response;
    } catch (err: any) {
      console.error("❌ Donation fetch error:", err);
      return rejectWithValue(err?.message || "Failed to fetch donation history.");
    }
  }
);


interface Donation {
  campaignId: string;
  campaignTitle: string;
  amount: number;
  donationDate?: string;
}

interface DonationsState {
  donations: Donation[];
  loading: boolean;
  error: string | null;
}

const initialState: DonationsState = {
  donations: [],
  loading: false,
  error: null,
};

const donationsSlice = createSlice({
  name: "donations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload;
      })
      .addCase(fetchUserDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default donationsSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authSvc from "../../pages/auth/auth.service"; // Adjust path if necessary

// Define a basic interface for a User (ensure it matches your backend response for /auth/me)
interface User {
  _id: string;
  name: string;
  email: string;
  role: string; // e.g., 'admin', 'member', 'user'
  status?: string; // Re-added status as it's often part of user detail
  image?: string | null;
  phone?: string | null;
  title?: string;
  expertise?: string;
  bio?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
}

// Define the state structure for our user slice (now only focused on loggedInUser)
interface UserState {
  loggedInUser: User | null; // The currently logged-in user's details
  authLoading: boolean;      // Specific loading flag for getLoggedInUserRedux
  authError: string | null;  // Specific error for getLoggedInUserRedux
}

// Initial state for the user slice
const initialState: UserState = {
  loggedInUser: null,
  authLoading: true, // Set to true initially if you plan to check token on app load
  authError: null,
};

// Async Thunk to fetch the currently logged-in user's details
export const getLoggedInUserRedux = createAsyncThunk(
  "User/getLoggedInUserRedux", // This name is used in the extraReducers
  async (_, { rejectWithValue }) => {
    try {
      console.log("User Reducer: getLoggedInUserRedux thunk started.");
      const response: any = await authSvc.getRequest("/auth/me", { auth: true });
      // IMPORTANT: Based on your auth.controller.js, /auth/me returns user details in 'result' property directly
      // as `res.json({ result: req.authUser, ... })`.
      // So, you should use `response.result` here.
      console.log("User Reducer: getLoggedInUserRedux API response received:", response);
      return response?.userDetail; 
    } catch (exception: any) {
      console.error("User Reducer: getLoggedInUserRedux API call failed:", exception);
      // Return rejectWithValue to properly handle errors in extraReducers
      return rejectWithValue(exception.response?.data?.message || exception.message || 'Failed to get logged in user');
    }
  }
);

// Create the user slice
const userSlice = createSlice({
  name: 'User', // Retain 'User' as the name for consistency with store.config.tsx mapping
  initialState,
  reducers: {
    // Reducer to manually set the logged-in user state (e.g., after login via auth slice or initial token check)
    setLoggedInUserForRedux: (state, action: PayloadAction<User | null>) => {
      state.loggedInUser = action.payload;
      state.authLoading = false; // Manually setting user implies auth loading is complete
      state.authError = null;
      console.log("User Reducer: setLoggedInUserForRedux called. authLoading set to FALSE. User:", action.payload);
    },
    // Reducer for logout, clears loggedInUser and related states/tokens
    logoutUser: (state) => {
      state.loggedInUser = null;
      state.authLoading = false; // Auth check done, user is explicitly logged out
      state.authError = null;
      localStorage.removeItem('_at'); // Clear tokens from local storage
      localStorage.removeItem('_rt');
      console.log("User Reducer: logoutUser called. authLoading set to FALSE.");
    },
    // Reducer to clear authentication-specific errors
    clearAuthError: (state) => {
      state.authError = null;
      console.log("User Reducer: clearAuthError called.");
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle getLoggedInUserRedux lifecycle (pending, fulfilled, rejected)
      .addCase(getLoggedInUserRedux.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
        console.log("User Reducer: getLoggedInUserRedux.pending. authLoading set to TRUE.");
      })
      .addCase(getLoggedInUserRedux.fulfilled, (state, action) => {
        state.authLoading = false;
        state.loggedInUser = action.payload;
        state.authError = null;
        console.log("User Reducer: getLoggedInUserRedux.fulfilled. authLoading set to FALSE. User:", action.payload);
      })
      .addCase(getLoggedInUserRedux.rejected, (state, action) => {
        state.authLoading = false;
        state.loggedInUser = null; // Clear loggedInUser on rejection
        state.authError = action.payload as string;
        console.log("User Reducer: getLoggedInUserRedux.rejected. authLoading set to FALSE. Error:", action.payload);
        // Also clear tokens from local storage if the backend rejects them (e.g., expired/invalid token)
        localStorage.removeItem('_at');
        localStorage.removeItem('_rt');
      });
  },
});

export const { setLoggedInUserForRedux, logoutUser, clearAuthError } = userSlice.actions;
export default userSlice.reducer;

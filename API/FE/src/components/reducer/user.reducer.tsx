import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authSvc from "../../pages/auth/auth.service";

// User interface
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  image?: string | null;
  phone?: string | null;
  title?: string;
  expertise?: string;
  bio?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
}

// User slice state
interface UserState {
  loggedInUser: User | null;
  authLoading: boolean;
  authError: string | null;
}

const initialState: UserState = {
  loggedInUser: null,
  authLoading: true,
  authError: null,
};

// Async thunk to fetch logged-in user details
export const getLoggedInUserRedux = createAsyncThunk(
  "User/getLoggedInUserRedux",
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await authSvc.getRequest("/auth/me", { auth: true });
      const userData = response?.data;
      if (!userData) {
        return rejectWithValue('User data not found in response');
      }
      return userData;
    } catch (exception: any) {
      return rejectWithValue(exception.response?.data?.message || exception.message || 'Failed to get logged in user');
    }
  }
);

// User slice with reducers and extraReducers
const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setLoggedInUserForRedux: (state, action: PayloadAction<User | null>) => {
      state.loggedInUser = action.payload;
      state.authLoading = false;
      state.authError = null;
      console.log("REDUX: setLoggedInUserForRedux called. authLoading set to FALSE. User:", action.payload);
    },
    logoutUser: (state) => {
      state.loggedInUser = null;
      state.authLoading = false;
      state.authError = null;
      localStorage.removeItem('_at');
      localStorage.removeItem('_rt');
      console.log("REDUX: logoutUser called. authLoading set to FALSE.");
    },
    clearAuthError: (state) => {
      state.authError = null;
      console.log("REDUX: clearAuthError called.");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLoggedInUserRedux.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
        console.log("REDUX: getLoggedInUserRedux.pending. authLoading set to TRUE.");
      })
      .addCase(getLoggedInUserRedux.fulfilled, (state, action) => {
        state.authLoading = false;
        state.loggedInUser = action.payload;
        state.authError = null;
        console.log("REDUX: getLoggedInUserRedux.fulfilled. authLoading set to FALSE. User:", action.payload);
      })
      .addCase(getLoggedInUserRedux.rejected, (state, action) => {
        state.authLoading = false;
        state.loggedInUser = null;
        state.authError = action.payload as string;
        console.error("REDUX: getLoggedInUserRedux.rejected. authLoading set to FALSE. Error:", action.payload);
        localStorage.removeItem('_at');
        localStorage.removeItem('_rt');
      });
  },
});

export const { setLoggedInUserForRedux, logoutUser, clearAuthError } = userSlice.actions;
export default userSlice.reducer;

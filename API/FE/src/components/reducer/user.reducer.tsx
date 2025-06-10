import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authSvc from "../../pages/auth/auth.service";

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

export const getLoggedInUserRedux = createAsyncThunk(
  "User/getLoggedInUserRedux",
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await authSvc.getRequest("/auth/me", { auth: true });
      return response?.userDetail;
    } catch (exception: any) {
      return rejectWithValue(exception.response?.data?.message || exception.message || 'Failed to get logged in user');
    }
  }
);

const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setLoggedInUserForRedux: (state, action: PayloadAction<User | null>) => {
      state.loggedInUser = action.payload;
      state.authLoading = false;
      state.authError = null;
    },
    logoutUser: (state) => {
      state.loggedInUser = null;
      state.authLoading = false;
      state.authError = null;
      localStorage.removeItem('_at');
      localStorage.removeItem('_rt');
    },
    clearAuthError: (state) => {
      state.authError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLoggedInUserRedux.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(getLoggedInUserRedux.fulfilled, (state, action) => {
        state.authLoading = false;
        state.loggedInUser = action.payload;
        state.authError = null;
      })
      .addCase(getLoggedInUserRedux.rejected, (state, action) => {
        state.authLoading = false;
        state.loggedInUser = null;
        state.authError = action.payload as string;
        localStorage.removeItem('_at');
        localStorage.removeItem('_rt');
      });
  },
});

export const { setLoggedInUserForRedux, logoutUser, clearAuthError } = userSlice.actions;
export default userSlice.reducer;

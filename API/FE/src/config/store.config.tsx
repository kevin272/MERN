import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../components/reducer/user.reducer';
import donationsslice from '../components/reducer/donation.reducer';
import donationSummarySlice from '../components/reducer/donationsummary.reducer';

const store = configureStore(
    {
        reducer: {
            auth: userReducer, // reducer to manage user state
            donations: donationsslice, // reducer to manage donation history
            donationSummary: donationSummarySlice, // reducer to manage donation summary

        },
    }
);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

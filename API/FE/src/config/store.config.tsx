import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../components/reducer/user.reducer';

const store = configureStore(
    {
        reducer: {
            auth: userReducer, // reducer to manage user state
        },
    }
);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

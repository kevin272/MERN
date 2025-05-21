import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    timeoutErrorMessage: 'Request Timeout',
    maxRate: 5,
});

// Interceptors for handling responses
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    (error: AxiosError) => {
        if (error.response) {
            // Server responded with a status other than 2xx
            throw error.response;
        } else if (error.request) {
            // Request was made but no response received
            throw new Error("Network error: No response received from server");
        } else {
            // Something happened in setting up the request
            throw new Error(`Error: ${error.message}`);
        }
    }
);

export { axiosInstance };

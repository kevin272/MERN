import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routerconfig } from "./config/router.config";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import store from "./config/store.config";
import { Provider } from "react-redux";

// Import necessary React Query components
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a QueryClient instance
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Wrap the Routerconfig with QueryClientProvider to pass the queryClient */}
      <QueryClientProvider client={queryClient}>
        < Provider store={store}>
        <Routerconfig />
        </Provider>
        {/* ToastContainer for notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);

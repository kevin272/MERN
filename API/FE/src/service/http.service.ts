import { axiosInstance } from "../config/axois.config";
import { SearchParams } from "../config/constants";

interface HeaderConfigProps {
  auth?: boolean;
  file?: boolean;
  params?: SearchParams;
}

interface ErrorResponse {
  message: string;
  status: number;
}

class HttpService {
  private headers = {};
  private params = {};

  // Set headers based on the configuration passed
  #setHeaders = (config: HeaderConfigProps) => {
    
    if (!config?.file) {
      this.headers = { 'Content-Type': 'application/json' };
    } else {
      this.headers =  { 'Content-Type': 'multipart/form-data' };
    }
  
    if (config?.auth) {
      const accessToken = localStorage.getItem("_at");
      if (accessToken) {
        this.headers = { ...this.headers, Authorization: `Bearer ${accessToken}` };
      } else {
        throw new Error("Authorization token missing");
      }
    }
  
    if (config?.params) {
      this.params = { ...config.params };
    }
  };
  

  // POST request method
  postRequest = async (url: string, data: any = {}, config: HeaderConfigProps = {}) => {
    try {
      this.#setHeaders(config);
      const response = await axiosInstance.post(url, data, {
        headers: { ...this.headers },
        params: { ...this.params }
      });
      return response.data;
    } catch (error: any) {
      this.#handleError(error);
    }
  };

  // GET request method
  getRequest = async (url: string, config: HeaderConfigProps = {}) => {
    try {
      this.#setHeaders(config);
      const response = await axiosInstance.get(url, {
        headers: { ...this.headers },
        params: { ...this.params },
      });
      // console.log(response)
      return response;      // {data:any, message: "", meta: any}
      // return response.data;
    } catch (error: any) {
      this.#handleError(error);
    }
  };

  // DELETE request method
  deleteRequest = async (url: string, config: HeaderConfigProps = {}) => {
    try {
      this.#setHeaders(config);
      const response = await axiosInstance.delete(url, {
        headers: { ...this.headers },
        params: { ...this.params },
      });
      return response.data;
    } catch (error: any) {
      this.#handleError(error);
    }
  };

  // PUT request method
  putRequest = async (url: string, data: any = {}, config: HeaderConfigProps = {}) => {
    try {
      this.#setHeaders(config);
      const response = await axiosInstance.put(url, data, {
        headers: { ...this.headers },
      });
      return response.data;
    } catch (error: any) {
      this.#handleError(error);
    }
  };

  // PATCH request method
  patchRequest = async (url: string, data: any = {}, config: HeaderConfigProps = {}) => {
    try {
      this.#setHeaders(config);
      const response = await axiosInstance.patch(url, data, {
        headers: { ...this.headers },
      });
      return response.data;
    } catch (error: any) {
      this.#handleError(error);
    }
  };

  // Forgot Password Request
  forgotPasswordRequest = async ({ email, fullname }: { email: string; fullname: string }) => {
    try {
        this.#setHeaders({});
        const response = await axiosInstance.post("/auth/forgot-password", { email, fullname }, {
            headers: { ...this.headers },
        });
        return response.data;
    } catch (error: any) {
        this.#handleError(error);
    }
};

  // Reset Password Request
  resetPasswordRequest = async (data: { forgetToken?: string; newPassword: string; confirmPassword: string }) => {
    try {
      this.#setHeaders({});
      const response = await axiosInstance.post("/auth/reset-password", data, {
        headers: { ...this.headers },
      });
      return response.data;
    } catch (error: any) {
      this.#handleError(error);
    }
  };

  // Centralized error handler
  #handleError = (error: any) => {
    if (error.response) {
      const errorResponse: ErrorResponse = {
        message: error.response.data.message || "An error occurred",
        status: error.response.status,
      };
      console.error("Error Response:", errorResponse);
      throw errorResponse;
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error( "Network error: No response received from the server");
    } else {
      console.error("Error Setting Up Request:", error.message);
      throw new Error(`Error: ${error.message}`);
    }
  };
}

export default HttpService;

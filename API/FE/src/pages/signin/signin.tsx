import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authSvc from "../auth/auth.service";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth.context";
import { NavLink } from "react-router-dom";
import { axiosInstance } from "../../config/axois.config";

export const Signin = () => {
    const { loggedInUser, setLoggedInUser } = useContext(AuthContext);
    const LoginDTO = Yup.object({
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(LoginDTO)
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (loggedInUser) {
            toast.info("You are already logged in as " + loggedInUser.fullName);
            // Navigate to /admin for simplicity, as per RouterConfig consolidation
            navigate('/admin');
        }
    }, [loggedInUser, navigate]);

    const login = async (data: any) => {
        try {
            setLoading(true);

            console.log("Frontend: Sending login request with data:", data);
            // The axiosInstance.post returns the 'data' property of the response by default in your HttpService if used.
            // If you are using axiosInstance directly, the response object contains 'data'.
            // Given your log, 'response' itself already contains the payload.
            const response: any = await axiosInstance.post("/auth/signin", data);

            // --- CRUCIAL LOGGING ---
            console.log("Frontend: Full Axios Response Object from direct call:", response);
            console.log("Frontend: Accessing response.token:", response.token); // Should now work
            console.log("Frontend: Accessing response.refreshToken:", response.refreshToken); // Should now work
            console.log("Frontend: Accessing response.userDetail:", response.userDetail); // Should work
            // --- END CRUCIAL LOGGING ---

            // FIX: Access tokens and userDetail directly from the 'response' object as per your latest console log
            localStorage.setItem("_at", response.token);
            localStorage.setItem("_rt", response.refreshToken);

            if (response.userDetail) { // Check if userDetail exists
                toast.success(`Welcome to ${response.userDetail.role} ${response.userDetail.name}`);
                setLoggedInUser(response.userDetail); // Update AuthContext state
                navigate("/admin"); // Navigate to admin dashboard
            } else {
                console.error("Frontend: userDetail missing in login response.");
                toast.error("Login successful, but user data is incomplete. Please try again.");
            }
        } catch (exception: any) {
            console.error("Frontend: Login error caught:", exception);
            // Changed error message for better clarity if credentials don't match
            const errorMessage = exception.response?.data?.message || "Invalid email or password.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
            console.log("Frontend: Loading set to false after login attempt.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-emerald-600 to-green-400 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-emerald-800 mb-2">Member Sign In</h2>
                    <p className="text-gray-600">Sign in to manage the site</p>
                </div>

                <form onSubmit={handleSubmit(login)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register("email")}
                                type="email"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register("password")}
                                type="password"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <NavLink
                            to="/forgot-password"
                            className="text-sm text-emerald-600 hover:underline"
                        >
                            Forgot Password?
                        </NavLink>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-emerald-600 text-white rounded-lg py-3 px-4 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transform transition hover:scale-105"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                    {/* Added Home Button */}
                    <NavLink
                        to="/"
                        className="w-full flex items-center justify-center bg-gray-200 text-gray-800 rounded-lg py-3 px-4 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transform transition hover:scale-105 mt-4"
                    >
                        Go to Home
                    </NavLink>
                </form>
            </div>
        </div>
    );
};

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [fullname, setFullName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {
        try {
            setLoading(true);
            await authSvc.forgotPasswordRequest({ email, fullname });
            toast.success("Password reset link sent to your email.");
        } catch (error: any) {
            toast.error(error.message || "Member not Found");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-emerald-600 to-green-400 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-8">
                <div className="text-center">
                    <h3 className="text-3xl font-bold text-emerald-800 mb-2">Forgot Password?</h3>
                    <p className="text-gray-600">Enter your details to reset your password</p>
                </div>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={fullname}
                        onChange={(e) => setFullName(e.target.value)}
                        className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition text-gray-800"
                        placeholder="Enter your full name"
                    />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition text-gray-800"
                        placeholder="Enter your email"
                    />

                    <button
                        onClick={handleForgotPassword}
                        className="w-full bg-emerald-600 text-white rounded-lg py-3 px-4 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transform transition hover:scale-105"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                    {/* Added Home Button */}
                    <NavLink
                        to="/"
                        className="w-full flex items-center justify-center bg-gray-200 text-gray-800 rounded-lg py-3 px-4 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transform transition hover:scale-105 mt-4"
                    >
                        Go to Home
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

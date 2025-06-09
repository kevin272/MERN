import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { axiosInstance } from "../../config/axois.config";
import authSvc from "../../pages/auth/auth.service";

import { useDispatch, useSelector } from "react-redux";
import { setLoggedInUserForRedux, getLoggedInUserRedux } from "../../components/reducer/user.reducer"; // Adjust path to your user reducer
import { RootState, AppDispatch } from "../../config/store.config";

export const Signin = () => {
    const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);
    const dispatch: AppDispatch = useDispatch();

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
        // Corrected: Use loggedInUser.name consistent with your User interface and Redux state
        if (loggedInUser && loggedInUser.name) {
            toast.info("You are already logged in as " + loggedInUser.name);
            navigate('/admin');
        }
    }, [loggedInUser, navigate]);

 const login = async (data: any) => {
  try {
    setLoading(true);
    console.log("Frontend: Sending login request with data:", data);

    const responseData = await authSvc.signin(data);

    console.log("Frontend: Login Response:", responseData);

    if (responseData.token && responseData.userDetail) {
      localStorage.setItem("_at", responseData.token);
      localStorage.setItem("_rt", responseData.refreshToken);

      toast.success(`Welcome ${responseData.userDetail.role} ${responseData.userDetail.name}`);
      dispatch(setLoggedInUserForRedux(responseData.userDetail));
      navigate("/admin");
    } else {
      toast.error("Login failed: Incomplete response from server.");
    }
  } catch (exception: any) {
    console.error("Frontend: Login error caught:", exception);
    const errorMessage = exception.message || "Invalid email or password.";
    toast.error(errorMessage);
  } finally {
    setLoading(false);
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

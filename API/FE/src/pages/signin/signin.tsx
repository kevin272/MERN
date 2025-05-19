import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock, Mail } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import authSvc from "../auth/auth.service";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth.context";
import { NavLink } from "react-router-dom";
import { axiosInstance } from "../../config/axois.config";

export const Signin = () => {
    const { loggedInUser, setLoggedInUser } = useContext(AuthContext);
  const LoginDTO = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(LoginDTO)
  });

  const navigate = useNavigate();
  

  useEffect(() => {
    if (loggedInUser) {
      toast.info("You are already logged in as " + loggedInUser.fullName );
      navigate('/' + loggedInUser.role)  ;
    }
  }, []);

  const login = async (data: any) => {
    // console.log(data)
    try {
      setLoading(true);
    //   const response: any = await axios.post("http://localhost:9000/auth/signin", data);
      const response: any = await axiosInstance.post("/auth/signin", data);
    //   console.log("Login Response:", response); 
      localStorage.setItem("_at", response.data.token);
      localStorage.setItem("_rt", response.data.refreshToken);
      toast.success(`Welcome to ${response.data.userDetail.role} ${response.data.userDetail.name}`);
      setLoggedInUser(response.data.userDetail);
      console.log(response.data)
      navigate("/" + response.data.userDetail.role);
    } catch (exception: any) {
        const errorMessage =
          exception.response?.data?.message || "There is no user with this credentials";
        toast.error(errorMessage);
      }finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-600 to-orange-400 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-red-800 mb-2">Only for Members</h2>
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
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-red-800 transition"
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
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-red-800 transition"
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
                    className="text-sm text-red-600 hover:underline"
                >
                    Forgot Password?
                </NavLink>
            </div>

            <button
                disabled={loading}
                type="submit"
                className="w-full bg-red-800 text-white rounded-lg py-3 px-4 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2 transform transition hover:scale-105"
            >
                Sign In
            </button>
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
        <div className="forgot-password-container">
            <h3 className="text-lg font-bold text-gray-700">Forgot Password?</h3>
            
            <input
                type="text"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter your full name"
            />
  
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
            />
  
            <button
                onClick={handleForgotPassword}
                className="mt-3 w-full bg-red-800 text-white rounded-lg py-2 px-4 hover:bg-red-700"
                disabled={loading}
            >
                {loading ? "Sending..." : "Send Reset Link"}
            </button>
        </div>
    );
  };
  
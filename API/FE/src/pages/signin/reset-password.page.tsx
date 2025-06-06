import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authSvc from "../auth/auth.service";
import { toast } from "react-toastify";
import { Lock } from "lucide-react";

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        setLoading(true);
        try {
            await authSvc.resetPasswordRequest({ forgetToken: token, newPassword, confirmPassword });
            toast.success("Password successfully reset! Please sign in.");
            navigate("/signin");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error occurred during password reset.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-emerald-600 to-green-400 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-8 text-center">
                <h3 className="text-3xl font-bold text-emerald-800 mb-2">Reset Your Password</h3>
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition text-gray-800"
                            placeholder="New Password"
                            aria-label="New Password"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition text-gray-800"
                            placeholder="Confirm Password"
                            aria-label="Confirm Password"
                        />
                    </div>
                    <button
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white rounded-lg py-3 px-4 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transform transition hover:scale-105"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

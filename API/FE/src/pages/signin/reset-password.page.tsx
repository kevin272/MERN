import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authSvc from "../auth/auth.service";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        try {
            if (newPassword !== confirmPassword) {
                toast.error("Passwords do not match!");
                return;
            }

            await authSvc.resetPasswordRequest({ forgetToken: token, newPassword, confirmPassword });
            toast.success("Password successfully reset! Please sign in.");
            navigate("/signin");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error occurred");
        }
    };

    return (
        <div className="reset-password-container">
            <h3 className="text-lg font-bold text-gray-700">Reset Your Password</h3>
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-lg"
                placeholder="New Password"
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-lg mt-3"
                placeholder="Confirm Password"
            />
            <button
                onClick={handleResetPassword}
                className="mt-3 w-full bg-green-700 text-white rounded-lg py-2 px-4 hover:bg-green-600"
            >
                Reset Password
            </button>
        </div>
    );
};

export default ResetPassword; 



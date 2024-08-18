import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard.ts";

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  const context = useDashboard();
  if (!context) {
    throw new Error(
      "ResetPasswordForm must be used within a DashboardProvider"
    );
  }
  const { resetPassword, isLoading, error, clearError } = context;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      await resetPassword(newPassword);
      // Password reset successful
      console.log("Password reset successful");
      // You might want to show a success message here
      navigate("/dashboard"); // Or wherever you want to redirect after successful reset
    } catch (err) {
      // The error is already set in the context, so we don't need to do anything here
      console.error("Failed to reset password", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="new-password"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <input
          id="new-password"
          type="password"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>
        <input
          id="confirm-password"
          type="password"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {(localError || error) && (
        <div className="text-red-500 text-sm">{localError || error}</div>
      )}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;

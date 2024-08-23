import React, { useState, useEffect } from "react";
import { useDashboard } from "../../hooks/useDashboard.ts";
import ErrorMessage from "../common/ErrorMessage.tsx";
import SuccessMessage from "../common/SuccessMessage.tsx";
import PasswordInput from "../common/PasswordInput.tsx";

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const localError = "New Password should be different from old password.";

  const { resetPassword, isLoading, clearError, error } = useDashboard();

  useEffect(() => {
    setPasswordsMatch(newPassword !== "" && newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (error) {
      setIsSuccess(false);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSuccess(false);

    if (passwordsMatch) {
      try {
        await resetPassword(newPassword);
        if (!error) {
          setIsSuccess(true);
          setNewPassword("");
          setConfirmPassword("");
        }
      } catch (err) {
        console.error("Failed to reset password", err);
      }
    }
  };

  const isFormValid = newPassword !== "" && passwordsMatch;

  return (
    <div className="max-w-md bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          value={newPassword}
          onChange={setNewPassword}
          id="new-password"
          placeholder="New Password"
        />

        <PasswordInput
          value={confirmPassword}
          onChange={setConfirmPassword}
          id="confirm-password"
          placeholder="Confirm New Password"
          showStrength={false}
        />

        {confirmPassword !== "" && (
          <p
            className={`text-sm ${
              passwordsMatch ? "text-green-500" : "text-red-500"
            }`}
          >
            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
          </p>
        )}

        {error && <ErrorMessage error={localError} />}
        {isSuccess && (
          <SuccessMessage message="Password changed successfully!" />
        )}

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Changing Password...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;

import React, { useState, useEffect } from "react";
import { useDashboard } from "../../hooks/useDashboard.ts";
import ErrorMessage from "../ErrorMessage.tsx";

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    [key: string]: "pristine" | "valid" | "invalid";
  }>({
    "Uppercase letter": "pristine",
    "Lowercase letter": "pristine",
    "8 or more characters": "pristine",
    "1 or more number": "pristine",
  });

  const { resetPassword, isLoading, error, clearError } = useDashboard();

  const checkPasswordStrength = (password: string) => {
    const newStrength: { [key: string]: "pristine" | "valid" | "invalid" } = {
      "Uppercase letter": /[A-Z]/.test(password) ? "valid" : "invalid",
      "Lowercase letter": /[a-z]/.test(password) ? "valid" : "invalid",
      "8 or more characters": password.length >= 8 ? "valid" : "invalid",
      "1 or more number": /\d/.test(password) ? "valid" : "invalid",
    };
    setPasswordStrength(newStrength);
  };

  useEffect(() => {
    setPasswordsMatch(newPassword !== "" && newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    // Reset success message if there's an error
    if (error) {
      setIsSuccess(false);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSuccess(false);
    if (
      passwordsMatch &&
      Object.values(passwordStrength).every((status) => status === "valid")
    ) {
      try {
        await resetPassword(newPassword);
        // Only set success if there's no error after the API call
        if (!error) {
          setIsSuccess(true);
          setNewPassword("");
          setConfirmPassword("");
          setPasswordStrength({
            "Uppercase letter": "pristine",
            "Lowercase letter": "pristine",
            "8 or more characters": "pristine",
            "1 or more number": "pristine",
          });
        }
      } catch (err) {
        console.error("Failed to reset password", err);
        // Error will be handled by the useDashboard hook and displayed via the ErrorMessage component
      }
    }
  };

  const isFormValid =
    newPassword !== "" &&
    passwordsMatch &&
    Object.values(passwordStrength).every((status) => status === "valid");

  return (
    <div className="max-w-md bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              checkPasswordStrength(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {confirmPassword !== "" && (
          <p
            className={`text-sm ${
              passwordsMatch ? "text-green-500" : "text-red-500"
            }`}
          >
            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
          </p>
        )}

        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-sm font-semibold mb-2">Password requirements:</p>
          <ul className="text-xs space-y-1">
            {Object.entries(passwordStrength).map(([requirement, status]) => (
              <li
                key={requirement}
                className={`flex items-center ${
                  status === "pristine"
                    ? "text-gray-500"
                    : status === "valid"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {status === "valid" ? "✓" : status === "invalid" ? "×" : "·"}{" "}
                {requirement}
              </li>
            ))}
          </ul>
        </div>

        {error && <ErrorMessage error={error} />}
        {isSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Password changed successfully!
          </div>
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

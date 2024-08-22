import React, { useState } from "react";
import ErrorMessage from "../ErrorMessage.tsx";


interface ResetPasswordFormProps {
  onSubmit: (newPassword: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
  isLoading: boolean;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  error,
  clearError,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    clearError();
    try {
      await onSubmit(newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1">
      <div className="text-[25px] text-[#333] font-bold">Reset Password</div>
      <div className="text-[20px] text-[#333] mb-[20px]">
        Enter your new password
      </div>
      <form onSubmit={handleSubmit} className="text-md">
        <div className="flex mb-4 border border-gray-300 rounded-[30px] w-full py-4 pl-6 pr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            id="newPassword"
            placeholder="Enter New Password"
            className="ml-4 w-full"
            style={{ outline: "none" }}
            required
          />
        </div>
        <div className="flex mb-4 border border-gray-300 rounded-[30px] w-full py-4 pl-6 pr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="confirmPassword"
            placeholder="Confirm New Password"
            className="ml-4 w-full"
            style={{ outline: "none" }}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#0575E6] text-white text-center w-full rounded-[30px] py-4 mb-1 hover:bg-[#35649b] transition duration-300 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : null}
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
      {passwordError && (
        <p className="text-red-500 text-sm mt-2">{passwordError}</p>
      )}
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default ResetPasswordForm;

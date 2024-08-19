import React, { useState } from "react";

interface VerifyOTPFormProps {
  email: string;
  onSubmit: (otp: string) => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

const VerifyOTPForm: React.FC<VerifyOTPFormProps> = ({
  email,
  onSubmit,
  error,
}) => {
  const [otp, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(otp);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1">
      <div className="text-[25px] text-[#333] font-bold">Verify OTP</div>
      <div className="text-[20px] text-[#333] mb-[20px]">
        Enter the OTP sent to {email}
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
              d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
            />
          </svg>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            id="otp"
            placeholder="Enter OTP"
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
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default VerifyOTPForm;

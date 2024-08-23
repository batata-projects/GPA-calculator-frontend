import React, { useState, useEffect } from "react";
import ErrorMessage from "../common/ErrorMessage.tsx";
import PasswordInput from "../common/PasswordInput.tsx";

interface RegisterFormProps {
  onSubmit: (formData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  error,
  clearError,
}) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (password !== "" && confirmPassword !== "") {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(false);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordsMatch) {
      setIsLoading(true);
      clearError();
      try {
        await onSubmit({ first_name, last_name, email, password });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isFormValid =
    first_name !== "" && last_name !== "" && email !== "" && passwordsMatch;

  return (
    <div>
      <div className="text-[25px] text-[#333] font-bold">Hello!</div>
      <div className="text-[20px] text-[#333] mb-[20px]">
        Sign Up To Get Started
      </div>
      <form onSubmit={handleSubmit} className="text-md">
        <div className="flex space-x-2">
          <div className="flex flex-row mb-4 border border-gray-300 rounded-[30px] w-full py-4 pl-6 pr-2">
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
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <input
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              id="first_name"
              placeholder="First Name"
              required
              className="ml-4 w-full"
              style={{ outline: "none" }}
            />
          </div>

          <div className="flex flex-row mb-4 border border-gray-300 rounded-[30px] w-full py-4 pl-6 pr-2">
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
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <input
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              id="last_name"
              placeholder="Last Name"
              required
              className="ml-4 w-full"
              style={{ outline: "none" }}
            />
          </div>
        </div>

        <div className="flex flex-row mb-4 border border-gray-300 rounded-[30px] w-full py-4 pl-6 pr-2">
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
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="Email Address"
            className="ml-4 w-full"
            style={{ outline: "none" }}
            required
          />
        </div>
        <div className="space-y-4">
          <PasswordInput
            value={password}
            onChange={setPassword}
            id="password"
            placeholder="Password"
          />

          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            id="confirmPassword"
            placeholder="Confirm Password"
            showStrength={false}
          />
        </div>

        {confirmPassword !== "" && (
          <p
            className={`text-sm mt-2 ${
              passwordsMatch ? "text-green-500" : "text-red-500"
            }`}
          >
            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
          </p>
        )}

        {error && <ErrorMessage error={error} />}

        <button
          type="submit"
          className="bg-[#0575E6] text-white text-center w-full rounded-[30px] py-4 mb-1 mt-4 hover:bg-[#35649b] transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={!isFormValid || isLoading}
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Registering...
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

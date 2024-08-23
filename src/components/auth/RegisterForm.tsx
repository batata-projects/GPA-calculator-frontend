import React, { useState, useEffect } from "react";
import ErrorMessage from "../common/ErrorMessage.tsx";

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
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    [key: string]: "pristine" | "valid" | "invalid";
  }>({
    "Uppercase letter": "pristine",
    "Lowercase letter": "pristine",
    "8 or more characters": "pristine",
    "1 or more number": "pristine",
  });

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
    if (password !== "" && confirmPassword !== "") {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(false);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      passwordsMatch &&
      Object.values(passwordStrength).every((status) => status === "valid")
    ) {
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
    first_name !== "" &&
    last_name !== "" &&
    email !== "" &&
    passwordsMatch &&
    Object.values(passwordStrength).every((status) => status === "valid");

  return (
    <div>
      <div className=" text-[25px] text-[#333] font-bold">Hello!</div>
      <div className=" text-[20px] text-[#333] mb-[20px]">
        Sign Up To Get Started
      </div>
      <form onSubmit={handleSubmit} className=" text-md">
        <div className="flex space-x-2">
          <div className="flex flex-row mb-4 border border-gray-300 rounded-[30px] w-full py-4 pl-6 pr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <input
              type="text"
              value={first_name}
              onChange={(e) => setfirst_name(e.target.value)}
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
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <input
              type="text"
              value={last_name}
              onChange={(e) => setlast_name(e.target.value)}
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
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>

          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="Email Address"
            className=" ml-4 w-full"
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
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value === "") {
                setPasswordStrength({
                  "Uppercase letter": "pristine",
                  "Lowercase letter": "pristine",
                  "8 or more characters": "pristine",
                  "1 or more number": "pristine",
                });
              } else {
                checkPasswordStrength(e.target.value);
              }
            }}
            id="password"
            placeholder="Password"
            className="ml-4 w-full"
            style={{ outline: "none" }}
          />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-row border border-gray-300 rounded-[30px] w-full py-4 pl-6 pr-2">
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
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirmPassword"
              placeholder="Confirm Password"
              className="ml-4 w-full"
              style={{ outline: "none" }}
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
        </div>

        <div className="my-1">
          <p className="text-sm font-semibold">Password should contain:</p>
          <ul className="text-sm">
            {Object.entries(passwordStrength).map(([requirement, status]) => (
              <li
                key={requirement}
                className={`flex items-center ${
                  status === "pristine"
                    ? "text-gray-400"
                    : status === "valid"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {status === "pristine" && (
                  <span className="h-4 w-4 mr-2 inline-flex items-center justify-center">
                    -
                  </span>
                )}
                {status === "valid" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {status === "invalid" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {requirement}
              </li>
            ))}
          </ul>
        </div>
        {error && <ErrorMessage error={error} />}

        <button
          type="submit"
          className="bg-[#0575E6] text-white text-center w-full rounded-[30px] py-4 mb-1 hover:bg-[#35649b] transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
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

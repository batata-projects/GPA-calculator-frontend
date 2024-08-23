import React, { useState, useEffect } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  id: string;
  placeholder: string;
  showStrength?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  id,
  placeholder,
  showStrength = true,
}) => {
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
    if (value === "") {
      setPasswordStrength({
        "Uppercase letter": "pristine",
        "Lowercase letter": "pristine",
        "8 or more characters": "pristine",
        "1 or more number": "pristine",
      });
    } else {
      checkPasswordStrength(value);
    }
  }, [value]);

  return (
    <div className="flex flex-col">
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          id={id}
          placeholder={placeholder}
          className="ml-4 w-full"
          style={{ outline: "none" }}
        />
      </div>
      {showStrength && (
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
      )}
    </div>
  );
};

export default PasswordInput;

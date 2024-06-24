import React, { useState } from "react";

interface RegisterFormProps {
  onSubmit: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
  error: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, error }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ firstName, lastName, email, password });
  };

  return (
    <div>
      <div className=" text-[26px] text-[#333] font-bold">Hello!</div>
      <div className=" text-lg text-[#333] mb-[40px]">
        Sign Up To Get Started
      </div>
      <form onSubmit={handleSubmit} className=" text-md">
        <div className="flex space-x-2">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            id="firstName"
            placeholder="First Name"
            required
            className="mb-4 block border border-gray-300 rounded-[30px] w-full py-4 pl-6 pr-1"
          />

          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            id="lastName"
            placeholder="Last Name"
            required
            className="mb-4 block border border-gray-300 rounded-[30px] w-full py-4 pl-6 pr-1"
          />
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          placeholder="Email"
          required
          className="mb-4 block border border-gray-300 rounded-[30px] w-full  py-4 pl-6 pr-1"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          placeholder="Password"
          required
          className="mb-4 block border border-gray-300 rounded-[30px] w-full py-4 pl-6 pr-1"
        />

        <button
          type="submit"
          className="bg-[#0575E6] text-white text-center w-full rounded-[30px] py-4 mb-1 hover:bg-[#35649b] transition duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

import React, { useState } from "react";

interface RegisterFormProps {
  onSubmit: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
  }) => void;
  error: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, error }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ firstName, lastName, email, username, password });
  };

  return (
    <div className=" flex flex-col w-full items-center max-w-md p-8">
      <div className="flex-shrink flex-grow">
        <div className=" text-[26px] text-[#333] font-bold">Hello!</div>
        <div className=" text-lg text-[#333] mb-[40px]">
          Sign Up To Get Started
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-7">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              id="firstName"
              placeholder="First Name"
              required
              className="mb-4 block border border-gray-300 rounded-[30px] w-[200px] h-[10px] py-8 px-6 text-lg"
            />

            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              id="lastName"
              placeholder="Last Name"
              required
              className="mb-4 block border border-gray-300 rounded-[30px] w-[200px] h-[30px] py-8 px-6 text-lg"
            />
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="Email"
            required
            className="mb-4 block border border-gray-300 rounded-[30px] w-[432px] h-[30px] py-8 px-6 text-lg"
          />

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            placeholder="Username"
            required
            className="mb-4 block border border-gray-300 rounded-[30px] w-[432px] h-[30px] py-8 px-6 text-lg"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            placeholder="Password"
            required
            className="mb-4 block border border-gray-300 rounded-[30px] w-[432px] h-[30px] py-8 px-6 text-lg"
          />

          <button
            type="submit"
            className="bg-[#0575E6] text-white text-center w-[432px] rounded-[30px] py-3 mb-1 hover:bg-[#35649b] transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;

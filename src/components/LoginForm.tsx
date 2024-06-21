import React, { useState } from "react";

interface LoginFormProps {
  onSubmit: (formData: { email: string; password: string }) => void;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className=" flex flex-col w-full items-center max-w-md p-8">
      <div className=" flex-shrink flex-grow">
        <div className=" text-[26px] text-[#333] font-bold">Hello Again!</div>
        <div className=" text-lg text-[#333] mb-[40px]">Welcome Back</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="Email Address"
            className=" mb-4 block border border-gray-300 rounded-[30px] w-[432px] h-[40px] py-8 px-6 text-lg"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            placeholder="Password"
            className=" mb-4 block border border-gray-300 rounded-[30px] w-[432px] h-[40px] py-8 px-6 text-lg"
          />
          <button
            type="submit"
            className=" bg-[#0575E6] text-white text-center w-[432px] rounded-[30px] py-3 mb-3 hover:bg-[#35649b] transition duration-300"
          >
            Login
          </button>
          <a href="" className=" underline ml-[150px]">
            Forgot Password!
          </a>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import httpClient from '../httpClient.tsx';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const logInUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(email, password);
    try {
      const resp = await httpClient.post('/auth/login', {
        email,
        password,
      });
      console.log(resp.data);
      setError(null);
      navigate('/dashboard');
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 400) {
          setError(error.response.data.detail);
        } else if (error.response.status === 422) {
          setError(error.response.data.detail[0].msg);
        } else {
          setError('An error occurred. Please try again.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from the server. Please try again.');
      } else {
        // Something else happened in making the request
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
        <form onSubmit={logInUser}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/register">
            <button className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition duration-300 ease-in-out">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

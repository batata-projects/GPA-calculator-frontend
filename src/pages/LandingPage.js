import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen space-x-4">
      <Link to="/login">
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out">
          Login
        </button>
      </Link>

      <Link to="/register">
        <button className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300 ease-in-out">
          Register
        </button>
      </Link>
    </div>
  );
}
export default LandingPage;

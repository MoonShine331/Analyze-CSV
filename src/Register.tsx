// src/Login.tsx
import React, { useState } from 'react';
import api from './axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();  // useNavigate hook for programmatic navigation

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await api.post('register/', {
        username,
        email,
        password,
      });

      setMessage('Registration successful!');
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto min-w-full h-screen">
      <div className="flex flex-row h-full">
        <div className="w-[40%] flex flex-col p-10">
          <div className='flex flex-row text-center gap-4 h-[30%]'>
            <img src='/img/logo.png' className='w-auto h-[3rem] mt-[8px]'></img>
            <p className='text-white text-6xl'>Data Analytics</p>
          </div>
          <div className='h-[10%] pl-16 pr-16'>
            <h2 className="text-4xl text-white mb-4">Sign Up</h2>
          </div>
          <div className='h-[50%] pl-16 pr-16'>
            <form onSubmit={handleRegister}>
              <div className="mb-4 flex items-center border-[rgb(50,50,50)] focus:border-[#82DBF7] border rounded shadow appearance-none">
                <span className="p-2 px-4">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                </span>
                <input
                  type="text"
                  id="username"
                  className="shadow appearance-none border-[#82DBF7] rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:shadow-outline bg-transparent"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-4 flex items-center border-[rgb(50,50,50)] focus:border-[#82DBF7] border rounded shadow appearance-none">
                <div className="px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.94 5.7L10 11.44l7.06-5.74A1 1 0 0016.94 4H3.06a1 1 0 00-.12 1.7z" />
                    <path d="M18 8.34v7.32A2 2 0 0116 17H4a2 2 0 01-2-2V8.34l7.06 5.74a3 3 0 003.88 0L18 8.34z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="setEmail"
                  className="shadow appearance-none border-[#82DBF7] rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:shadow-outline bg-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4 flex items-center border-[rgb(50,50,50)] focus:border-[#82DBF7] border rounded shadow appearance-none">
                <span className="p-2 px-4">
                  <FontAwesomeIcon icon={faLock} className="text-gray-500" />
                </span>
                <input
                  type="password"
                  id="password"
                  className="shadow appearance-none border-[#82DBF7] rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:shadow-outline bg-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-[#B6F09C] hover:bg-gray-400 text-black font-bold py-2 px-4 rounded w-full mt-8"
              >
                Register
              </button>
            </form>
            {message && <p className="mt-4 text-white">{message}</p>}
          </div>
          <div>
            <p className='text-[#9B9C9E] mt-20 text-center'>Data Analytics © 2024 (<Link to="/login" className='text-[#82DBF7]'>Login</Link>)</p>
          </div>
        </div>
        <div className="w-[60%] h-full">
          <img src="/img/login_background.png" className="w-full h-full object-cover" alt="Login background" />
        </div>
      </div>
    </div >
  );
};

export default Register;

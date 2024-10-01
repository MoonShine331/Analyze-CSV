// src/Login.tsx
import React, { useState } from 'react';
import api from './axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();  // useNavigate hook for programmatic navigation

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await api.post('token/', {
        username,
        password,
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      setMessage('Login successful!');
      onLoginSuccess();
      navigate('/dashboard');  // Programmatically route to the dashboard
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
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
            <h2 className="text-4xl text-white mb-4">Let's get <span className='text-[#87DDEE]'>creative!</span></h2>
          </div>
          <div className='h-[50%] pl-16 pr-16'>
            <form onSubmit={handleLogin}>
              <div className="mb-4 flex items-center border-[rgb(50,50,50)] focus:border-[#82DBF7] border rounded shadow appearance-none">
                <span className="p-2 px-4">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                </span>
                <input
                  type="text"
                  id="username"
                  className="shadow appearance-none border-[#82DBF7] rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:outline-none focus:shadow-outline bg-transparent"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-4 flex items-center border border-[rgb(50,50,50)] rounded shadow appearance-none">
                <span className="p-2 px-4">
                  <FontAwesomeIcon icon={faLock} className="text-gray-500" />
                </span>
                <input
                  type="password"
                  id="password"
                  className="shadow appearance-none border-[#82DBF7] rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:outline-none focus:shadow-outline bg-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-[#B6F09C] hover:bg-gray-400 text-black font-bold py-2 px-4 rounded w-full mt-8"
              >
                Login
              </button>
            </form>
            {message && <p className="mt-4 text-white">{message}</p>}
          </div>
          <div>
            <p className='text-white mt-20'>Don't have an account?<Link to="/register" className='text-[#82DBF7] ml-2'>Sign Up</Link></p>
          </div>
        </div>
        <div className="w-[60%] h-full">
          <img src="/img/login_background.png" className="w-full h-full object-cover" alt="Login background" />
        </div>
      </div>
    </div>

  );
};

export default Login;

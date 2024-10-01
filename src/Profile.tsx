// src/Profile.tsx
import React, { useState, useEffect } from 'react';
import api from './axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('profile/');
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        setError('Failed to load profile information.');
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put('profile/', {
        username,
        email,
      });

      setMessage('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6 w-[40%] content-center text-center">
      <h2 className="text-3xl font-bold mb-4 text-white">Update Profile</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}
      <form onSubmit={handleUpdateProfile}>
        <div className="mb-4 flex items-center border-[rgb(50,50,50)] focus:border-[#82DBF7] border rounded shadow appearance-none mt-10">
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
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[100px] mt-4"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;

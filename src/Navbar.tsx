import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  handleLogout: () => void; // Add handleLogout prop to Navbar
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  const location = useLocation();

  const logout = () => {
    handleLogout(); // Call the logout handler
    navigate('/login'); // Redirect to login page
  };

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "text-black mr-4 bg-[#FE8A00] rounded-2xl p-2 pl-6 pr-6"
      : "text-[#697B7B] border border-[#22353E] rounded-2xl p-2 pl-6 pr-6 mr-4 hover:bg-[#FE8A00]";
  };

  return (
    <nav className="bg-[rgb(19,22,25)] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className='flex flex-row gap-3'>
          <img src='/img/dashLogo.png'></img>
          <Link to="/" className="text-white text-xl font-bold">Data Analytics</Link>
        </div>
        <div className='flex flex-row gap-2 pt-2'>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className={getLinkClass('/dashboard')}><div className='flex flex-row gap-2'><img src='/img/dashboard.png' className='h-[80%] mt-[2px]'></img><span>Dashboard</span></div></Link>
              <Link to="/upload" className={getLinkClass('/upload')}><div className='flex flex-row gap-2'><img src='/img/upload.png' className='h-[80%] mt-[2px]'></img><span>File Uploads</span></div></Link>
              <Link to="/files" className={getLinkClass('/files')}><div className='flex flex-row gap-2'><img src='/img/setting.png' className='h-[80%] mt-[2px]'></img><span>Data Setting</span></div></Link>
              <Link to="/profile" className={getLinkClass('/profile')}>Profile</Link>
              <button onClick={logout} className="text-white mr-4 border border-[rgb(255,100,100)] rounded-2xl p-2 pl-6 pr-6">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4">Login</Link>
              <Link to="/register" className="text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

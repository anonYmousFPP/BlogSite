import React, { useState } from 'react';
import { Avatar } from './BlogsCard';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');

    // Redirect to login page
    navigate('/signin');
  };

  return (
    <header className="bg-white shadow-md w-full py-4 px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={"/"} className="text-3xl font-bold text-gray-800">Blogify</Link>          
        <div className="relative flex">
          <Link to={'/publish'}>
            <button type='button' className='mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2'>
              + Blog
            </button>
          </Link>
          <div onClick={handleAvatarClick}>
            <Avatar size={"big"} name="Abhay" />
          </div>
          {/* Dropdown for Logout */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
              <button 
                onClick={handleLogout} 
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

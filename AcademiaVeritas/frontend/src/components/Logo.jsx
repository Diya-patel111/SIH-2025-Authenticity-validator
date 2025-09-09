import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2L4 6V15C4 22.28 9.24 28.84 16 30C22.76 28.84 28 22.28 28 15V6L16 2Z" fill="#0A2342"/>
        <path d="M13 19L9 15L10.4 13.6L13 16.2L21.6 7.6L23 9L13 19Z" fill="#F9A826"/>
      </svg>
      <span className="text-xl font-bold text-academic-blue">CertiSure</span>
    </Link>
  );
};

export default Logo;

import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo'; // Assuming Logo.jsx is in the same directory
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { auth, logout } = useAuth();

    return (
        <nav className="bg-clarity-white shadow-md fixed w-full z-20 top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Logo />
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            {auth.token ? (
                                <button
                                    onClick={logout}
                                    className="bg-academic-blue text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link
                                        to="/portal"
                                        className="bg-innovation-saffron text-academic-blue font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Institution Portal
                                    </Link>
                                    <Link
                                        to="/verify"
                                        className="bg-transparent text-academic-blue border-2 border-academic-blue font-bold py-2 px-4 rounded-lg hover:bg-academic-blue hover:text-white transition-colors"
                                    >
                                        Verifier Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

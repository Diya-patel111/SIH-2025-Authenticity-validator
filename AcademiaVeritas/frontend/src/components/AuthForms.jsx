import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginInstitution, registerInstitution, loginVerifier, registerVerifier } from '../apiService';

const AuthForms = ({ initialUserType = 'institution', onLoginSuccess }) => {
    const [activeTab, setActiveTab] = useState('login');
    const [userType, setUserType] = useState(initialUserType);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conflictInfo, setConflictInfo] = useState(null);
    const { login } = useAuth();

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const switchUserType = (type) => {
        setUserType(type);
        setFormData({ name: '', email: '', password: '' });
        setError('');
        setSuccess('');
        setConflictInfo(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setConflictInfo(null);
        setIsLoading(true);

        try {
            if (activeTab === 'register') {
                const apiCall = userType === 'institution' ? registerInstitution : registerVerifier;
                await apiCall(formData);
                setSuccess('Registration successful! Please log in.');
                setActiveTab('login');
                setFormData({ name: '', email: '', password: '' }); // Clear form on success
            } else {
                // Client-side validation to ensure required fields are present
                if (!formData.email || !formData.password) {
                    setError('Please enter both email and password');
                    return;
                }
                
                if (!formData.email.trim() || !formData.password.trim()) {
                    setError('Email and password cannot be empty');
                    return;
                }
                
                const apiCall = userType === 'institution' ? loginInstitution : loginVerifier;
                const response = await apiCall(formData);
                
                // Fix: The axios interceptor returns response.data directly, so token is at response.token
                login(response.token);
                if (onLoginSuccess) onLoginSuccess();
            }
        } catch (err) {
            const errorData = err.response?.data;
            
            if (err.response?.status === 409 && errorData) {
                // Handle 409 Conflict errors with detailed information
                setConflictInfo({
                    conflict: errorData.conflict,
                    message: errorData.message,
                    suggestions: errorData.suggestions
                });
                setError(errorData.error || 'Account already exists');
            } else {
                // Handle other errors
                setError(errorData?.error || err.message || 'An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGoogleLogin = () => {
        const backendBase = 'http://localhost:5000'; // Make sure this matches your backend URL
        const endpoint = userType === 'institution' ? '/login/institution/google' : '/login/verifier/google';
        window.location.href = backendBase + endpoint;
    };


    const title = `${userType === 'institution' ? 'Institution' : 'Verifier'} Portal Access`;

    return (
        <div className="bg-clarity-white p-8 rounded-xl shadow-lg max-w-md mx-auto border border-gray-200">
            <h2 className="text-2xl font-bold text-center text-academic-blue mb-4">{title}</h2>

            <div className="flex justify-center bg-gray-100 rounded-lg p-1 mb-6">
                <button
                    onClick={() => switchUserType('institution')}
                    className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${userType === 'institution' ? 'bg-white text-academic-blue shadow' : 'text-gray-500'}`}
                >
                    Institution
                </button>
                <button
                    onClick={() => switchUserType('verifier')}
                    className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${userType === 'verifier' ? 'bg-white text-academic-blue shadow' : 'text-gray-500'}`}
                >
                    Verifier
                </button>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
                <button onClick={() => setActiveTab('login')} className={`flex-1 py-2 font-bold text-center ${activeTab === 'login' ? 'text-academic-blue border-b-2 border-academic-blue' : 'text-gray-400'}`}>Login</button>
                <button onClick={() => setActiveTab('register')} className={`flex-1 py-2 font-bold text-center ${activeTab === 'register' ? 'text-academic-blue border-b-2 border-academic-blue' : 'text-gray-400'}`}>Register</button>
            </div>
            
            {activeTab === 'login' && (
                 <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 mb-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 font-bold text-gray-700 shadow-sm transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M43.611 20.083H42V20H24V28H35.303C33.674 32.69 29.223 36 24 36C18.477 36 14 31.523 14 26C14 20.477 18.477 16 24 16C26.46 16 28.656 16.953 30.464 18.525L36.214 12.775C32.963 9.945 28.78 8 24 8C13.596 8 5.125 16.273 5.125 26C5.125 35.727 13.596 44 24 44C34.935 44 44 36.4 44 24C44 22.465 43.862 21.25 43.611 20.083Z" fill="#FFC107"/><path d="M43.611 20.083H42V20H24V28H35.303C33.674 32.69 29.223 36 24 36C18.477 36 14 31.523 14 26C14 20.477 18.477 16 24 16C26.46 16 28.656 16.953 30.464 18.525L36.214 12.775C32.963 9.945 28.78 8 24 8C13.596 8 5.125 16.273 5.125 26C5.125 35.727 13.596 44 24 44C34.935 44 44 36.4 44 24C44 22.465 43.862 21.25 43.611 20.083Z" fill="#FF3D00"/><path d="M4.9 33.6L12.7 28.8C14.7 32.4 18.9 35 24 35C29.2 35 33.7 32.7 35.3 28H24V20H43.6C43.8 21.2 44 22.5 44 24C44 36.4 34.9 44 24 44C18.9 44 14.2 41.6 11.1 38.2L4.9 33.6Z" fill="#4CAF50"/><path d="M24 10C28.5 10 32.3 11.6 35.1 14.1L41.3 7.9C37.3 4.4 31.2 2 24 2C13.6 2 5.1 10.3 5.1 20C5.1 21.9 5.4 23.6 5.9 25.3L12.5 20.1C12.2 18.2 12 16.2 12 14C12 11.8 17.1 10 24 10Z" fill="#1976D2"/>
                    </svg>
                    Login with Google
                 </button>
            )}

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-failure-red text-sm font-semibold mb-2">{error}</p>
                    {conflictInfo && (
                        <div className="text-sm text-red-700">
                            <p className="mb-2">{conflictInfo.message}</p>
                            {conflictInfo.suggestions && (
                                <div className="ml-2">
                                    <p className="font-medium mb-1">What you can do:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {conflictInfo.suggestions.map((suggestion, index) => (
                                            <li key={index} className="text-xs">{suggestion}</li>
                                        ))}
                                    </ul>
                                    {conflictInfo.conflict === 'email' && (
                                        <button 
                                            onClick={() => {setActiveTab('login'); setError(''); setConflictInfo(null);}}
                                            className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Switch to Login
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            {success && <p className="text-success-green text-sm text-center mb-4">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'register' && (
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">{userType === 'institution' ? 'Institution Name' : 'Full Name'}</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleInputChange} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-blue" 
                            required 
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-blue" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleInputChange} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-blue" 
                        required 
                    />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-academic-blue text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                    {isLoading ? 'Processing...' : (activeTab === 'login' ? 'Login' : 'Register')}
                </button>
            </form>
        </div>
    );
};

export default AuthForms;

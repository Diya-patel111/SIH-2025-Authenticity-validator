import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';

// Icons for different sections
const ClockIcon = () => (
    <svg className="w-10 h-10 text-innovation-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const BrokenShieldIcon = () => (
    <svg className="w-10 h-10 text-innovation-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8zM5 15l1.5-1.5" /></svg>
);

const QuestionMarkIcon = () => (
    <svg className="w-10 h-10 text-innovation-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const UploadIcon = () => (
    <svg className="w-8 h-8 text-academic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);

const BrainIcon = () => (
    <svg className="w-8 h-8 text-academic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);

const DatabaseIcon = () => (
    <svg className="w-8 h-8 text-academic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
);

const BlockchainIcon = () => (
    <svg className="w-8 h-8 text-academic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
);


const LandingPage = () => {
    return (
        <div className="bg-clarity-white font-sans">
            <Navbar />

            {/* Hero Section */}
            <header className="bg-academic-blue text-clarity-white pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                        End Academic Fraud. <span className="text-innovation-saffron">Instantly.</span>
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
                        An AI and Blockchain-powered platform for instant, immutable verification of academic credentials.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link to="/verify" className="btn-primary w-full sm:w-auto">
                            Verify a Certificate
                        </Link>
                        <Link to="/portal" className="btn-secondary w-full sm:w-auto">
                            Access Institution Portal
                        </Link>
                    </div>
                </div>
            </header>

            {/* The Problem Section */}
            <section className="py-20 bg-clarity-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-academic-blue">The Integrity Gap in Academia</h2>
                    </div>
                    <div className="mt-12 grid md:grid-cols-3 gap-12 text-center">
                        <div className="p-8">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-academic-blue text-white mx-auto mb-4">
                                <ClockIcon />
                            </div>
                            <h3 className="text-xl font-bold text-academic-blue">Slow Manual Verification</h3>
                            <p className="mt-2 text-gray-600">Traditional methods take weeks, creating bottlenecks and delays.</p>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-academic-blue text-white mx-auto mb-4">
                               <BrokenShieldIcon />
                            </div>
                            <h3 className="text-xl font-bold text-academic-blue">Vulnerable to Fraud</h3>
                            <p className="mt-2 text-gray-600">Documents are easily forged with no immutable system to prove authenticity.</p>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-academic-blue text-white mx-auto mb-4">
                                <QuestionMarkIcon />
                            </div>
                            <h3 className="text-xl font-bold text-academic-blue">Eroding Trust</h3>
                            <p className="mt-2 text-gray-600">Employers and universities struggle to confirm if credentials are real.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-light-gray">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-academic-blue">A Seamless Path to Authenticity</h2>
                    </div>
                    <div className="relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
                        <div className="grid md:grid-cols-4 gap-8 relative">
                            <div className="text-center">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-innovation-saffron text-white mx-auto mb-4 z-10 relative">
                                    <UploadIcon />
                                </div>
                                <h3 className="text-xl font-bold text-academic-blue">1. Secure Upload</h3>
                            </div>
                             <div className="text-center">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-innovation-saffron text-white mx-auto mb-4 z-10 relative">
                                    <BrainIcon />
                                </div>
                                <h3 className="text-xl font-bold text-academic-blue">2. AI-Powered OCR</h3>
                                <p className="mt-2 text-sm text-gray-600">High-accuracy data is automatically extracted from any certificate format.</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-innovation-saffron text-white mx-auto mb-4 z-10 relative">
                                    <DatabaseIcon />
                                </div>
                                <h3 className="text-xl font-bold text-academic-blue">3. Database Cross-Reference</h3>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-innovation-saffron text-white mx-auto mb-4 z-10 relative">
                                    <BlockchainIcon />
                                </div>
                                <h3 className="text-xl font-bold text-academic-blue">4. Immutable Blockchain Verification</h3>
                                <p className="mt-2 text-sm text-gray-600">The certificate's unique hash is verified on the blockchain for tamper-proof evidence.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-academic-blue text-clarity-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Logo />
                    <p className="mt-4 text-gray-400">&copy; {new Date().getFullYear()} CertiSure. All rights reserved.</p>
                    <div className="mt-4 flex justify-center space-x-6">
                        <Link to="/portal" className="text-gray-400 hover:text-white">Institution Portal</Link>
                        <Link to="/verify" className="text-gray-400 hover:text-white">Verifier Login</Link>
                        <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

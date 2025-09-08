import React from 'react';
import Navbar from '../components/Navbar';
import AuthForms from '../components/AuthForms';
import AddCertificateForm from '../components/AddCertificateForm';
import { useAuth } from '../context/AuthContext';

const PortalPage = () => {
    const { auth, logout } = useAuth();

    return (
        <div className="min-h-screen bg-light-gray">
            {/* The Navbar will now control login/logout appearance */}
            <Navbar />

            <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {auth.token && auth.userType === 'institution' ? (
                        <AddCertificateForm />
                    ) : (
                        <AuthForms initialUserType="institution" />
                    )}
                </div>
            </main>
        </div>
    );
};

export default PortalPage;


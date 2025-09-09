
import React from 'react';
import GoogleAuthHandler from '/src/components/GoogleAuthHandler.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '/src/pages/LandingPage.jsx';
import VerifierPage from '/src/pages/VerifierPage.jsx';
import PortalPage from '/src/pages/PortalPage.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-light-gray">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify" element={<VerifierPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/google-auth-callback" element={<GoogleAuthHandler />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
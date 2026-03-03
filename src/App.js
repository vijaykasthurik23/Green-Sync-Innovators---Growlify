import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { HomePageContent } from './first';
import Navbar from './Navbar'; // Your Navbar component
import Footer from './Footer';
import Features from './features';
import Contact from './contact';
import MainAppContent from './Page';
import GardenPage from './garden';
import About from './about';
import SignupLogin from './signupLogin';
import Profile from './profile';
import Diagnose from './diagnose';
import Community from './Community'; // <-- ADDED
import AdminPanel from './AdminPanel'; // <-- ADDED Admin Panel

function App() {
  const showNavbar = true;
  // I've adjusted this padding to 110px to give your taller navbar more space
  const mainContentPaddingTop = showNavbar ? '110px' : '2rem';

  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">

        {animationsEnabled && (
          <>
            {/* === START: FIXED BUBBLE & LEAF CODE === */}
            <div className="bubble-container">
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
            </div>
            <div className="leaf-container">
              <div className="leaf">🍃</div>
              <div className="leaf">🌿</div>
              <div className="leaf">🍃</div>
              <div className="leaf">🌿</div>
              <div className="leaf">🍃</div>
              <div className="leaf">🌿</div>
            </div>
            {/* === END: FIXED BUBBLE & LEAF CODE === */}
          </>
        )}

        {showNavbar && (
          <Navbar
            animationsEnabled={animationsEnabled}
            setAnimationsEnabled={setAnimationsEnabled}
          />
        )}

        {/* Main content area */}
        <main
          className="flex-grow flex flex-col items-center justify-start px-4"
          style={{
            paddingTop: mainContentPaddingTop,
            paddingBottom: '2rem',
            position: 'relative',
            // This zIndex: 1 is correct.
            // It puts the content *above* the z-index: 0 animations.
            zIndex: 1
          }}
        >
          {/* All your pages are rendered here */}
          <Routes>
            <Route path="/" element={<HomePageContent />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<MainAppContent />} />
            <Route path="/my-garden" element={<GardenPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<SignupLogin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/diagnose" element={<Diagnose />} />
            <Route path="/community" element={<Community />} /> {/* <-- ADDED */}
            <Route path="/admin" element={<AdminPanel />} /> {/* <-- ADDED Admin Panel */}
          </Routes>
        </main>

        <Footer />

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <style>
          {`
            /* Global Imports */
            @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css");
            @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");
            @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

            /* ============================================================
            GLOBAL STYLES & VARIABLES
            ============================================================
            */
            :root {
              --background: hsl(60, 56%, 91%);
              --foreground: hsl(0, 0%, 20%);
              --card: rgb(247, 247, 227);
              --border: hsl(60, 30%, 80%);
              --primary: hsl(120, 27%, 65%);
              --primary-darker: hsl(120, 27%, 55%);
              --radius: 0.75rem;
            }

            body {
              font-family: "Inter", sans-serif;
              background-color: var(--background);
              color: var(--foreground);
            }
            
            /* ============================================================
            GLOBAL ANIMATION CSS (Bubbles, Leaves, Keyframes)
            ============================================================
            */

            .bubble-container,
            .leaf-container {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              
              /* This is the bottom layer, behind the content */
              z-index: 0; 

              overflow: hidden;
            }

            .bubble {
              position: absolute;
              bottom: -100px;
              background: radial-gradient(circle at 30% 30%, rgba(76, 175, 80, 0.3), rgba(129, 199, 132, 0.1));
              border-radius: 50%;
              animation: bubbleFloat linear infinite;
              box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.3);
            }

            .bubble:nth-child(1) { left: 10%; width: 60px; height: 60px; animation-duration: 12s; animation-delay: 0s; }
            .bubble:nth-child(2) { left: 25%; width: 40px; height: 40px; animation-duration: 15s; animation-delay: 2s; }
            .bubble:nth-child(3) { left: 40%; width: 80px; height: 80px; animation-duration: 18s; animation-delay: 4s; }
            .bubble:nth-child(4) { left: 55%; width: 50px; height: 50px; animation-duration: 14s; animation-delay: 1s; }
            .bubble:nth-child(5) { left: 70%; width: 70px; height: 70px; animation-duration: 16s; animation-delay: 3s; }
            .bubble:nth-child(6) { left: 85%; width: 45px; height: 45px; animation-duration: 13s; animation-delay: 5s; }
            .bubble:nth-child(7) { left: 15%; width: 55px; height: 55px; animation-duration: 17s; animation-delay: 6s; }
            .bubble:nth-child(8) { left: 90%; width: 35px; height: 35px; animation-duration: 19s; animation-delay: 2.5s; }

            .leaf {
              position: absolute;
              font-size: 24px;
              opacity: 0.7;
              animation: leafFloat 8s ease-in-out infinite;
            }

            .leaf:nth-child(1) { top: 10%; left: 5%; animation-delay: 0s; animation-duration: 10s; }
            .leaf:nth-child(2) { top: 30%; left: 80%; animation-delay: 2s; animation-duration: 12s; }
            .leaf:nth-child(3) { top: 50%; left: 15%; animation-delay: 4s; animation-duration: 9s; }
            .leaf:nth-child(4) { top: 70%; left: 90%; animation-delay: 1s; animation-duration: 11s; }
            .leaf:nth-child(5) { top: 20%; left: 50%; animation-delay: 3s; animation-duration: 13s; }
            .leaf:nth-child(6) { top: 60%; left: 40%; animation-delay: 5s; animation-duration: 10s; }
            
            /* ALL KEYFRAMES (Global) */
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes bubbleFloat { 0% { transform: translateY(0) translateX(0) scale(0); opacity: 0; } 10% { opacity: 0.6; transform: translateY(-10px) translateX(5px) scale(1); } 90% { opacity: 0.4; } 100% { transform: translateY(-100vh) translateX(-20px) scale(0.8); opacity: 0; } }
            @keyframes leafFloat { 0% { transform: rotate(0deg) translateX(0); opacity: 0.7; } 50% { transform: rotate(180deg) translateX(30px); opacity: 1; } 100% { transform: rotate(360deg) translateX(0); opacity: 0.7; } }
            
            @media (prefers-reduced-motion: reduce) {
              *, *::before, *::after {
                  animation-duration: 0.01ms !important;
                  animation-iteration-count: 1 !important;
                  transition-duration: 0.01ms !important;
              }
            }

            /* ============================================================
            REST OF GLOBAL CSS (from original App.js)
            ============================================================
            */
            .bg-body-tertiary {
              background-color: var(--card) !important;
            }
            .card {
              border: none;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
              border-radius: 1rem;
              background-color: var(--card);
              color: var(--card-foreground);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .card:hover {
              transform: translateY(-5px);
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            }
            /* ... etc ... */
          `}
        </style>
      </div>
    </Router>
  );
}

export default App;

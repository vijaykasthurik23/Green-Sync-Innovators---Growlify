import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

// Accept the animation props from App.js
const Navbar = ({ animationsEnabled, setAnimationsEnabled }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // This handler uses the prop from App.js to change the state
  const handleToggle = () => {
    setAnimationsEnabled(!animationsEnabled);
  };

  const currentPagePath = location.pathname;

  const navClasses = [
    'navbar',
    'navbar-expand-lg',
    'py-3',
    'fixed-top',
    (scrolled || ['/my-garden', '/diagnose', '/auth'].includes(currentPagePath)) && 'scrolled',
    ['/my-garden', '/diagnose', '/auth'].includes(currentPagePath) && 'no-blur',
  ].filter(Boolean).join(' ');

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileNavbar = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={navClasses}>
        <div className="container">
          <Link className="navbar-brand p-0 border-0" to="/" onClick={closeMobileNavbar}>
            <img src="logo1.png" alt="Growlify Logo" style={{ height: '80px', width: 'auto' }} />
          </Link>
          <button
            className={`navbar-toggler ${mobileMenuOpen ? 'open' : ''}`}
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <img
                src="https://img.icons8.com/ios/50/000000/delete-sign--v1.png"
                alt="close menu"
                style={{ width: '28px', height: '28px' }}
              />
            ) : (
              <img
                src="https://img.icons8.com/?size=100&id=3095&format=png&color=000000"
                alt="menu"
                style={{ width: '28px', height: '28px' }}
              />
            )}
          </button>

          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarNav">
            {location.pathname.startsWith('/admin') ? (
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <span className="nav-link d-flex align-items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#105224' }}>
                    <i className="bi bi-shield-lock-fill"></i>
                    Admin Portal
                  </span>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav navbar-nav-center">
                <li className="nav-item">
                  <NavLink to="/" className="nav-link" end onClick={closeMobileNavbar}>
                    <i className="bi bi-house-door mobile-icon"></i>
                    <span>Home</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/features" className="nav-link" onClick={closeMobileNavbar}>
                    <i className="bi bi-stars mobile-icon"></i>
                    <span>Features</span>
                  </NavLink>
                </li>

                {/* ADDED: Community link */}
                <li className="nav-item">
                  <NavLink to="/community" className="nav-link" onClick={closeMobileNavbar}>
                    <i className="bi bi-people mobile-icon"></i>
                    <span>Community</span>
                  </NavLink>
                </li>
                {/* END ADDED */}

                <li className="nav-item">
                  <NavLink to="/about" className="nav-link" onClick={closeMobileNavbar}>
                    <i className="bi bi-info-circle mobile-icon"></i>
                    <span>About Us</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/shop" className="nav-link" onClick={closeMobileNavbar}>
                    <i className="bi bi-cart mobile-icon"></i>
                    <span>Shop</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/my-garden" className="nav-link" onClick={closeMobileNavbar}>
                    <i className="bi bi-flower1 mobile-icon"></i>
                    <span>My Garden</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contact" className="nav-link" onClick={closeMobileNavbar}>
                    <i className="bi bi-envelope mobile-icon"></i>
                    <span>Contact</span>
                  </NavLink>
                </li>
              </ul>
            )}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item profile-icon-container" ref={profileRef}>
                <button
                  className="nav-link profile-btn"
                  onClick={() => setShowProfileDropdown(prev => !prev)}
                >
                  <i className="bi bi-person-circle"></i>
                  <span className="profile-text">Profile</span>
                </button>
                {showProfileDropdown && (
                  <div className="profile-dropdown">
                    <div className="dropdown-title">My Account</div>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        closeMobileNavbar();
                      }}
                    >
                      <i className="bi bi-person mobile-icon"></i>
                      Profile
                    </Link>
                    <Link
                      to="/auth"
                      className="dropdown-item"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        closeMobileNavbar();
                      }}
                    >
                      <i className="bi bi-box-arrow-in-right mobile-icon"></i>
                      Login / Sign Up
                    </Link>
                    <Link
                      to="/"
                      className="dropdown-item logout-item"
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('signupCity');
                        localStorage.removeItem('userInfo');
                        localStorage.removeItem('adminLoggedIn');
                        setShowProfileDropdown(false);
                        closeMobileNavbar();
                      }}
                    >
                      <i className="bi bi-box-arrow-right mobile-icon"></i>
                      Logout
                    </Link>
                  </div>
                )}
              </li>

              <li className="nav-item">
                <button
                  onClick={handleToggle}
                  className={`animation-toggle ${animationsEnabled ? 'toggled-on' : ''}`}
                  title={animationsEnabled ? 'Disable Animations' : 'Enable Animations'}
                >
                  <span className="animation-toggle-label">
                    <i className="bi bi-stars mobile-icon"></i>
                    Animations
                  </span>
                  <div className="animation-toggle-switch"></div>
                </button>
              </li>

            </ul>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileNavbar}></div>}
      </nav>

      <style>
        {`
/* --- Enhanced Mobile-First Navbar Styles --- */
:root {
  --background: hsl(60, 56%, 91%);
  --foreground: hsl(0, 0%, 20%);
  --card: rgb(247, 247, 227);
  --border: hsl(60, 30%, 80%);
  --primary: hsl(120, 27%, 65%);
  --primary-darker: hsl(120, 27%, 55%);
  --primary-lighter: hsl(120, 30%, 85%);
  --muted: hsl(60, 30%, 88%);
  --radius: 0.75rem;
  --nav-height: 80px;
  --primary-gradient: linear-gradient(90deg, 
    hsl(120, 27%, 65%) 0%, 
    hsl(120, 27%, 55%) 100%
  );
  --primary-gradient-animated: linear-gradient(90deg, 
    hsl(120, 27%, 65%) 0%, 
    hsl(120, 27%, 55%) 50%,
    hsl(120, 27%, 65%) 100%
  );
}

/* 1. Navbar Container */
.fixed-top {
  background-color: hsla(60, 56%, 93%, 0.75);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid transparent;
  background-clip: padding-box;
  border-image: linear-gradient(90deg, 
    hsla(60, 30%, 80%, 0.1), 
    hsla(60, 30%, 80%, 0.6), 
    hsla(60, 30%, 80%, 0.1)
  ) 1;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 1050;
}
.fixed-top.no-blur {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background-color: hsla(60, 56%, 93%, 0.98);
}

/* 2. Logo */
.navbar-brand {
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  z-index: 1052;
}
.navbar-brand:hover {
  transform: scale(1.05) rotateZ(-2deg);
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

/* 3. Centered Nav */
.navbar-nav-center {
  margin-left: auto;
  margin-right: auto;
  flex-grow: 1;
  justify-content: center;
}

/* 4. Desktop Nav Link (Inactive State) */
.navbar-nav .nav-link {
  border-radius: var(--radius);
  font-size: 1.1rem;
  color: var(--foreground);
  font-weight: 600;
  background-color: transparent;
  padding: 0.6rem 1.25rem;
  margin: 0 0.25rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  box-shadow: none;
  transform: translateY(0);
}

/* Hide mobile icons on desktop */
.mobile-icon {
  display: none;
}

/* 5. Active Nav Link (Clicked State) */
.navbar-nav .nav-link.active {
  font-weight: 700;
  color: white;
  background: var(--primary-gradient-animated);
  background-size: 200% 200%;
  animation: gradientShimmer 3s ease infinite;
  transform: scale(1.05) translateY(-1px);
  box-shadow: 0 4px 15px hsla(120, 27%, 55%, 0.6);
  border-color: transparent;
}

@keyframes gradientShimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 6. Hover for Non-Active Links */
.navbar-nav .nav-link:not(.active):hover {
  background-color: hsla(0, 0%, 100%, 0.5);
  color: var(--foreground);
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  border-color: hsla(0, 0%, 100%, 0.8);
}

/* 7. Profile Icon */
.profile-icon-container {
  position: relative;
  margin-left: 1.5rem;
}
.profile-icon-container button.nav-link {
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 50px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  color: var(--foreground);
  animation: pulseGlow 2s infinite ease-in-out;
  background-color: transparent;
  box-shadow: none;
}

.profile-text {
  display: none;
}

@keyframes pulseGlow {
  0% { box-shadow: 0 0 0 0 hsla(120, 27%, 65%, 0.4); color: var(--foreground); }
  70% { box-shadow: 0 0 0 10px hsla(120, 27%, 65%, 0); color: var(--primary-darker); }
  100% { box-shadow: 0 0 0 0 hsla(120, 27%, 65%, 0); color: var(--foreground); }
}

.profile-icon-container button.nav-link:hover {
  background-color: var(--primary);
  color: white;
  transform: scale(1.1) rotateZ(10deg);
  border-color: var(--primary-darker);
  animation-play-state: paused;
}

.profile-icon-container button.nav-link i {
  font-size: 1.5rem;
}

/* 8. Profile Dropdown */
.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--card);
  border: 1px solid var(--primary-darker);
  border-radius: var(--radius);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 1051;
  padding: 0.5rem;
  text-align: left;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInDropdown 0.3s ease forwards;
  pointer-events: none;
}

@keyframes fadeInDropdown {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(5px); pointer-events: auto; }
}
.profile-dropdown .dropdown-title {
  padding: 0.75rem 1rem;
  font-weight: 700;
  color: var(--foreground);
  border-bottom: 1px solid var(--border);
  margin-bottom: 0.25rem;
}

/* 9. Dropdown Items */
.profile-dropdown .dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--foreground);
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 600;
  border-radius: 0.3rem;
  transition: all 0.2s ease;
  position: relative;
  background: transparent;
}
.profile-dropdown .dropdown-item:hover {
  color: white;
  font-weight: 700;
  transform: translateX(5px);
  background: var(--primary-gradient);
  box-shadow: 0 2px 8px hsla(120, 27%, 55%, 0.4);
}
.profile-dropdown .dropdown-item.logout-item:hover {
  background: linear-gradient(90deg, hsl(0, 80%, 90%), hsl(0, 70%, 80%));
  color: hsl(0, 70%, 50%);
  font-weight: 700;
}

.navbar-nav .nav-item {
  display: flex;
  align-items: center;
}

/* 10. Animated Mobile Toggler */
.navbar-toggler {
  border: none;
  padding: 0.5rem;
  font-size: 1.5rem;
  transition: transform 0.3s ease;
  z-index: 1052;
  background: rgba(255, 255, 255, 0.9);
  width: 48px;
  height: 48px;
  display: none; /* Hidden by default on desktop */
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.navbar-toggler:focus {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  outline: none;
}
.navbar-toggler:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}
.navbar-toggler-icon {
  background-image: none;
  position: relative;
  width: 26px;
  height: 20px;
  display: inline-block;
}
.navbar-toggler-icon span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: var(--foreground); /* <-- MAKE SURE THIS IS PRESENT */
  border-radius: 3px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: all 0.35s cubic-bezier(0.1, 0.7, 0.3, 1);
}
.navbar-toggler-icon span:nth-child(1) { 
  top: 0px; 
  transform-origin: center;
}
.navbar-toggler-icon span:nth-child(2) { 
  top: 8.5px; 
  transform-origin: center;
}
.navbar-toggler-icon span:nth-child(3) { 
  top: 17px; 
  transform-origin: center;
}

.navbar-toggler.open .navbar-toggler-icon span:nth-child(1) {
  transform: rotate(45deg);
  top: 8.5px;
}
.navbar-toggler.open .navbar-toggler-icon span:nth-child(2) {
  opacity: 0;
  transform: translateX(-30px);
}
.navbar-toggler.open .navbar-toggler-icon span:nth-child(3) {
  transform: rotate(-45deg);
  top: 8.5px;
}

/* Toggle Switch Styles (Desktop) */
.animation-toggle {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
  margin-left: 1rem;
  display: flex;
  align-items: center;
  border-radius: 0;
  cursor: pointer;
}

.animation-toggle:hover {
  background: transparent;
  transform: none;
  box-shadow: none;
}

.animation-toggle-label {
  display: none;
}

.animation-toggle-switch {
  position: relative;
  width: 50px;
  height: 28px;
  background-color: var(--muted);
  border-radius: 50px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--border);
}

.animation-toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 3px;
  width: 22px;
  height: 22px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.animation-toggle.toggled-on .animation-toggle-switch {
  background-color: var(--primary);
  border-color: var(--primary-darker);
}

.animation-toggle.toggled-on .animation-toggle-switch::after {
  transform: translateX(21px);
}

/* Mobile Overlay */
.mobile-overlay {
  display: none;
}

/* CRITICAL: Hide navbar menu on mobile by default */
@media (max-width: 991.98px) {
  .navbar-collapse {
    display: none !important;
  }
  
  .navbar-collapse.show {
    display: block !important;
  }
  
  .navbar-toggler {
    display: flex !important;
  }
}

/* ===================================
   MOBILE RESPONSIVE STYLES
   =================================== */
@media (max-width: 991.98px) {
  
  /* Show mobile icons */
  .mobile-icon {
    display: inline-block;
    margin-right: 0.75rem;
    font-size: 1.3rem;
    transition: transform 0.3s ease;
  }

  /* Mobile Overlay */
  .mobile-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 1049;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Center nav items */
  .navbar-nav-center {
    justify-content: flex-start;
    margin-left: 0;
    margin-right: 0;
  }

  /* Mobile menu sliding drawer */
  .navbar-collapse {
    position: fixed;
    top: 0;
    right: -100%;
    width: 85%;
    max-width: 380px;
    height: 100vh;
    background: linear-gradient(135deg, var(--card) 0%, hsl(60, 50%, 95%) 100%);
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    padding: 1.5rem 0;
    overflow-y: auto;
    overflow-x: hidden;
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1051;
  }
  
  .navbar-collapse.show {
    right: 0;
  }

  /* Stagger animation for nav items */
  .navbar-collapse.show .nav-item {
    animation: slideInRight 0.4s ease forwards;
    opacity: 0;
  }

  .navbar-collapse.show .nav-item:nth-child(1) { animation-delay: 0.05s; }
  .navbar-collapse.show .nav-item:nth-child(2) { animation-delay: 0.1s; }
  .navbar-collapse.show .nav-item:nth-child(3) { animation-delay: 0.15s; }
  .navbar-collapse.show .nav-item:nth-child(4) { animation-delay: 0.2s; }
  .navbar-collapse.show .nav-item:nth-child(5) { animation-delay: 0.25s; }
  .navbar-collapse.show .nav-item:nth-child(6) { animation-delay: 0.3s; }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Mobile nav links - touch-friendly */
  .navbar-nav .nav-link {
    font-size: 1.1rem;
    font-weight: 500;
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid hsla(60, 30%, 80%, 0.3);
    border-radius: 0;
    transform: none;
    background-color: transparent;
    color: var(--foreground);
    box-shadow: none;
    margin: 0;
    display: flex;
    align-items: center;
    min-height: 56px;
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
  }

  .navbar-nav .nav-link:last-child {
    border-bottom: none;
  }

  /* Active state for mobile */
  .navbar-nav .nav-link.active {
    background: var(--primary-gradient);
    color: white;
    font-weight: 700;
    animation: none;
    box-shadow: inset 4px 0 0 var(--primary-darker);
    border-color: transparent;
    transform: none;
  }

  .navbar-nav .nav-link.active .mobile-icon {
    transform: scale(1.2);
    animation: bounce 0.6s ease;
  }

  @keyframes bounce {
    0%, 100% { transform: scale(1.2) translateY(0); }
    50% { transform: scale(1.2) translateY(-5px); }
  }

  /* Hover state for mobile */
  .navbar-nav .nav-link:not(.active):hover {
    background-color: hsla(120, 27%, 65%, 0.1);
    color: var(--primary-darker);
    transform: translateX(5px);
    box-shadow: none;
    border-color: transparent;
  }

  .navbar-nav .nav-link:not(.active):hover .mobile-icon {
    transform: scale(1.1) rotate(5deg);
  }

  /* Active tap effect */
  .navbar-nav .nav-link:active {
    background-color: hsla(120, 27%, 65%, 0.2);
    transform: translateX(8px) scale(0.98);
  }

  /* Profile section in mobile */
  .profile-icon-container {
    margin-left: 0;
    width: 100%;
    margin-top: 0.5rem;
    border-top: 2px solid var(--border);
    padding-top: 1rem;
  }

  .profile-icon-container button.nav-link {
    width: 100%;
    border-radius: 0;
    font-size: 1.1rem;
    font-weight: 600;
    text-align: left;
    padding: 1rem 1.5rem;
    justify-content: flex-start;
    border-bottom: 1px solid hsla(60, 30%, 80%, 0.3);
    animation: none;
    color: var(--foreground);
    background: transparent;
    height: auto;
    min-height: 56px;
  }

  .profile-icon-container button.nav-link i {
    font-size: 1.3rem;
    margin-right: 0.75rem;
  }

  .profile-text {
    display: inline;
  }

  .profile-icon-container button.nav-link:hover {
    transform: translateX(5px);
    background-color: hsla(120, 27%, 65%, 0.1);
    border-color: transparent;
    color: var(--primary-darker);
  }

  /* Profile dropdown in mobile - inline expansion */
  .profile-dropdown {
    position: static;
    width: 100%;
    border: none;
    box-shadow: none;
    transform: translateY(0);
    padding: 0;
    border-radius: 0;
    animation: expandDown 0.3s ease;
    opacity: 1;
    pointer-events: auto;
    background: hsla(120, 27%, 95%, 0.5);
    backdrop-filter: none;
    margin-top: 0;
  }

  @keyframes expandDown {
    from {
      max-height: 0;
      opacity: 0;
    }
    to {
      max-height: 300px;
      opacity: 1;
    }
  }

  .profile-dropdown .dropdown-title {
    display: none;
  }

  .profile-dropdown .dropdown-item {
    padding: 1rem 1.5rem 1rem 3rem;
    border-bottom: 1px solid hsla(60, 30%, 80%, 0.3);
    border-radius: 0;
    min-height: 56px;
    display: flex;
    align-items: center;
    font-size: 1rem;
  }

  .profile-dropdown .dropdown-item:last-child {
    border-bottom: none;
  }

  .profile-dropdown .dropdown-item:hover {
    transform: translateX(5px);
    background: hsla(120, 27%, 65%, 0.15);
    color: var(--primary-darker);
  }

  .profile-dropdown .dropdown-item.logout-item:hover {
    background: hsla(0, 70%, 90%, 0.8);
    color: hsl(0, 70%, 50%);
  }

  /* Animation toggle in mobile */
  .animation-toggle {
    width: 100%;
    border-radius: 0;
    font-size: 1.1rem;
    font-weight: 600;
    text-align: left;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: none;
    margin-left: 0;
    min-height: 56px;
    margin-top: 0.5rem;
    border-top: 2px solid var(--border);
    padding-top: 1.5rem;
  }

  .animation-toggle-label {
    display: flex;
    align-items: center;
    color: var(--foreground);
    font-weight: 600;
  }

  .animation-toggle-switch {
    margin: 0;
    flex-shrink: 0;
  }

  .animation-toggle:hover {
    background-color: hsla(120, 27%, 65%, 0.1);
    color: var(--foreground);
  }

  .animation-toggle:active {
    background-color: hsla(120, 27%, 65%, 0.2);
    transform: scale(0.98);
  }

  /* Smooth scrolling for mobile menu */
  .navbar-collapse::-webkit-scrollbar {
    width: 6px;
  }

  .navbar-collapse::-webkit-scrollbar-track {
    background: transparent;
  }

  .navbar-collapse::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 10px;
  }
}

/* Extra small devices optimization */
@media (max-width: 575.98px) {
  .navbar-collapse {
    width: 90%;
  }

  .navbar-brand img {
    height: 60px !important;
  }

  .navbar-nav .nav-link {
    font-size: 1rem;
    padding: 0.875rem 1.25rem;
    min-height: 52px;
  }

  .mobile-icon {
    font-size: 1.2rem;
    margin-right: 0.65rem;
  }

  .profile-icon-container button.nav-link,
  .animation-toggle {
    font-size: 1rem;
    padding: 0.875rem 1.25rem;
    min-height: 52px;
  }

  .profile-dropdown .dropdown-item {
    font-size: 0.95rem;
    padding: 0.875rem 1.25rem 0.875rem 2.75rem;
    min-height: 52px;
  }
}

/* Landscape mobile optimization */
@media (max-width: 991.98px) and (max-height: 500px) {
  .navbar-collapse {
    padding: 1rem 0;
  }

  .navbar-nav .nav-link,
  .profile-icon-container button.nav-link,
  .animation-toggle {
    padding: 0.75rem 1.25rem;
    min-height: 48px;
    font-size: 0.95rem;
  }

  .mobile-icon {
    font-size: 1.1rem;
  }

  .profile-icon-container,
  .animation-toggle {
    margin-top: 0.25rem;
    padding-top: 1rem;
  }
}

/* Tablet optimization */
@media (min-width: 576px) and (max-width: 991.98px) {
  .navbar-collapse {
    width: 400px;
    max-width: 400px;
  }

  .navbar-nav .nav-link {
    font-size: 1.15rem;
    padding: 1.1rem 1.75rem;
  }

  .mobile-icon {
    font-size: 1.4rem;
  }
}

/* Prevent text selection on mobile menu */
@media (max-width: 991.98px) {
  .navbar-nav .nav-link,
  .animation-toggle,
  .profile-icon-container button {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .navbar-collapse,
  .navbar-toggler-icon span,
  .nav-link,
  .animation-toggle-switch::after {
    transition: none;
    animation: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .navbar-nav .nav-link {
    border: 2px solid currentColor;
  }

  .navbar-nav .nav-link.active {
    background: var(--foreground);
    color: var(--background);
  }
}
        `}
      </style>
    </>
  );
};

export default Navbar;

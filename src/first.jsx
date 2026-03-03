import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from "lottie-react"; 
import animationData from "./ani.json"; 

// Floating particles component (Unchanged)
const FloatingParticles = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            backgroundColor: `rgba(40, 167, 69, ${Math.random() * 0.3 + 0.1})`,
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-${i % 3} ${Math.random() * 15 + 10}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
};

// UPDATED COMPONENT USING 'lottie-react'
const GrowingPlantLottie = ({ delay = 0 }) => (
  <motion.div
    // Framer Motion still handles the initial "pop-in"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      delay: delay,
      type: 'spring',
      stiffness: 260,
      damping: 20,
    }}
    style={{
      width: '100px', // Set a size for the container
      height: '100px',
    }}
  >
    {/* Use the Lottie component with 'animationData' prop */}
    <Lottie 
      animationData={animationData}
      loop={true}
      speed={3} // Kept the speed at 3
    />
  </motion.div>
);


const HomePageContent = () => {
  const [isVisible, setIsVisible] = useState({});
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ... (all your existing, correct CSS) ... */
        @keyframes float-0 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -30px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-25px, 35px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 25px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes leafSway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-on-scroll {
          opacity: 0;
        }
        .animate-on-scroll.visible {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .card-hover-effect {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        .card-hover-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(40, 167, 69, 0.1), transparent);
          transition: left 0.5s;
        }
        .card-hover-effect:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(40, 167, 69, 0.2) !important;
        }
        .card-hover-effect:hover::before {
          left: 100%;
        }
        .plant-icon-container {
          animation: leafSway 3s ease-in-out infinite;
        }
        .emoji-bounce {
          display: inline-block;
          animation: bounce 2s ease-in-out infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .shimmer-effect {
          background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        .feature-card {
          transition: all 0.3s ease;
        }
        .feature-card img {
          transition: transform 0.5s ease;
        }
        .feature-card:hover img {
          transform: scale(1.1) rotate(2deg);
        }
        .cta-button {
          position: relative;
          overflow: hidden;
        }
        .cta-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .cta-button:hover::after {
          width: 300px;
          height: 300px;
        }
        .hero-gradient {
          background: linear-gradient(135deg, rgba(40, 167, 69, 0.05) 0%, rgba(32, 201, 151, 0.05) 100%);
        }
      `}</style>

      <FloatingParticles />

      {/* Hero Section */}
      <header className="container text-center py-5 section-padding hero-gradient" id="home" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="d-flex justify-content-center align-items-center mb-4" style={{ animation: 'fadeInScale 1s ease-out' }}>
              <div className="plant-icon-container">
                <i className="bi bi-tree text-dark-green me-3" style={{ fontSize: '3rem', color: '#28a745' }}></i>
              </div>
              <h1 className="display-4 fw-bold mb-0 gradient-text">Grow Smarter, Live Greener</h1>
            </div>
            <p className="lead mb-4" style={{ animation: 'fadeInUp 1s ease-out 0.3s backwards' }}>
              Growlify helps city residents grow their own vegetables, herbs, and plants at home using AI-based personalized tips, care schedules, and plant health support.
            </p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center" style={{ animation: 'fadeInUp 1s ease-out 0.6s backwards' }}>
              <Link to="/my-garden" className="btn btn-lg cta-button" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', position: 'relative', zIndex: 2 }}>
                Get Started
              </Link>
              <Link to="/about" className="btn btn-lg btn-outline-success">Learn How It Works</Link>
            </div>
            
            {/* 4. USING THE UPDATED COMPONENT */}
            <div className="mt-5 d-flex justify-content-center gap-4">
              <GrowingPlantLottie delay={0.8} />
              <GrowingPlantLottie delay={1.2} />
              <GrowingPlantLottie delay={1.6} />
            </div>

          </div>
        </div>
      </header>

      {/* ... (Rest of your page, all unchanged) ... */}
      {/* Why Urban Farming? Section */}
      <section 
        className="container text-center py-5 section-padding" 
        id="why-urban-farming" 
        data-animate
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h2 className="mb-5 display-5 fw-bold gradient-text">
          Why Urban Farming?
        </h2>
        <div className="row justify-content-center g-4">
          {[
            { emoji: '🌃', title: 'Fresher Food', text: 'Enjoy nutritious, pesticide-free produce grown by you.', delay: '0.1s' },
            { emoji: '🏙️', title: 'Greener Cities', text: 'Contribute to a more sustainable urban environment.', delay: '0.3s' },
            { emoji: '💖', title: 'Mindful Hobby', text: 'Connect with nature and reduce stress through gardening.', delay: '0.5s' }
          ].map((item, idx) => (
            <div key={idx} className="col-md-4">
              <div 
                className={`card h-100 p-4 card-hover-effect animate-on-scroll ${isVisible['why-urban-farming'] ? 'visible' : ''}`}
                style={{ 
                  animationDelay: item.delay,
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  borderRadius: '15px'
                }}
              >
                <div className="card-body">
                  <span className="emoji-bounce" role="img" aria-label={`${item.title}-emoji`} style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>
                    {item.emoji}
                  </span>
                  <h5 className="card-title fw-bold">{item.title}</h5>
                  <p className="card-text">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Powerful Features Section */}
      <section 
        className="container text-center py-5 section-padding" 
        id="features-section"
        data-animate
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h2 className="mb-5 display-5 fw-bold gradient-text">
          Powerful Features at Your Fingertips
        </h2>
        <div className="row justify-content-center g-4">
          {[
            { img: 'img1.jpg', title: 'AI Plant Diagnosis', text: 'Upload a photo and get instant health insights.', delay: '0.2s' },
            { img: 'img2.jpg', title: 'Personalized Care', text: 'Tailored advice for your specific plants and space.', delay: '0.4s' },
            { img: 'img4.png', title: 'Watering Reminders', text: 'Never miss a watering session again.', delay: '0.6s' }
          ].map((item, idx) => (
            <div key={idx} className="col-md-4">
              <div 
                className={`card h-100 feature-card card-hover-effect animate-on-scroll ${isVisible['features-section'] ? 'visible' : ''}`}
                style={{ 
                  animationDelay: item.delay,
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  height: '200px', 
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {/* --- 📸 IMAGE FIX HERE --- */}
                  <img src={item.img} alt={item.title} style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} />
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{item.title}</h5>
                  <p className="card-text">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* --- ✨ BUTTON FIX HERE --- */}
        <div className="mt-5 d-flex justify-content-center">
          <Link 
            to="/features" 
            className="btn fw-bold" // Removed btn-link
            style={{ 
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: '#fff',
              borderRadius: '50px',
              padding: '12px 30px',
              fontSize: '1.1rem',
              textDecoration: 'none',
              boxShadow: '0 5px 15px rgba(40, 167, 69, 0.3)',
              transition: 'all 0.3s ease',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 20px rgba(40, 167, 69, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.3)';
            }}
          >
            See All Features →
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        className="container text-center py-5 section-padding" 
        id="testimonials"
        data-animate
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h2 className="mb-5 display-5 fw-bold gradient-text">
          Loved by Urban Gardeners
        </h2>
        <div className="row justify-content-center g-4">
          {[
            { quote: "Growlify made my balcony garden thrive! The AI diagnosis is a lifesaver.", author: "Sarah L.", delay: '0.2s' },
            { quote: "Finally, a gardening app that understands city living. Highly recommend!", author: "Mike P.", delay: '0.4s' }
          ].map((item, idx) => (
            <div key={idx} className="col-md-6">
              <div 
                className={`card h-100 p-4 card-hover-effect animate-on-scroll ${isVisible['testimonials'] ? 'visible' : ''}`}
                style={{ 
                  animationDelay: item.delay,
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  borderRadius: '15px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                }}
              >
                <div className="card-body d-flex align-items-start text-start">
                  <i className="bi bi-chat-quote-fill me-3" style={{ fontSize: '1.5rem', opacity: 0.7, color: '#28a745' }}></i>
                  <div>
                    <p className="lead mb-2">{item.quote}</p>
                    <p className="fw-bold mb-0" style={{ color: '#28a745' }}>{item.author}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section 
        className="py-5 section-padding text-center rounded-4" 
        id="call-to-action"
        style={{ 
          background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
          position: 'relative',
          zIndex: 1,
          margin: '0 auto',
          maxWidth: '1200px'
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <h2 className="mb-4 display-5 fw-bold gradient-text" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
                Ready to Start Your Urban Garden?
              </h2>
              <p className="lead mb-5">
                Join Growlify today and transform your urban space into a green oasis.
              </p>
              <Link
                to="/auth"
                className="btn rounded-pill fw-semibold cta-button"
                style={{
                  backgroundColor: '#28a745',
                  color: '#fff',
                  padding: '15px 40px',
                  fontSize: '18px',
                  boxShadow: '0 10px 30px rgba(40, 167, 69, 0.3)',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  display: 'inline-block',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#218838';
                  e.target.style.boxShadow = '0 15px 40px rgba(40, 167, 69, 0.4)';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#28a745';
                  e.target.style.boxShadow = '0 10px 30px rgba(40, 167, 69, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const GrowlifyAppContent = ({ children }) => {
  return <>{children}</>;
};

export default GrowlifyAppContent;
export { HomePageContent };
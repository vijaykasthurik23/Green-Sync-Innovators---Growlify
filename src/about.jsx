import React from 'react';

function About({ onNavigate }) {
  return (
    <div className="min-h-screen font-sans">
      <style>
        {`
          /* Component-specific styles for About.js */
          :root {
              --section-bg: #F0EFEA;
              --text-dark: #1f1f1f;
              --text-medium: #333333;
              --text-light: #5A5A5A;
              --primary-accent: #4CAF50;
              --light-accent: #E6F0E6;
              --hover-box: #fffde7;
              --mission-bg-color: var(--hover-box);
              --card: rgb(247, 247, 227);
              --border: hsl(60, 30%, 80%);
          }

          /* --- All Keyframes needed by THIS page --- */
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes fadeInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
          @keyframes rotateGlow { 0% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.3), 0 0 40px rgba(76, 175, 80, 0.2); } 50% { box-shadow: 0 0 30px rgba(76, 175, 80, 0.5), 0 0 60px rgba(76, 175, 80, 0.3); } 100% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.3), 0 0 40px rgba(76, 175, 80, 0.2); } }
          @keyframes plantGrow { 0% { transform: scaleY(0); transform-origin: bottom; } 50% { transform: scaleY(1.1); } 100% { transform: scaleY(1); } }
          @keyframes sparkle { 0%, 100% { opacity: 0; transform: scale(0); } 50% { opacity: 1; transform: scale(1); } }
          @keyframes wave { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
          @keyframes heroPulse {
            0%, 100% { box-shadow: 0 0 30px rgba(76, 175, 80, 0.4), 0 0 10px rgba(76, 175, 80, 0.2); }
            50% { box-shadow: 0 0 50px rgba(76, 175, 80, 0.7), 0 0 20px rgba(76, 175, 80, 0.5); }
          }
          @keyframes simplePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
          }
          /* --- END KEYFRAMES --- */


          /* Headings */
          h1, h2, h3, h4, h5, h6 {
            color: var(--text-dark);
            font-weight: 600;
            animation: fadeInUp 0.8s ease-out;
            position: relative;
          }

          .lead {
            color: var(--text-medium);
            animation: fadeInUp 0.8s ease-out 0.2s backwards;
          }

          /* --- ICON CIRCLE (Keeping extreme style) --- */
          .icon-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--light-accent), rgba(76, 175, 80, 0.15));
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--primary-accent);
            margin: 0 auto 1.5rem auto;
            font-size: 2.5rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            animation: scaleIn 0.6s ease-out, 
                         float 3s ease-in-out infinite 1s, 
                         heroPulse 2s ease-in-out infinite 1.5s;
          }
          
          .icon-circle::before {
            content: '';
            position: absolute;
            inset: -3px;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--primary-accent), #81C784, var(--primary-accent));
            opacity: 0;
            transition: opacity 0.4s;
            z-index: -1;
            animation: rotateGlow 3s linear infinite;
          }
          .icon-circle:hover::before { opacity: 1; }
          .icon-circle:hover {
            transform: scale(1.15) rotate(10deg);
            box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
            animation-play-state: paused;
          }

          /* --- ADJUSTED IMAGE STYLE FOR CHALLENGE/SOLUTION --- */
          .img-fluid-rounded {
            border-radius: 16px;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            animation: fadeInLeft 0.8s ease-out;
            position: relative;
            max-width: 100%;
            height: auto;
          }

          .img-fluid-rounded::after {
            content: '🌱';
            position: absolute;
            top: -20px;
            right: -20px;
            font-size: 40px;
            opacity: 0;
            transition: all 0.4s;
            animation: wave 2s ease-in-out infinite;
          }

          .img-fluid-rounded:hover::after {
            opacity: 1;
          }

          .img-fluid-rounded:hover {
            transform: scale(1.05) rotate(1deg);
            box-shadow: 0 20px 50px rgba(76, 175, 80, 0.2);
          }
          
          /* Animation for the text content column */
          .content-text {
            animation: fadeInRight 0.8s ease-out;
          }

          /* --- REVERTED & SMALLER MISSION SECTION --- */
          .mission-section {
            border-radius: 24px;
            padding: 3rem 2rem; /* <-- SMALLER PADDING */
            position: relative;
            overflow: hidden;
            background: var(--card);
            box-shadow: 0 0 60px rgba(76, 175, 80, 0.3);
            transition: all 0.3s ease;
          }
          .mission-section:hover {
            box-shadow: 0 0 80px rgba(76, 175, 80, 0.5);
            transform: translateY(-3px);
          }
          .mission-section > * {
            position: relative;
            z-index: 1;
          }
          .emoji-float {
            display: inline-block;
            animation: simplePulse 2.5s ease-in-out infinite; 
            font-size: 4rem; /* <-- SMALLER EMOJI */
            filter: drop-shadow(0 5px 15px rgba(76, 175, 80, 0.3));
          }
          .mission-text {
            color: var(--text-dark);
            font-size: 1.25rem; /* <-- SMALLER FONT */
            font-weight: 500;
            line-height: 1.7;
            text-shadow: none;
          }

          .text-secondary {
            color: var(--text-light);
            font-size: 1.125rem;
            line-height: 1.8;
            animation: fadeInUp 0.8s ease-out 0.3s backwards;
          }
          
          .display-5 {
            font-size: 2.75rem;
            background: linear-gradient(135deg, var(--text-dark), var(--primary-accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 20px rgba(76, 175, 80, 0.2);
          }

          /* Section (Keeping for general sections) */
          section {
            transition: transform 0.3s ease;
            position: relative;
            z-index: 2;
          }

          /* --- REVERTED "START YOUR GARDEN" BUTTON --- */
          .btn-cta-normal {
            background-color: var(--primary-accent);
            color: white;
            border: none;
            padding: 0.75rem 1.75rem;
            border-radius: 0.5rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            margin-top: 1.5rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }
          .btn-cta-normal::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
          }
          .btn-cta-normal:hover::before {
            left: 100%;
          }
          .btn-cta-normal:hover {
            background-color: var(--primary-darker);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          .btn-cta-normal .bi {
            transition: transform 0.3s ease;
          }
          .btn-cta-normal:hover .bi {
            transform: translateX(5px);
          }

          @media (min-width: 768px) {
            .mission-section {
              padding: 3.5rem 3rem; /* <-- SMALLER PADDING */
            }
          }
        `}
      </style>

      {/* HTML Content for About Page */}
      <div className="container my-5 px-4">
        
        <section id="home" className="text-center my-5 py-5">
          <div className="icon-circle">
            <i className="bi bi-info-circle"></i>
          </div>
          <h1 className="display-5 fw-bold">Why We Built Growlify</h1>
          <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
            Our journey to simplify urban farming for everyone.
          </p>
        </section>

        {/* === CHALLENGE SECTION === */}
        <section id="features" className="row align-items-center my-5 py-4">
          <div className="col-md-6 mb-4 mb-md-0 d-flex justify-content-center">
            {/* --- BIGGER IMAGE --- */}
            <img src="abt1.png" alt="City Gardening Challenge" className="img-fluid-rounded" style={{ maxWidth: '450px' }} />
          </div>
          <div className="col-md-6 content-text">
            <h2 className="fs-3 fw-bold">The Challenge of City Gardening</h2>
            <p className="text-secondary">
              Millions of people in urban areas dream of growing their own food, cultivating vibrant plants, or simply adding a touch of green to their concrete surroundings. However, many don't know where to start. Limited space, lack of traditional gardening knowledge, and the unique challenges of an urban environment can feel overwhelming.
            </p>
            <p className="text-secondary">
              That's where Growlify AI comes in. We believe that everyone deserves the joy and benefits of gardening—no matter where they live.
            </p>
          </div>
        </section>

        {/* === SOLUTION SECTION === */}
        <section className="row align-items-center my-5 py-4 flex-md-row-reverse">
          <div className="col-md-6 mb-4 mb-md-0 d-flex justify-content-center">
            {/* --- BIGGER IMAGE --- */}
            <img src="abt2.png" alt="Smart Solution" className="img-fluid-rounded" style={{ maxWidth: '450px' }} />
          </div>
          <div className="col-md-6 content-text">
            <h2 className="fs-3 fw-bold">Our Smart Solution</h2>
            <p className="text-secondary">
              Growlify makes gardening easy and smart. We leverage AI to guide you through your urban farming journey. From selecting plants suited for your sunlight to diagnosing diseases with a photo, we simplify it all.
            </p>
            <p className="text-secondary">
              Personalized schedules, weather-aware watering reminders, and a supportive community (coming soon!) help your plants thrive.
            </p>
          </div>
        </section>

        
        <section id="about-us-section" className="my-5 mission-section text-center">
          <div className="mb-4">
            <span role="img" aria-label="target-emoji" className="emoji-float">🎯</span>
          </div>
          <h2 className="fs-2 fw-bold mt-3">Our Mission</h2>
          <p className="mission-text mx-auto mt-3" style={{ maxWidth: '700px' }}>
            To bring sustainable food-growing skills to every balcony, window, and rooftop—fostering greener cities and healthier communities.
          </p>
        </section>

        
        <section id="my-garden-section" className="text-center my-5 py-4">
          <div className="icon-circle">
            <i className="bi bi-people"></i>
          </div>
          <h2 className="fs-2 fw-bold">Join Our Growing Community</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
            Whether you're a seasoned gardener or just starting out, Growlify AI is your perfect companion. Let’s grow together!
          </p>
          <button className="btn-cta-normal">
            Start Your Garden <i className="bi bi-arrow-right"></i>
          </button>
        </section>
      </div>
    </div>
  );
}

export default About;
import React, { useState, useEffect, useRef } from 'react';
import { Bot, CloudRain, Clock, Camera, BookOpen, Users, Search, ArrowRight, Sparkles } from 'lucide-react';

const Features = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F5DB',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Animated background gradient orbs */}
      <div style={{
        position: 'absolute',
        top: `${20 - scrollY * 0.1}%`,
        left: `${mousePosition.x * 0.02}%`,
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        transition: 'all 0.3s ease-out',
        pointerEvents: 'none',
        animation: 'pulse 4s ease-in-out infinite',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: `${10 - scrollY * 0.05}%`,
        right: `${mousePosition.x * 0.015}%`,
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(70px)',
        transition: 'all 0.3s ease-out',
        pointerEvents: 'none',
        animation: 'pulse 5s ease-in-out infinite',
      }} />

      {/* Hero Section */}
      <header style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '8rem',
        paddingBottom: '5rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          padding: '1.25rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px -10px rgba(16, 185, 129, 0.4)',
          animation: 'float 3s ease-in-out infinite',
        }}>
          <Search size={48} color="#059669" strokeWidth={2.5} />
        </div>
        
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          color: '#000000',
          marginBottom: '1.5rem',
          maxWidth: '50rem',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          animation: 'fadeInDown 0.8s ease-out',
        }}>
          Smart Features to Support Your Plants
        </h1>
        
        <p style={{
          fontSize: '1.35rem',
          color: '#4b5563',
          maxWidth: '52rem',
          lineHeight: '1.7',
          fontWeight: '500',
          animation: 'fadeInUp 0.8s ease-out 0.2s both',
        }}>
          UrbanGrow AI is packed with intelligent tools designed to make your urban
          gardening journey successful and enjoyable.
        </p>
      </header>

      {/* Features Grid */}
      <section style={{
        maxWidth: '90rem',
        margin: '0 auto',
        padding: '0 2rem 6rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
        }}>
          <FeatureCard
            icon={<Bot size={44} strokeWidth={2} />}
            title="Personalized Plant Care"
            description="AI-driven recommendations based on your home space, plant types, and local climate data."
            delay={0}
          />
          <FeatureCard
            icon={<CloudRain size={44} strokeWidth={2} />}
            title="Weather Alerts"
            description="Smart alerts to skip watering when rain is expected, conserving water and protecting plants."
            delay={0.1}
          />
          <FeatureCard
            icon={<Clock size={44} strokeWidth={2} />}
            title="Watering Reminders"
            description="Timely notifications based on individual plant needs and environmental conditions."
            delay={0.2}
          />
          <FeatureCard
            icon={<Camera size={44} strokeWidth={2} />}
            title="AI Plant Diagnosis"
            description="Upload a photo of your plant, and our AI will analyze it to detect potential issues and offer solutions."
            delay={0.3}
          />
          <FeatureCard
            icon={<BookOpen size={44} strokeWidth={2} />}
            title="Growth Logbook"
            description="Track your plants' progress with notes, pictures, and key milestones."
            delay={0.4}
          />
          <FeatureCard
            icon={<Users size={44} strokeWidth={2} />}
            title="Community Tips"
            description="Share your successes and learn from other urban farmers in a supportive community."
            delay={0.5}
          />
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        const newSparkle = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
        };
        setSparkles(prev => [...prev, newSparkle]);
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 1000);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      style={{
        backgroundColor: '#F5F5DB',
        padding: '2.5rem',
        borderRadius: '24px',
        border: isHovered ? '2px solid #10b981' : '1px solid #d1d5db',
        boxShadow: isHovered
          ? '0 30px 60px -15px rgba(16, 185, 129, 0.4), 0 10px 20px -5px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(16, 185, 129, 0.1)'
          : '0 10px 30px -10px rgba(0, 0, 0, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.08)',
        transform: isHovered ? 'scale(1.08) translateY(-8px)' : 'scale(1) translateY(0)',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        animation: isVisible ? `scaleIn 0.6s ease-out ${delay}s both` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ripple effect on hover */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'ripple 1s ease-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Sparkle particles */}
      {sparkles.map(sparkle => (
        <Sparkles
          key={sparkle.id}
          size={16}
          style={{
            position: 'absolute',
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            color: '#10b981',
            animation: 'sparkle 1s ease-out',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Glowing border effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '24px',
        opacity: isHovered ? 1 : 0,
        animation: isHovered ? 'borderGlow 2s ease-in-out infinite' : 'none',
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease',
      }} />

      <div style={{
        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        padding: '1.25rem',
        borderRadius: '20px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        boxShadow: isHovered 
          ? '0 12px 32px -8px rgba(16, 185, 129, 0.6)'
          : '0 8px 24px -8px rgba(16, 185, 129, 0.4)',
        transform: isHovered ? 'scale(1.2) rotate(5deg)' : 'scale(1) rotate(0deg)',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{ 
          color: '#059669', 
          display: 'flex',
          animation: isHovered ? 'pulse 1s ease-in-out infinite' : 'none',
        }}>
          {icon}
        </div>
      </div>

      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '1rem',
        letterSpacing: '-0.01em',
        transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: 2,
      }}>
        {title}
      </h3>

      <p style={{
        color: '#374151',
        fontSize: '1.05rem',
        lineHeight: '1.7',
        marginBottom: '1.5rem',
        fontWeight: '500',
        transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
        transition: 'all 0.3s ease 0.05s',
        position: 'relative',
        zIndex: 2,
      }}>
        {description}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#10b981',
        fontWeight: '600',
        fontSize: '0.95rem',
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
        transition: 'all 0.4s ease 0.1s',
        position: 'relative',
        zIndex: 2,
      }}>
        Learn more
        <ArrowRight size={18} style={{
          transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
        }} />
      </div>

      {/* Animated corner accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '120px',
        height: '120px',
        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        opacity: isHovered ? 0.2 : 0.08,
        borderRadius: '0 24px 0 100%',
        transform: isHovered ? 'scale(1.3) rotate(10deg)' : 'scale(1) rotate(0deg)',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        pointerEvents: 'none',
      }} />

      {/* Bottom gradient bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #10b981, #34d399, #10b981)',
        backgroundSize: '200% 100%',
        opacity: isHovered ? 1 : 0,
        animation: isHovered ? 'shimmer 2s linear infinite' : 'none',
        borderRadius: '0 0 24px 24px',
        transition: 'opacity 0.3s ease',
      }} />
    </div>
  );
};

export default Features;
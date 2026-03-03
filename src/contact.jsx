import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    message: ''
  });

  const [status, setStatus] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    const API_BASE_URL = "http://localhost:5002";

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ fullName: '', emailAddress: '', message: '' });
        setTimeout(() => {
          setStatus('');
        }, 5000);
      } else {
        setStatus(result.message || "Failed to send message");
        setTimeout(() => {
          setStatus('');
        }, 5000);
      }
    } catch (error) {
      console.error(error);
      setStatus("Error sending message");
      setTimeout(() => {
        setStatus('');
      }, 5000);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeOut {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(-10px);
            }
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
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-10px) rotate(5deg);
            }
          }

          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3) rotate(-45deg);
            }
            50% {
              opacity: 1;
              transform: scale(1.05) rotate(5deg);
            }
            70% {
              transform: scale(0.9) rotate(-3deg);
            }
            100% {
              transform: scale(1) rotate(0deg);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }

          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }

          .min-vh-100 {
            min-height: 100vh;
          }

          .bg-overall-yellowish-green {
            background: linear-gradient(-45deg, hsl(60, 56%, 91%), hsl(80, 60%, 88%), hsl(70, 58%, 93%), hsl(55, 62%, 89%));
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            position: relative;
            overflow: hidden;
          }

          .bg-overall-yellowish-green::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(139, 195, 74, 0.1) 0%, transparent 70%);
            animation: float 20s ease-in-out infinite;
          }

          .text-dark-green {
            color: #4CAF50;
          }

          .card {
            border: none;
            border-radius: 1.5rem;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
          }

          .card::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #8BC34A, #4CAF50, #66BB6A, #81C784);
            border-radius: 1.5rem;
            opacity: 0;
            transition: opacity 0.5s;
            z-index: -1;
          }

          .card:hover::before {
            opacity: 0.3;
          }

          .card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(76, 175, 80, 0.3), 0 0 60px rgba(139, 195, 74, 0.2);
          }

          .rounded-lg {
            border-radius: 1.5rem !important;
          }

          .custom-input {
            border: 2px solid #d0d0d0;
            background-color: rgba(255, 255, 255, 0.9) !important;
            font-size: 0.95rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
          }

          .custom-input:focus {
            border-color: #8BC34A;
            box-shadow: 0 0 0 0.4rem rgba(139, 195, 74, 0.25), 0 8px 16px rgba(139, 195, 74, 0.2);
            transform: translateY(-2px);
            background-color: #fff !important;
          }

          .custom-input:hover:not(:focus) {
            border-color: #8BC34A;
            transform: translateY(-1px);
          }

          .input-wrapper {
            position: relative;
          }

          .input-focused {
            animation: pulse 0.6s ease;
          }

          .btn-success {
            background: linear-gradient(135deg, #6c8d5c 0%, #5a7a4a 100%);
            border: none;
            font-weight: 600;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(108, 141, 92, 0.4);
          }

          .btn-success::before {
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

          .btn-success:hover::before {
            width: 300px;
            height: 300px;
          }

          .btn-success:hover {
            background: linear-gradient(135deg, #5a7a4a 0%, #4a6a3a 100%);
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(108, 141, 92, 0.6);
          }

          .btn-success:active {
            transform: translateY(-2px);
          }

          .hover-shadow-btn:hover {
            box-shadow: 0 12px 24px rgba(108, 141, 92, 0.4) !important;
          }

          .social-icons a {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            display: inline-block;
          }

          .social-icons a::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border-radius: 50%;
            background: currentColor;
            opacity: 0;
            transform: scale(0);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: -1;
          }

          .hover-scale-icon:hover {
            transform: scale(1.3) rotate(5deg);
          }

          .hover-scale-icon:hover::after {
            opacity: 0.1;
            transform: scale(1.5);
          }

         .text-instagram {
  color: #C13584 !important;
}

.text-twitter {
  color: #1DA1F2 !important;
}

.text-youtube {
  color: #FF0000 !important;
}

.text-whatsapp {
  color: #25D366 !important;
}

          .compact-card {
            padding: 1.5rem !important;
            flex-grow: 0 !important;
            height: fit-content;
          }

          .contact-card {
            background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e0 100%) !important;
          }

          .follow-card {
            background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e0 100%) !important;
          }

          .form-container-col .card {
            width: 90%;
            margin: auto;
            padding: 1.5rem 2rem !important;
            background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e0 100%) !important;
          }

          .icon-circle {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: linear-gradient(135deg, #c5e1a5, #aed581);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            animation: bounceIn 0.8s ease-out, float 3s ease-in-out 0.8s infinite;
            box-shadow: 0 10px 40px rgba(139, 195, 74, 0.4);
            position: relative;
          }

          .icon-circle::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: linear-gradient(135deg, #8BC34A, #4CAF50);
            opacity: 0;
            animation: ripple 2s ease-out 0.8s infinite;
          }

          .icon-circle i {
            position: relative;
            z-index: 1;
          }

          .header-section {
            animation: fadeInDown 0.8s ease-out;
          }

          .form-container-col {
            animation: fadeInUp 0.8s ease-out 0.2s both;
          }

          .contact-info-col {
            animation: fadeInUp 0.8s ease-out 0.4s both;
          }

          .contact-card, .follow-card {
            animation: scaleIn 0.6s ease-out;
          }

          .status-message {
            animation: fadeInUp 0.4s ease-out;
            font-weight: 600;
            padding: 0.75rem;
            border-radius: 0.5rem;
            background: linear-gradient(135deg, rgba(139, 195, 74, 0.1), rgba(76, 175, 80, 0.1));
          }

          .form-label {
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-block;
          }

          .input-wrapper:focus-within .form-label {
            transform: translateX(5px);
            color: #4CAF50;
          }

          @media (max-width: 768px) {
            .display-5 {
              font-size: 2.5rem;
            }
            .lead {
              font-size: 1rem;
            }
            .btn-lg {
              font-size: 1rem;
              padding: 0.75rem 1.25rem;
            }
            .form-container-col {
              width: 100%;
            }
            .form-container-col .card {
              width: 100%;
            }
          }

          .card-title {
            position: relative;
            display: inline-block;
          }

          .card-title::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 3px;
            background: linear-gradient(90deg, #8BC34A, #4CAF50);
            transition: width 0.4s ease;
          }

          .card:hover .card-title::after {
            width: 100%;
          }

          a {
            position: relative;
            transition: all 0.3s ease;
          }

          a:hover {
            transform: translateX(3px);
          }
        `}
      </style>

      <div className="d-flex flex-column justify-content-center align-items-center py-5 bg-overall-yellowish-green">
        <div className="container">
          {/* Get in Touch Header */}
          <section className="text-center mb-5 header-section">
            <div className="icon-circle" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-comment-dots fa-2x text-dark-green"></i>
            </div>

            <h1 className="display-5 fw-bold text-dark-green mb-3">Get in Touch</h1>
            <p className="lead text-muted px-4 px-md-0 mx-auto" style={{ maxWidth: '600px' }}>
              Have a question, suggestion, or just want to say hello? We'd love to hear from you!
            </p>
          </section>

          {/* Contact Form & Info Section */}
          <section className="row justify-content-center">
            {/* Form Section */}
            <div className="col-lg-5 mb-4 form-container-col">
              <div className="card shadow-sm p-4 rounded-lg">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3 text-dark-green">Send Us a Message</h5>
                  <p className="card-text text-muted mb-4">
                    Fill out the form and we'll get back to you ASAP!
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3 input-wrapper">
                      <label htmlFor="fullName" className="form-label text-muted">Full Name</label>
                      <input
                        type="text"
                        className={`form-control rounded-pill py-2 px-3 custom-input ${focusedField === 'fullName' ? 'input-focused' : ''}`}
                        id="fullName"
                        placeholder="Your name"
                        value={formData.fullName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => setFocusedField('')}
                      />
                    </div>

                    <div className="mb-3 input-wrapper">
                      <label htmlFor="emailAddress" className="form-label text-muted">Email Address</label>
                      <input
                        type="email"
                        className={`form-control rounded-pill py-2 px-3 custom-input ${focusedField === 'emailAddress' ? 'input-focused' : ''}`}
                        id="emailAddress"
                        placeholder="you@example.com"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('emailAddress')}
                        onBlur={() => setFocusedField('')}
                      />
                    </div>

                    <div className="mb-4 input-wrapper">
                      <label htmlFor="message" className="form-label text-muted">Message</label>
                      <textarea
                        className={`form-control rounded-lg py-2 px-3 custom-input ${focusedField === 'message' ? 'input-focused' : ''}`}
                        id="message"
                        rows="5"
                        placeholder="Tell us how we can help..."
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField('')}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-success btn-lg rounded-pill w-100 hover-shadow-btn">
                      Send Message
                    </button>

                    {status && (
                      <p className="text-center mt-3 status-message">{status}</p>
                    )}
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Info + Socials */}
            <div className="col-lg-4 contact-info-col">
              <div className="d-flex flex-column h-100">
                {/* Contact Info Card */}
                <div className="card shadow-sm p-4 mb-4 rounded-lg compact-card contact-card">
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-3 text-dark-green">Contact Information</h5>
                    <p className="card-text">
                      <i className="fas fa-envelope me-2 text-danger"></i>
                      <a href="mailto:growlifyai@gmail.com" className="text-decoration-none text-muted">growlifyai@gmail.com</a>
                    </p>
                  </div>
                </div>

                {/* Follow Us Card */}
                <div className="card shadow-sm p-4 rounded-lg compact-card follow-card">
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-3 text-dark-green">Follow Us</h5>
                    <div className="d-flex social-icons justify-content-center">
                      <a href="https://www.instagram.com/growlifyai?igsh=MWpjZ21wMGhmNDk0bA==" target="_blank" rel="noopener noreferrer" className="me-3 hover-scale-icon text-instagram">
                        <i className="fab fa-instagram fa-2x"></i>
                      </a>
                      <a href="https://twitter.com/growlify" target="_blank" rel="noopener noreferrer" className="me-3 hover-scale-icon text-twitter">
                        <i className="fab fa-twitter fa-2x"></i>
                      </a>
                      <a href="https://youtube.com/@growlify-ai?si=gTwtJLPJzGciOVll" target="_blank" rel="noopener noreferrer" className="me-3 hover-scale-icon text-youtube">
                        <i className="fab fa-youtube fa-2x"></i>
                      </a>
                      <a href="https://wa.me/918056107634" target="_blank" rel="noopener noreferrer" className="hover-scale-icon text-whatsapp">
                        <i className="fab fa-whatsapp fa-2x"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Contact;
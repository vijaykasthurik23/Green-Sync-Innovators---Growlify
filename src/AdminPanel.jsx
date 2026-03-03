import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, LogOut, RefreshCw, CheckCircle, XCircle, Clock,
  FileText, User, Mail, Phone, Image as ImageIcon, Video,
  IndianRupee, Calendar, Search, Filter
} from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [quoteAmounts, setQuoteAmounts] = useState({}); // Store price inputs for each quotation

  // Check if admin is logged in
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn !== 'true') {
      navigate('/login'); // Redirect to main login if not authenticated
    } else {
      fetchQuotations();
    }
  }, [navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5002/api/shop/admin/quotations', {
        headers: {
          'x-admin-auth': 'true'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setQuotations(data.quotations);
        // Pre-fill quote amounts with estimated amounts from users
        const initialAmounts = {};
        data.quotations.forEach(q => {
          if (q.estimatedAmount && q.status === 'pending') {
            initialAmounts[q._id] = q.estimatedAmount;
          }
        });
        setQuoteAmounts(prev => ({ ...prev, ...initialAmounts }));
      }
    } catch (error) {
      console.error('Failed to fetch quotations:', error);
      showToast('Failed to fetch quotations', 'error');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/login');
  };

  const handleAmountChange = (id, value) => {
    setQuoteAmounts(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleApprove = async (id) => {
    const amount = quoteAmounts[id];
    if (!amount || amount <= 0) {
      showToast('Please enter a valid quotation amount', 'error');
      return;
    }

    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:5002/api/shop/admin/quotations/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'true'
        },
        body: JSON.stringify({ amount: amount })
      });

      const data = await response.json();
      if (response.ok) {
        showToast('Quotation approved and PDF sent successfully', 'success');
        fetchQuotations();
      } else {
        showToast(data.message || 'Failed to approve', 'error');
      }
    } catch (error) {
      showToast('Failed to approve quotation', 'error');
    }
    setActionLoading(null);
  };

  const handleDecline = async (id) => {
    if (!window.confirm('Are you sure you want to decline this request?')) return;

    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:5002/api/shop/admin/quotations/${id}/decline`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'true'
        },
        body: JSON.stringify({ notes: 'Declined by admin' })
      });

      const data = await response.json();
      if (response.ok) {
        showToast('Quotation declined', 'success'); // Changed to success type for green styling
        fetchQuotations();
      } else {
        showToast(data.message || 'Failed to decline', 'error');
      }
    } catch (error) {
      showToast('Failed to decline quotation', 'error');
    }
    setActionLoading(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending"><Clock size={14} /> Pending</span>;
      case 'approved':
        return <span className="status-badge approved"><CheckCircle size={14} /> Approved</span>;
      case 'declined':
        return <span className="status-badge declined"><XCircle size={14} /> Declined</span>;
      default:
        return <span className="status-badge default">{status}</span>;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header with Growlify Logo */}
      <header className="admin-header">
        <div className="header-left">
          <div className="brand">
            <img
              src="./growlify.png"
              alt="Growlify Logo"
              className="brand-logo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <Shield className="brand-icon" size={28} />
            <div>
              <h1>Admin Portal</h1>
              <p>Quotation Management System</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button onClick={fetchQuotations} className="btn btn-outline" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
            Refresh
          </button>
          <button onClick={handleLogout} className="btn btn-danger">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon pending-bg">
            <Clock size={24} />
          </div>
          <div>
            <h3>{quotations.filter(q => q.status === 'pending').length}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success-bg">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3>{quotations.filter(q => q.status === 'approved').length}</h3>
            <p>Approved Quotes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon error-bg">
            <XCircle size={24} />
          </div>
          <div>
            <h3>{quotations.filter(q => q.status === 'declined').length}</h3>
            <p>Declined Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total-bg">
            <FileText size={24} />
          </div>
          <div>
            <h3>{quotations.length}</h3>
            <p>Total Requests</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div className="section-header">
          <h2>Requests Overview</h2>
        </div>

        {loading && quotations.length === 0 ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : quotations.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} className="text-muted" />
            <h3>No Requests Found</h3>
            <p>New quotation requests will appear here.</p>
          </div>
        ) : (
          <div className="quotations-grid">
            {quotations.map((quotation) => (
              <div key={quotation._id} className={`quotation-card ${quotation.status}`}>
                <div className="card-header">
                  <div className="header-top">
                    <span className="id-badge">#{quotation._id.slice(-6).toUpperCase()}</span>
                    {getStatusBadge(quotation.status)}
                  </div>
                  <h3 className="product-title">{quotation.productName}</h3>
                  <div className="date-badge">
                    <Calendar size={14} />
                    {new Date(quotation.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-group">
                    <div className="info-item">
                      <User size={16} />
                      <span>{quotation.userName}</span>
                    </div>
                    <div className="info-item">
                      <Mail size={16} />
                      <span>{quotation.email}</span>
                    </div>
                    <div className="info-item">
                      <Phone size={16} />
                      <span>{quotation.phone}</span>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div className="media-preview">
                    <h4>Attached Media</h4>
                    <div className="media-grid">
                      <div className="media-item" onClick={() => setSelectedImage(`http://localhost:5002/api/shop/uploads/${quotation.frontViewImage}`)}>
                        <img src={`http://localhost:5002/api/shop/uploads/${quotation.frontViewImage}`} alt="Front" onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=No+Img'} />
                        <span>Front View</span>
                      </div>
                      <div className="media-item" onClick={() => setSelectedImage(`http://localhost:5002/api/shop/uploads/${quotation.topViewImage}`)}>
                        <img src={`http://localhost:5002/api/shop/uploads/${quotation.topViewImage}`} alt="Top" onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=No+Img'} />
                        <span>Top View</span>
                      </div>
                    </div>
                    {quotation.videoPath && (
                      <div className="video-link">
                        <Video size={16} />
                        <a href={`http://localhost:5002/api/shop/uploads/${quotation.videoPath}`} target="_blank" rel="noopener noreferrer">View Video</a>
                      </div>
                    )}
                  </div>

                  {/* Dimension and Estimated Cost Display */}
                  {quotation.heightCm && quotation.widthCm && (
                    <div className="dimension-display">
                      <div className="dimension-row">
                        <span className="dimension-label">📏 Dimensions:</span>
                        <span className="dimension-value">{quotation.heightCm} cm × {quotation.widthCm} cm</span>
                      </div>
                      <div className="dimension-row">
                        <span className="dimension-label">📐 Area:</span>
                        <span className="dimension-value">{(quotation.heightCm * quotation.widthCm).toLocaleString('en-IN')} cm²</span>
                      </div>
                      {quotation.estimatedAmount && (
                        <div className="suggested-amount">
                          <span className="suggested-label">💡 User's Estimate:</span>
                          <span className="suggested-value">₹{quotation.estimatedAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {quotation.status === 'pending' && (
                    <div className="action-area">
                      <div className="price-input-wrapper">
                        <IndianRupee size={16} className="currency-icon" />
                        <input
                          type="number"
                          placeholder="Enter Quote Amount"
                          className="price-input"
                          value={quoteAmounts[quotation._id] || ''}
                          onChange={(e) => handleAmountChange(quotation._id, e.target.value)}
                        />
                      </div>
                      <div className="button-group">
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(quotation._id)}
                          disabled={actionLoading === quotation._id}
                        >
                          {actionLoading === quotation._id ? 'Processing...' : 'Approve & Send'}
                        </button>
                        <button
                          className="btn-decline"
                          onClick={() => handleDecline(quotation._id)}
                          disabled={actionLoading === quotation._id}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal - Small Centered Square */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedImage(null)}>
              <XCircle size={24} />
            </button>
            <img src={selectedImage} alt="Full View" className="modal-image" />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      <style>{`
                /* ========================================
                   EXECUTIVE PREMIUM ADMIN DASHBOARD
                   Growlify Light Cream Professional Theme
                ======================================== */
                
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');
                
                :root {
                    --primary: #2d5f3e;
                    --primary-light: #3d7f52;
                    --primary-dark: #1a3d26;
                    --accent: #28a745;
                    --accent-bright: #34c759;
                    --gold: #d4af37;
                    --gold-light: #f4d03f;
                    --gold-dark: #b8942a;
                    --cream: #f5f5db;
                    --cream-light: #fdfdf5;
                    --cream-dark: #e8e8c5;
                    --beige: #f0e9d2;
                    --warm-white: #fffef9;
                    --text-primary: #2c3e2f;
                    --text-secondary: #5a6c5d;
                    --text-muted: #8a9a8d;
                    --glass-bg: rgba(255, 255, 255, 0.75);
                    --glass-border: rgba(45, 95, 62, 0.15);
                    --shadow-premium: 0 20px 60px -15px rgba(45, 95, 62, 0.25);
                    --shadow-soft: 0 8px 32px rgba(45, 95, 62, 0.12);
                }

                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                /* Sophisticated Animated Background */
                .admin-dashboard {
                    background: linear-gradient(135deg, 
                        var(--cream) 0%, 
                        var(--beige) 25%, 
                        var(--cream-light) 50%, 
                        var(--beige) 75%, 
                        var(--cream) 100%);
                    background-size: 400% 400%;
                    animation: gradientShift 20s ease infinite;
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    padding-bottom: 80px;
                    position: relative;
                    overflow-x: hidden;
                }

                .admin-dashboard::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 15% 15%, rgba(40, 167, 69, 0.06) 0%, transparent 40%),
                        radial-gradient(circle at 85% 85%, rgba(212, 175, 55, 0.08) 0%, transparent 45%),
                        radial-gradient(circle at 50% 50%, rgba(61, 127, 82, 0.04) 0%, transparent 60%);
                    pointer-events: none;
                    z-index: 0;
                }

                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                /* Elegant Glass Header */
                .admin-header {
                    background: linear-gradient(135deg, 
                        rgba(45, 95, 62, 0.95) 0%, 
                        rgba(40, 167, 69, 0.92) 100%);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    padding: 1.25rem 2.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    border-bottom: 3px solid var(--gold);
                    box-shadow: 
                        0 8px 40px rgba(45, 95, 62, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
                }

                .header-left .brand {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .brand-logo {
                    height: 55px;
                    width: auto;
                    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
                }

                .brand-icon {
                    color: var(--primary-dark);
                    background: linear-gradient(135deg, var(--gold), var(--gold-light));
                    padding: 12px;
                    border-radius: 14px;
                    box-shadow: 
                        0 8px 25px rgba(212, 175, 55, 0.5),
                        inset 0 2px 4px rgba(255, 255, 255, 0.4);
                    animation: iconPulse 3s ease-in-out infinite;
                }

                @keyframes iconPulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5); }
                    50% { transform: scale(1.05); box-shadow: 0 12px 35px rgba(212, 175, 55, 0.7); }
                }

                .header-left h1 {
                    font-size: 1.6rem;
                    font-weight: 800;
                    color: #ffffff;
                    margin: 0;
                    letter-spacing: -0.5px;
                    text-shadow: 0 2px 15px rgba(0,0,0,0.3);
                    font-family: 'Playfair Display', serif;
                }

                .header-left p {
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.95);
                    margin: 0;
                    font-weight: 500;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                }

                .header-right {
                    display: flex;
                    gap: 14px;
                }

                .btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0.65rem 1.25rem;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 0.9rem;
                    font-family: 'Inter', sans-serif;
                    letter-spacing: 0.3px;
                    position: relative;
                    overflow: hidden;
                }

                .btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: left 0.5s;
                }

                .btn:hover::before {
                    left: 100%;
                }

                .btn-outline {
                    background: rgba(255, 255, 255, 0.15);
                    border: 2px solid rgba(255,255,255,0.9);
                    color: white;
                }

                .btn-outline:hover {
                    background: rgba(255, 255, 255, 0.25);
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
                }

                .btn-danger {
                    background: linear-gradient(135deg, #ff4757, #ff6b6b);
                    color: white;
                    border: none;
                    box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
                }

                .btn-danger:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(255, 71, 87, 0.6);
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .spin { animation: spin 1s linear infinite; }

                /* Premium Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 24px;
                    padding: 2.5rem;
                    max-width: 1500px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                @media (max-width: 1200px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                }

                @media (max-width: 600px) {
                    .stats-grid { grid-template-columns: 1fr; }
                }

                .stat-card {
                    background: var(--glass-bg);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    padding: 2rem;
                    border-radius: 20px;
                    border: 2px solid var(--glass-border);
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    box-shadow: var(--shadow-soft);
                }

                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, transparent, var(--accent), transparent);
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .stat-card:hover::before { opacity: 1; }

                .stat-card:hover {
                    transform: translateY(-10px) scale(1.03);
                    box-shadow: var(--shadow-premium);
                    border-color: rgba(40, 167, 69, 0.4);
                }

                /* Warm Stat Card Colors */
                .stat-card:nth-child(1) { 
                    background: linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 235, 59, 0.08) 100%);
                    border-left: 5px solid #ffc107;
                }
                .stat-card:nth-child(2) { 
                    background: linear-gradient(135deg, rgba(40, 167, 69, 0.15) 0%, rgba(52, 199, 89, 0.08) 100%);
                    border-left: 5px solid var(--accent);
                }
                .stat-card:nth-child(3) { 
                    background: linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(239, 83, 80, 0.08) 100%);
                    border-left: 5px solid #f44336;
                }
                .stat-card:nth-child(4) { 
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(184, 148, 42, 0.1) 100%);
                    border-left: 5px solid var(--gold);
                }

                .stat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 25px rgba(45, 95, 62, 0.25);
                }

                .pending-bg { background: linear-gradient(135deg, #ffc107, #ffb300); color: #1a1a2e; }
                .success-bg { background: linear-gradient(135deg, #28a745, #34c759); color: white; }
                .error-bg { background: linear-gradient(135deg, #f44336, #ef5350); color: white; }
                .total-bg { background: linear-gradient(135deg, var(--gold), var(--gold-dark)); color: #1a1a2e; }

                .stat-card h3 {
                    font-size: 2.2rem;
                    font-weight: 800;
                    margin: 0;
                    color: var(--text-primary);
                    line-height: 1;
                }

                .stat-card p {
                    margin: 4px 0 0 0;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* Content Area */
                .content-area {
                    padding: 0 2.5rem;
                    max-width: 1500px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .section-header {
                    margin-bottom: 28px;
                    background: var(--glass-bg);
                    backdrop-filter: blur(20px);
                    padding: 20px 28px;
                    border-radius: 16px;
                    border: 2px solid var(--glass-border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: var(--shadow-soft);
                }

                .section-header h2 {
                    color: var(--text-primary);
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-family: 'Playfair Display', serif;
                }

                .section-header h2::before {
                    content: '';
                    width: 4px;
                    height: 28px;
                    background: linear-gradient(180deg, var(--gold), var(--accent));
                    border-radius: 2px;
                }

                .quotations-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                    gap: 28px;
                    justify-content: center;
                }

                /* Elegant Light Quotation Cards */
                .quotation-card {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 24px;
                    box-shadow: var(--shadow-soft);
                    overflow: hidden;
                    border: 2px solid rgba(45, 95, 62, 0.12);
                    display: flex;
                    flex-direction: column;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .quotation-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, transparent, var(--accent), transparent);
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .quotation-card:hover::before { opacity: 1; }

                .quotation-card:hover {
                    transform: translateY(-10px) scale(1.02);
                    box-shadow: var(--shadow-premium);
                    border-color: rgba(40, 167, 69, 0.3);
                }

                .quotation-card.pending { 
                    border-left: 5px solid #ffc107;
                }
                .quotation-card.approved { 
                    border-left: 5px solid var(--accent);
                }
                .quotation-card.declined { 
                    border-left: 5px solid #f44336; 
                    opacity: 0.9;
                }

                .card-header {
                    padding: 1.5rem 1.75rem;
                    border-bottom: 2px solid rgba(45, 95, 62, 0.08);
                    background: rgba(255,255,255,0.5);
                }

                /* Warm Headers */
                .quotation-card.pending .card-header { 
                    background: linear-gradient(135deg, rgba(255, 193, 7, 0.12) 0%, rgba(255, 235, 59, 0.06) 100%); 
                }
                .quotation-card.approved .card-header { 
                    background: linear-gradient(135deg, rgba(40, 167, 69, 0.12) 0%, rgba(52, 199, 89, 0.06) 100%); 
                }
                .quotation-card.declined .card-header { 
                    background: linear-gradient(135deg, rgba(244, 67, 54, 0.12) 0%, rgba(239, 83, 80, 0.06) 100%); 
                }

                .header-top {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }

                .id-badge {
                    font-family: 'JetBrains Mono', monospace;
                    background: rgba(45, 95, 62, 0.08);
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    border: 1px solid rgba(45, 95, 62, 0.15);
                    font-weight: 600;
                }

                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 14px;
                    border-radius: 30px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .status-badge.pending { 
                    background: linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 235, 59, 0.15)); 
                    color: #e65100;
                    border: 1px solid rgba(255, 193, 7, 0.4);
                }
                .status-badge.approved { 
                    background: linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(52, 199, 89, 0.15)); 
                    color: #1b5e20;
                    border: 1px solid rgba(40, 167, 69, 0.4);
                }
                .status-badge.declined { 
                    background: linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(239, 83, 80, 0.15)); 
                    color: #b71c1c;
                    border: 1px solid rgba(244, 67, 54, 0.4);
                }

                .product-title {
                    margin: 0 0 12px 0;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    line-height: 1.4;
                    text-align: center;
                    font-family: 'Playfair Display', serif;
                }

                .date-badge {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                }

                .card-body {
                    padding: 1.75rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .info-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    background: rgba(245, 245, 219, 0.3);
                    padding: 16px 18px;
                    border-radius: 14px;
                    border: 1px solid rgba(45, 95, 62, 0.12);
                }

                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    color: var(--text-primary);
                    font-size: 0.95rem;
                    font-weight: 500;
                }

                .info-item svg {
                    color: var(--text-secondary);
                    flex-shrink: 0;
                    opacity: 0.8;
                }

                .divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(45, 95, 62, 0.2), transparent);
                    margin: 1.25rem 0;
                }

                .media-preview h4 {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin: 0 0 14px 0;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    text-align: center;
                    font-weight: 700;
                }

                .media-grid {
                    display: flex;
                    gap: 14px;
                    justify-content: center;
                }

                .media-item {
                    width: 90px;
                    height: 90px;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.6);
                    border: 2px solid rgba(45, 95, 62, 0.15);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    overflow: hidden;
                    position: relative;
                    transition: all 0.3s ease;
                }

                .media-item:hover {
                    transform: scale(1.08);
                    border-color: var(--accent);
                    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.25);
                }

                .media-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .media-item span {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    background: linear-gradient(transparent, rgba(45, 95, 62, 0.9));
                    color: white;
                    font-size: 9px;
                    text-align: center;
                    padding: 4px 0;
                    font-weight: 600;
                }

                .video-link {
                    margin-top: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 0.9rem;
                }

                .video-link a {
                    color: var(--accent);
                    text-decoration: none;
                    font-weight: 600;
                }

                .video-link a:hover {
                    text-decoration: underline;
                }

                .dimension-display {
                    background: linear-gradient(135deg, rgba(40, 167, 69, 0.08) 0%, rgba(52, 199, 89, 0.04) 100%);
                    border-radius: 16px;
                    padding: 16px 20px;
                    margin-top: 16px;
                    border: 2px solid rgba(40, 167, 69, 0.2);
                }

                .dimension-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .dimension-label {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    font-weight: 600;
                }

                .dimension-value {
                    font-size: 0.95rem;
                    color: var(--accent);
                    font-weight: 700;
                }

                .suggested-amount {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 2px dashed rgba(40, 167, 69, 0.25);
                }

                .suggested-label {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    font-weight: 600;
                }

                .suggested-value {
                    font-size: 1.2rem;
                    color: var(--gold-dark);
                    font-weight: 800;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 148, 42, 0.08) 100%);
                    padding: 6px 14px;
                    border-radius: 10px;
                    border: 2px solid rgba(212, 175, 55, 0.3);
                }

                .action-area {
                    margin-top: auto;
                    padding: 1.5rem;
                    background: linear-gradient(180deg, transparent 0%, rgba(245, 245, 219, 0.3) 100%);
                    border-top: 2px solid rgba(45, 95, 62, 0.08);
                }

                .price-input-wrapper {
                    position: relative;
                    margin-bottom: 18px;
                }

                .currency-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                }

                .price-input {
                    width: 100%;
                    padding: 14px 14px 14px 44px;
                    border: 2px solid rgba(45, 95, 62, 0.2);
                    border-radius: 14px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    outline: none;
                    transition: all 0.3s ease;
                    background: rgba(255,255,255,0.7);
                    color: var(--text-primary);
                    font-family: 'Inter', sans-serif;
                }

                .price-input:focus {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.12);
                    background: rgba(255,255,255,0.95);
                }

                .price-input::placeholder {
                    color: var(--text-muted);
                    font-weight: 400;
                }

                .button-group {
                    display: flex;
                    gap: 14px;
                    margin-top: 14px;
                }
                
                .button-group button {
                    flex: 1;
                    min-width: 120px;
                }

                .btn-approve, .btn-decline {
                    padding: 14px 24px;
                    border: none;
                    border-radius: 14px;
                    font-weight: 700;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    position: relative;
                    overflow: hidden;
                }

                .btn-approve::before, .btn-decline::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: left 0.5s;
                }

                .btn-approve:hover::before, .btn-decline:hover::before {
                    left: 100%;
                }

                .btn-approve {
                    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-bright) 100%);
                    color: white;
                    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.35);
                }

                .btn-approve:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(40, 167, 69, 0.5);
                }

                .btn-decline {
                    background: transparent;
                    border: 2px solid rgba(244, 67, 54, 0.6);
                    color: #c62828;
                }

                .btn-decline:hover {
                    background: rgba(244, 67, 54, 0.08);
                    border-color: #f44336;
                    transform: translateY(-3px);
                }

                .btn-approve:disabled, .btn-decline:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                /* Brand Logo Styling */
                .brand-logo {
                    height: 45px;
                    width: auto;
                    margin-right: 10px;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(8px);
                    animation: fadeIn 0.2s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* Small Centered Square Modal */
                .modal-content-box {
                    position: relative;
                    width: 400px;
                    height: 400px;
                    max-width: 90vw;
                    max-height: 90vw;
                    background: white;
                    border-radius: 16px;
                    padding: 12px;
                    box-shadow: 0 25px 60px rgba(0,0,0,0.5);
                    animation: scaleIn 0.25s ease-out;
                }

                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .modal-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 10px;
                }

                .modal-close-btn {
                    position: absolute;
                    top: -12px;
                    right: -12px;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    border: 3px solid white;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
                    transition: all 0.2s ease;
                    z-index: 10;
                }

                .modal-close-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.6);
                }

                .modal-close-btn svg {
                    width: 20px;
                    height: 20px;
                }

                .custom-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 500;
                    z-index: 2000;
                    animation: slideUp 0.3s ease-out;
                }

                .custom-toast.success { border-left: 4px solid var(--success); }
                .custom-toast.error { border-left: 4px solid var(--danger); }
                .custom-toast.success svg { color: var(--success); }
                .custom-toast.error svg { color: var(--danger); }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @media (max-width: 768px) {
                    .header-left p { display: none; }
                    .stats-grid { grid-template-columns: 1fr 1fr; }
                    .quotations-grid { grid-template-columns: 1fr; }
                }
            `}</style>
    </div>
  );
};

export default AdminPanel;

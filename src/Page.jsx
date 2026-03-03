import React, { useState, useEffect, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// SVG Icons
const LeafIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ShoppingCartIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const PlusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Trash2Icon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const ArrowLeftIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-8.83" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const SendIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const UserIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CameraIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const SearchZoomIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const PhoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const VideoIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const RulerIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0z" />
    <path d="m14.5 12.5 2-2" />
    <path d="m11.5 9.5 2-2" />
    <path d="m8.5 6.5 2-2" />
    <path d="m17.5 15.5 2-2" />
  </svg>
);

const RobotIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

// Mock product data
export const products = [
  { id: 1, name: 'Tomato Plant', price: 99.00, image: './p2.jpg', type: 'Edible Vegetable Plant', details: '🌱 Organic starter in nursery pot, perfect for home gardening beginners.', bestSeller: true },
  {
    id: 2,
    name: 'Rose Plant',
    price: 149.00,
    image: './p3.jpg',
    type: 'Flowering Plant',
    details: '🌸 Available in red, pink, yellow',
    bestSeller: true,
    colors: ['Red', 'Pink', 'Yellow', 'White'],
    colorImages: {
      Red: './p3.jpg',
      Pink: './p5.jpg',
      Yellow: './p7.jpg',
      White: './p6.jpg'
    }
  },
  { id: 3, name: 'Hibiscus Plant', price: 129.00, image: './p8.jpg', type: 'Outdoor Flowering', details: '🌼 Daily blooming, pest resistant, thrives in full sun with vibrant colors.' },
  { id: 4, name: 'Strawberry Plant', price: 149.00, image: './p10.jpg', type: 'Fruit Plant', details: '🍓 Grows well in pots, balcony-friendly, yields sweet and juicy strawberries.', bestSeller: true },
  { id: 5, name: 'Money Plant', price: 79.00, image: './p9.jpg', type: 'Indoor Air Purifier', details: '🌿 Grows in water/soil', bestSeller: true },
  { id: 6, name: 'Snake Plant', price: 199.00, image: './p11.jpg', type: 'Indoor Air Purifying', details: '🌬️ NASA approved oxygen booster' },
  { id: 7, name: 'Peace Lily', price: 189.00, image: './p12.jpg', type: 'Indoor Flowering', details: '🌸 Low light flowering plant' },
  { id: 8, name: 'Spider Plant', price: 119.00, image: './p13.png', type: 'Indoor Hanging', details: '🪴 Great for pet-friendly homes' },
  { id: 9, name: 'Vermicompost', price: 99.00, image: './p16.png', type: 'Organic Soil Enricher', details: '🌿 Improves root growth and soil health', bestSeller: true },
  { id: 10, name: 'Neem Cake Fertilizer', price: 89.00, image: './p17.jpg', type: 'Dual-purpose Pest Control + Fertilizer', details: '🐛 Natural insect deterrent' },
  { id: 11, name: 'Seaweed Extract / Liquid Seaweed', price: 199.00, image: './p18.png', type: 'Liquid Plant Tonic', details: '🌱 Stimulates flowering and immunity' },
  { id: 12, name: 'Bone Meal', price: 149.00, image: './p19.png', type: '🌼 Ideal for flowering plants' },
  { id: 13, name: 'Panchagavya', price: 179.00, image: './p21.png', type: 'Traditional Bio-Fertilizer', details: '🧪 Made from cow-based natural inputs' },
  { id: 14, name: 'Ceramic Duo Planter ', price: 499.00, image: './p20.png', type: 'Premium Indoor Pot (Holds 2 Plants)', details: '🎍 Ceramic + Bamboo Tray', bestSeller: true },
  { id: 15, name: 'GardenStretch 3-in-1 Grow Trough', price: 799.00, image: './p22.png', type: 'Rectangular Outdoor Planter', details: '🌿 Holds up to 3 medium plants' },
  {
    id: 16,
    name: 'Growlify – Smart Irrigation System (Auto Water)',
    price: 'Coming Soon',
    image: './p14.jpg',
    type: 'IoT-Based Auto Watering System',
    details: '🔄 Smart Moisture Sensors • ⏱️ Automated Scheduling • 💧 60% Water Savings • 📱 Mobile App Control • 🌱 Perfect for Indoor & Outdoor Gardens',
    comingSoon: true,
    productLabel: 'budget',
    labelText: 'Budget Friendly'
  },
  {
    id: 17,
    name: 'Growlify Guardian – Smart Garden Protection (Auto Care)',
    price: 'Coming Soon',
    image: './p14.jpg',
    type: 'IoT-Powered Intelligent Garden Monitoring & Control System',
    details: '🛡️ Auto Irrigation + Pest Protection • Sensor-Driven Smart Decisions • Weather-Aware & Rain-Safe • Low-Chemical, Eco-Friendly Care',
    comingSoon: true,
    productLabel: 'premium',
    labelText: 'Premium'
  },
];

// Product Card Component
const ProductCard = ({ product, onAddToCart, isLoggedIn, onAskForQuotation, onShowLoginToast }) => {
  const [selectedOption, setSelectedOption] = useState(product.colors ? product.colors[0] : null);

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedOption);
  };

  const handleQuotationClick = () => {
    if (isLoggedIn) {
      onAskForQuotation(product);
    } else {
      onShowLoginToast();
    }
  };

  return (
    <div className="card shadow-sm h-100 position-relative overflow-hidden">
      {product.bestSeller && (
        <span
          className="best-seller badge position-absolute top-0 end-0 m-2 text-white shadow"
          style={{ zIndex: 10 }}
        >
          Best Seller
        </span>
      )}

      {/* Product Label - Budget Friendly or Premium */}
      {product.productLabel && (
        <span
          className={`product-label-badge ${product.productLabel === 'premium' ? 'premium-label' : 'budget-label'}`}
        >
          {product.productLabel === 'premium' ? '⭐ ' : '💰 '}{product.labelText}
        </span>
      )}

      <img
        src={product.colorImages?.[selectedOption] || product.image}
        className="card-img-top"
        alt={product.name}
        style={{ height: '150px', objectFit: 'cover', transition: '0.3s ease-in-out' }}
      />

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title text-dark flex-grow-1">{product.name}</h5>
          {!product.comingSoon && (
            <p className="card-text text-success fw-bold">₹{product.price.toFixed(2)}</p>
          )}
        </div>
        <p className="card-text text-muted small mb-1">{product.type}</p>
        <p className="product-description">{product.details}</p>

        {product.colors && (
          <div className="mb-3">
            <label htmlFor={`color-select-${product.id}`} className="form-label small text-dark">Select Color:</label>
            <select
              id={`color-select-${product.id}`}
              className="form-select form-select-sm rounded-pill border-success shadow-sm"
              style={{
                backgroundColor: '#f0fdf4',
                borderColor: '#28a745',
                color: '#1b5e20',
                fontWeight: '500'
              }}
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              {product.colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        )}

        {product.comingSoon ? (
          (product.id === 16 || product.id === 17) ? (
            <button
              onClick={handleQuotationClick}
              className={`main-action-button quotation-button mt-auto d-flex align-items-center justify-content-center gap-2 ${product.productLabel === 'premium' ? 'premium-quotation-btn' : ''}`}
            >
              <SendIcon style={{ width: '1.25em', height: '1.25em' }} />
              Ask for Quotation
            </button>
          ) : (
            <button
              className="coming-soon mt-auto d-flex align-items-center justify-content-center gap-2 w-100 py-2"
              disabled
            >
              Coming Soon
            </button>
          )
        ) : (
          <button
            onClick={handleAddToCartClick}
            className="main-action-button add-to-cart-button mt-auto d-flex align-items-center justify-content-center gap-2"
          >
            <PlusIcon style={{ width: '1.25em', height: '1.25em' }} />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

// Quotation Modal Component - Enhanced with File Uploads and Cost Calculator
const QuotationModal = ({ show, onClose, product, currentUser, token, onShowToast }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [frontViewImage, setFrontViewImage] = useState(null);
  const [topViewImage, setTopViewImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [frontViewPreview, setFrontViewPreview] = useState(null);
  const [topViewPreview, setTopViewPreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // New dimension and cost states
  const [heightCm, setHeightCm] = useState('');
  const [widthCm, setWidthCm] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState(0);

  // ML Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionConfidence, setDetectionConfidence] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Calculate estimated cost based on dimensions and product type
  const calculateEstimatedCost = (height, width, productType) => {
    if (!height || !width || height <= 0 || width <= 0) return 0;

    const area = parseFloat(height) * parseFloat(width); // in cm²
    const ratePerCm = productType === 'premium' ? 0.25 : 0.15; // Rate per sq cm
    const minAmount = productType === 'premium' ? 5000 : 3000;

    const calculated = Math.round(area * ratePerCm);
    return Math.max(calculated, minAmount);
  };

  // Update estimated amount when dimensions change
  useEffect(() => {
    const cost = calculateEstimatedCost(heightCm, widthCm, product?.productLabel);
    setEstimatedAmount(cost);
  }, [heightCm, widthCm, product?.productLabel]);

  useEffect(() => {
    // Pre-fill fields from the logged-in user
    if (currentUser) {
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser, show]);

  useEffect(() => {
    // Reset modal state when it's opened
    if (show) {
      setIsSending(false);
      setSendSuccess(false);
      setFrontViewImage(null);
      setTopViewImage(null);
      setVideo(null);
      setFrontViewPreview(null);
      setTopViewPreview(null);
      setHeightCm('');
      setWidthCm('');
      setEstimatedAmount(0);
      setIsAnalyzing(false);
      setDetectionConfidence(null);
      setAnalysisComplete(false);
      if (currentUser) {
        setEmail(currentUser.email || '');
        setPhone(currentUser.phone || '');
      }
    }
  }, [show, currentUser]);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'front') {
        setFrontViewImage(file);
        setFrontViewPreview(URL.createObjectURL(file));
      } else {
        setTopViewImage(file);
        setTopViewPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
    }
  };

  // ML-based pot dimension analysis
  const analyzeImages = async () => {
    if (!frontViewImage || !topViewImage) {
      onShowToast('Please upload both front and top view images first', 'bg-warning');
      return;
    }

    setIsAnalyzing(true);
    setDetectionConfidence(null);

    try {
      const formData = new FormData();
      formData.append('frontViewImage', frontViewImage);
      formData.append('topViewImage', topViewImage);
      formData.append('productType', product?.productLabel || 'budget');

      const response = await fetch('http://localhost:5001/analyze-pot/', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.error && !data.heightCm) {
        throw new Error(data.error);
      }

      // Update dimension fields with ML-detected values (rounded to integers)
      setHeightCm(Math.round(parseFloat(data.heightCm)).toString());
      setWidthCm(Math.round(parseFloat(data.widthCm)).toString());
      setEstimatedAmount(data.estimatedAmount);
      setDetectionConfidence(data.confidence);
      setAnalysisComplete(true);

      onShowToast(`Dimensions detected! Confidence: ${data.confidence}%`, 'bg-success');

    } catch (err) {
      console.error('ML Analysis error:', err);
      onShowToast('Analysis failed. Please enter dimensions manually.', 'bg-warning');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!frontViewImage || !topViewImage) {
      onShowToast('Please upload both front view and top view images', 'bg-danger');
      return;
    }

    if (!heightCm || !widthCm || heightCm <= 0 || widthCm <= 0) {
      onShowToast('Please enter valid height and width dimensions', 'bg-danger');
      return;
    }

    if (estimatedAmount <= 0) {
      onShowToast('Unable to calculate cost. Please check dimensions.', 'bg-danger');
      return;
    }

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append('productId', product.id);
      formData.append('productName', product.name);
      formData.append('productType', product.productLabel || 'budget');
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('heightCm', heightCm);
      formData.append('widthCm', widthCm);
      formData.append('estimatedAmount', estimatedAmount);
      formData.append('frontViewImage', frontViewImage);
      formData.append('topViewImage', topViewImage);
      if (video) {
        formData.append('video', video);
      }

      const response = await fetch("http://localhost:5002/api/shop/submit-quotation", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send quotation');
      }

      setSendSuccess(true);
      setTimeout(() => {
        onClose();
      }, 4000);

    } catch (err) {
      console.error(err);
      onShowToast(`Error: ${err.message}`, 'bg-danger');
      setIsSending(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="payment-success-overlay">
      <div className="quotation-modal-card">
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          disabled={isSending}
          aria-label="Close"
        >
          ✕
        </button>

        {sendSuccess ? (
          <>
            <CheckCircleIcon className="payment-success-icon" />
            <h3 className="mt-3 mb-2 text-dark">Request Submitted!</h3>
            <p className="text-muted text-center">Our team will review your images and send a detailed quotation to:<br /><strong>{email}</strong></p>
            <div className="success-badge mt-3">
              {product.productLabel === 'premium' ? '⭐ Premium Request' : '💰 Budget Friendly Request'}
            </div>
          </>
        ) : (
          <>
            <div className="modal-header-section">
              <SendIcon style={{ width: '50px', height: '50px', color: product.productLabel === 'premium' ? '#FFD700' : '#17a2b8', marginBottom: '0.5rem' }} />
              <h3 className="mt-2 mb-1 text-dark">Request Quotation</h3>
              <span className={`product-type-badge ${product.productLabel === 'premium' ? 'premium' : 'budget'}`}>
                {product.productLabel === 'premium' ? '⭐ Premium' : '💰 Budget Friendly'}
              </span>
              <p className="text-muted text-center mt-2" style={{ fontSize: '14px' }}>
                <strong>{product.name}</strong>
              </p>
            </div>


            <form onSubmit={handleSubmit} className="w-100 mt-4">
              {/* Two Column Layout */}
              <div className="form-grid-container">
                {/* Left Column - Images and Dimensions */}
                <div className="form-left-column">
                  {/* Image Upload Section */}
                  <div className="upload-section mb-3">
                    <h6 className="upload-title d-flex align-items-center gap-2"><CameraIcon style={{ width: '18px', height: '18px', color: '#2e7d32' }} /> Upload Garden Images (Required)</h6>

                    <div className="image-upload-grid">
                      <div className="upload-box">
                        <label htmlFor="frontViewImage" className="upload-label">
                          {frontViewPreview ? (
                            <img src={frontViewPreview} alt="Front View" className="preview-image" />
                          ) : (
                            <div className="upload-placeholder">
                              <CameraIcon style={{ width: '32px', height: '32px', color: '#66bb6a' }} />
                              <span>Front View</span>
                            </div>
                          )}
                        </label>
                        <input
                          type="file"
                          id="frontViewImage"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'front')}
                          className="hidden-input"
                          required
                        />
                      </div>

                      <div className="upload-box">
                        <label htmlFor="topViewImage" className="upload-label">
                          {topViewPreview ? (
                            <img src={topViewPreview} alt="Top View" className="preview-image" />
                          ) : (
                            <div className="upload-placeholder">
                              <SearchZoomIcon style={{ width: '32px', height: '32px', color: '#66bb6a' }} />
                              <span>Top View</span>
                            </div>
                          )}
                        </label>
                        <input
                          type="file"
                          id="topViewImage"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'top')}
                          className="hidden-input"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* AI Image Analysis Section */}
                  {frontViewImage && topViewImage && !analysisComplete && (
                    <div className="analyze-section mb-3">
                      <button
                        type="button"
                        onClick={analyzeImages}
                        disabled={isAnalyzing}
                        className="analyze-button w-100"
                      >
                        {isAnalyzing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Analyzing your pot...
                          </>
                        ) : (
                          <>
                            <RobotIcon style={{ width: '18px', height: '18px', marginRight: '6px' }} />
                            Analyze Images for Dimensions
                          </>
                        )}
                      </button>
                      <small className="text-muted d-block text-center mt-1">AI will estimate pot dimensions from your images</small>
                    </div>
                  )}

                  {/* Garden Dimensions Section */}
                  <div className="dimension-section mb-3">
                    <h6 className="upload-title d-flex align-items-center gap-2">
                      <RulerIcon style={{ width: '18px', height: '18px', color: '#f57c00' }} /> Pot Dimensions
                      {analysisComplete && <span className="ai-badge d-flex align-items-center gap-1"><RobotIcon style={{ width: '12px', height: '12px' }} /> AI-Estimated</span>}
                      {!analysisComplete && <span className="manual-badge">Manual Entry</span>}
                    </h6>
                    {detectionConfidence && (
                      <div className="confidence-display">
                        <span className="confidence-label">Detection Confidence:</span>
                        <span className={`confidence-value ${detectionConfidence >= 70 ? 'high' : detectionConfidence >= 50 ? 'medium' : 'low'}`}>
                          {detectionConfidence}%
                        </span>
                      </div>
                    )}
                    <div className="dimension-grid">
                      <div className="dimension-input-wrapper">
                        <label htmlFor="heightCm" className="form-label small">Height (cm)</label>
                        <input
                          type="number"
                          id="heightCm"
                          className={`form-control form-control-sm ${analysisComplete ? 'ai-detected-input' : ''}`}
                          value={heightCm}
                          onChange={(e) => { setHeightCm(e.target.value); setAnalysisComplete(false); }}
                          placeholder="e.g. 30"
                          min="1"
                          step="1"
                          required
                        />
                      </div>
                      <div className="dimension-input-wrapper">
                        <label htmlFor="widthCm" className="form-label small">Width (cm)</label>
                        <input
                          type="number"
                          id="widthCm"
                          className={`form-control form-control-sm ${analysisComplete ? 'ai-detected-input' : ''}`}
                          value={widthCm}
                          onChange={(e) => { setWidthCm(e.target.value); setAnalysisComplete(false); }}
                          placeholder="e.g. 25"
                          min="1"
                          step="1"
                          required
                        />
                      </div>
                    </div>

                    {/* Estimated Cost Display */}
                    {estimatedAmount > 0 && (
                      <div className="estimated-cost-display">
                        <div className="cost-label">Estimated Cost:</div>
                        <div className="cost-amount">
                          ₹{estimatedAmount.toLocaleString('en-IN')}
                        </div>
                        <small className="cost-note">*Final price may vary based on site assessment</small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Contact Details and Video */}
                <div className="form-right-column">
                  {/* Contact Details */}
                  <div className="contact-details-section">
                    <h6 className="upload-title d-flex align-items-center gap-2"><PhoneIcon style={{ width: '18px', height: '18px', color: '#495057' }} /> Contact Information</h6>

                    <div className="mb-3 text-start">
                      <label htmlFor="quoteEmail" className="form-label d-flex align-items-center gap-2" style={{ fontSize: '14px' }}><MailIcon style={{ width: '16px', height: '16px' }} /> Email Address:</label>
                      <input
                        type="email"
                        className="form-control"
                        id="quoteEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="mb-3 text-start">
                      <label htmlFor="quotePhone" className="form-label d-flex align-items-center gap-2" style={{ fontSize: '14px' }}><PhoneIcon style={{ width: '16px', height: '16px' }} /> Phone Number:</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="quotePhone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        maxLength="10"
                        placeholder="Enter your 10-digit phone number"
                      />
                    </div>

                    {/* Video Upload Section */}
                    <div className="mb-3 text-start">
                      <label htmlFor="videoUpload" className="form-label d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
                        <VideoIcon style={{ width: '16px', height: '16px' }} /> Upload Video (Optional)
                      </label>
                      <input
                        type="file"
                        id="videoUpload"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="form-control"
                      />
                      {video && (
                        <small className="text-success d-block mt-1">✓ {video.name}</small>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit and Cancel Buttons - Full Width */}
              <button
                type="submit"
                className={`main-action-button w-100 py-3 mt-4 ${product.productLabel === 'premium' ? 'premium-submit-btn' : ''}`}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="ms-2">Submitting...</span>
                  </>
                ) : (
                  '📤 Submit Quotation Request'
                )}
              </button>
              <button
                type="button"
                className="btn btn-link text-secondary w-100 mt-2"
                onClick={onClose}
                disabled={isSending}
              >
                Cancel
              </button>
            </form>

          </>
        )}
      </div>
      {/* Modal Styles */}
      <style jsx="true">{`
        .payment-success-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(26, 26, 46, 0.9) 100%);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          z-index: 9999;
          backdrop-filter: blur(12px);
          animation: fadeIn 0.3s ease-out;
          overflow-y: auto;
          padding: 120px 20px 60px 20px;
        }

        .quotation-modal-card {
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
          padding: 40px 45px;
          border-radius: 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(40, 167, 69, 0.1);
          text-align: center;
          width: 100%;
          max-width: 900px;
          max-height: fit-content;
          overflow: visible;
          transform: translateY(0);
          animation: slideIn 0.4s ease-out forwards;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          border: 2px solid rgba(255, 255, 255, 0.8);
        }

        .modal-close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          line-height: 1;
          padding: 0;
        }

        .modal-close-btn:hover:not(:disabled) {
          background-color: #c82333;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
        }

        .modal-close-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-header-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .product-type-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .product-type-badge.premium {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #1a1a2e;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .product-type-badge.budget {
          background: linear-gradient(135deg, #17a2b8, #1fc8e3);
          color: white;
        }

        /* Two Column Grid Layout */
        .form-grid-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          width: 100%;
        }

        .form-left-column,
        .form-right-column {
          display: flex;
          flex-direction: column;
        }

        /* Contact Details Section */
        .contact-details-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 16px;
          padding: 20px;
          border: 2px solid #dee2e6;
          height: 100%;
        }

        .contact-details-section .form-control {
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .contact-details-section .form-control:focus {
          border-color: #28a745;
          box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.1);
        }

        .upload-section {
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          border-radius: 16px;
          padding: 20px;
          border: 2px solid #81c784;
        }

        .upload-title {
          color: #2e7d32;
          margin-bottom: 15px;
          font-size: 15px;
          font-weight: 600;
        }

        .image-upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .upload-box {
          position: relative;
        }

        .upload-label {
          display: block;
          cursor: pointer;
          border: 2px dashed #66bb6a;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 140px;
          background: white;
        }

        .upload-label:hover {
          border-color: #28a745;
          background: #f0fff4;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
          font-size: 12px;
        }

        .upload-icon {
          font-size: 24px;
          margin-bottom: 5px;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hidden-input {
          display: none;
        }

        .dimension-section {
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
          border-radius: 16px;
          padding: 20px;
          border: 2px solid #ffb74d;
        }

        .dimension-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .dimension-input-wrapper label {
          color: #555;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .dimension-input-wrapper input {
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .dimension-input-wrapper input:focus {
          border-color: #28a745;
          box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.15);
        }

        /* Analyze Button Styles */
        .analyze-section {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          border-radius: 12px;
          padding: 15px;
          border: 2px dashed #2196f3;
        }

        .analyze-button {
          background: linear-gradient(135deg, #2196f3, #1976d2);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .analyze-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4);
        }

        .analyze-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* AI Badge Styles */
        .ai-badge {
          background: linear-gradient(135deg, #9c27b0, #7b1fa2);
          color: white;
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 12px;
          margin-left: 8px;
          font-weight: 600;
        }

        .manual-badge {
          background: #e0e0e0;
          color: #666;
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 12px;
          margin-left: 8px;
          font-weight: 500;
        }

        /* Confidence Display */
        .confidence-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 10px;
          padding: 6px 12px;
          background: rgba(156, 39, 176, 0.1);
          border-radius: 8px;
        }

        .confidence-label {
          font-size: 11px;
          color: #666;
        }

        .confidence-value {
          font-size: 13px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .confidence-value.high {
          background: #c8e6c9;
          color: #2e7d32;
        }

        .confidence-value.medium {
          background: #fff3e0;
          color: #e65100;
        }

        .confidence-value.low {
          background: #ffcdd2;
          color: #c62828;
        }

        /* AI Detected Input Highlight */
        .ai-detected-input {
          border-color: #9c27b0 !important;
          background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%) !important;
        }

        .ai-detected-input:focus {
          border-color: #7b1fa2 !important;
          box-shadow: 0 0 0 3px rgba(156, 39, 176, 0.2) !important;
        }

        .estimated-cost-display {
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          border-radius: 12px;
          padding: 15px;
          margin-top: 12px;
          text-align: center;
          border: 2px solid #4caf50;
        }

        .cost-label {
          font-size: 12px;
          color: #2e7d32;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cost-amount {
          font-size: 28px;
          font-weight: 700;
          color: #1b5e20;
          margin: 5px 0;
        }

        .cost-note {
          color: #666;
          font-size: 10px;
        }

        .success-badge {
          background: linear-gradient(135deg, #4caf50, #2e7d32);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
        }

        .premium-submit-btn {
          background: linear-gradient(135deg, #FFD700, #FFA500) !important;
          color: #1a1a2e !important;
        }

        .premium-submit-btn:hover {
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4) !important;
        }

        .payment-success-icon {
          animation: checkmarkGrow 0.6s ease-out forwards;
          transform-origin: center;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawCheckmark 0.8s ease-out forwards, pulseGreen 1.5s infinite alternate;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(50px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes drawCheckmark {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes pulseGreen {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Payment Success Animation
const PaymentSuccessAnimation = ({ onHideAnimation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onHideAnimation();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onHideAnimation]);

  return (
    <div className="payment-success-overlay">
      <div className="payment-success-card">
        <CheckCircleIcon className="payment-success-icon" />
        <h3 className="mt-3 mb-2 text-dark">Payment Successful!</h3>
        <p className="text-muted text-center">Your order has been confirmed.</p>
        <p className="text-muted text-center">An email receipt has been sent.</p>
        <button onClick={onHideAnimation} className="btn btn-success mt-4">
          Continue Shopping
        </button>
      </div>

      <style jsx="true">{`
                .payment-success-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    backdrop-filter: blur(5px);
                    animation: fadeIn 0.3s ease-out;
                }

                .payment-success-card {
                    background-color: #fff;
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    text-align: center;
                    max-width: 400px;
                    transform: translateY(20px);
                    animation: slideIn 0.4s ease-out forwards;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .payment-success-icon {
                    animation: checkmarkGrow 0.6s ease-out forwards;
                    transform-origin: center;
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    animation: drawCheckmark 0.8s ease-out forwards, pulseGreen 1.5s infinite alternate;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(50px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                @keyframes drawCheckmark {
                    to {
                        stroke-dashoffset: 0;
                    }
                }

                @keyframes pulseGreen {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
    </div>
  );
};

// Payment Failure Animation
const PaymentFailureAnimation = ({ onHideAnimation }) => {
  useEffect(() => {
    const timer = setTimeout(onHideAnimation, 4000);
    return () => clearTimeout(timer);
  }, [onHideAnimation]);

  return (
    <div className="payment-failure-popup-overlay">
      <div className="payment-failure-card">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <h3 className="mt-3 mb-2 text-dark">Payment Cancelled</h3>
        <p className="text-muted text-center">Your order was not placed. You exited the payment process.</p>
        <button onClick={onHideAnimation} className="btn btn-danger mt-4">
          Close
        </button>
      </div>
      <style jsx="true">{`
        .payment-failure-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          backdrop-filter: blur(5px);
          animation: fadeInOverlay 0.3s ease-out;
        }

        .payment-failure-card {
          background-color: #fff;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          text-align: center;
          max-width: 400px;
          transform: translateY(20px);
          animation: slideInCard 0.4s ease-out forwards;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInCard {
          from { opacity: 0; transform: translateY(50px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

// Checkout Form Component
const CheckoutForm = ({ onBackToCart, cartData, onCloseCart, onPaymentSuccess, setShowPaymentFailure, handlePlaceOrder, isProcessingOrder, setIsProcessingOrder }) => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', area: '', city: '', state: '', pincode: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors(prev => {
      const { pincode, city, state, ...rest } = prev;
      return rest;
    });

    if (formData.pincode.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
        .then(res => res.json())
        .then(data => {
          if (
            data[0].Status === 'Success' &&
            data[0].PostOffice &&
            data[0].PostOffice.length > 0
          ) {
            const postOffice = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: postOffice.District,
              state: postOffice.State
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              city: '',
              state: ''
            }));
            setErrors(prev => ({ ...prev, pincode: 'Invalid Pincode.' }));
          }
        })
        .catch(() => {
          console.warn('Invalid PIN or network error');
          setFormData(prev => ({
            ...prev,
            city: '',
            state: ''
          }));
          setErrors(prev => ({ ...prev, pincode: 'Failed to fetch Pincode details.' }));
        });
    } else if (formData.pincode.length > 0 && formData.pincode.length < 6) {
      setErrors(prev => ({ ...prev, pincode: 'Pincode must be 6 digits.' }));
      setFormData(prev => ({
        ...prev,
        city: '',
        state: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        city: '',
        state: ''
      }));
    }
  }, [formData.pincode]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.area.trim()) newErrors.area = 'Area is required.';

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required.';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits.';
    }

    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.state.trim()) newErrors.state = 'State is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="p-4 d-flex flex-column" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <div className="flex-shrink-0">
        <button onClick={onBackToCart} className="btn btn-link text-dark d-flex align-items-center gap-2 mb-4 p-0 text-decoration-none">
          <ArrowLeftIcon style={{ width: '1.25em', height: '1.25em' }} />
          Back to Cart
        </button>
        <h3 className="mb-4 text-dark">Checkout</h3>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (validateForm()) {
            handlePlaceOrder(formData, cartData, onCloseCart, onPaymentSuccess);
          }
        }}
        className="flex-grow-1"
        id="checkout-form"
        style={{
          maxWidth: '600px',
          margin: 'auto',
          padding: '1.5rem',
          background: '#fffef3',
          borderRadius: '16px',
          boxShadow: '0 0 10px rgba(0,0,0,0.05)',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
        }}
      >
        <h4 className="mb-3 text-secondary">Shipping Address</h4>
        <div className="mb-3">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
            required
          />
          {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            maxLength={10}
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            required
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="address">Plot No. / Address</label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            required
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="area">Area</label>
          <input
            type="text"
            id="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Enter your area"
            className={`form-control ${errors.area ? 'is-invalid' : ''}`}
            required
          />
          {errors.area && <div className="invalid-feedback">{errors.area}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="pincode">Pincode</label>
          <input
            type="text"
            id="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
            maxLength={6}
            className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
            required
          />
          {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              readOnly
              className={`form-control ${errors.city ? 'is-invalid' : ''}`}
              required
            />
            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
              readOnly
              className={`form-control ${errors.state ? 'is-invalid' : ''}`}
              required
            />
            {errors.state && <div className="invalid-feedback">{errors.state}</div>}
          </div>
        </div>
      </form>
      <div className="flex-shrink-0 mt-4">
        <button
          className="main-action-button w-100 py-3"
          type="submit"
          form="checkout-form"
          disabled={isProcessingOrder}
        >
          {isProcessingOrder ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="ms-2">Processing...</span>
            </>
          ) : (
            'Place Order Now'
          )}
        </button>
      </div>
    </div>
  );
};

// Cart Sidebar Component
const CartSidebar = ({ isOpen, onClose, cart, onRemoveFromCart, onUpdateQuantity, onClearCart, onPaymentSuccess, setShowPaymentFailure, handlePlaceOrder, isProcessingOrder, setIsProcessingOrder }) => {
  const [view, setView] = useState('cart');

  const total = useMemo(() =>
    cart.reduce((sum, item) => {
      if (item.comingSoon) return sum;
      return sum + item.price * item.quantity;
    }, 0),
    [cart]
  );

  const handleCheckout = () => setView('checkout');
  const handleBackToCart = () => setView('cart');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setView('cart'), 300);
    }
  }, [isOpen]);

  return (
    <>
      <div
        className={`offcanvas-backdrop fade ${isOpen ? 'show' : ''}`}
        style={{ display: isOpen ? 'block' : 'none' }}
        onClick={onClose}
      ></div>

      <div
        className={`offcanvas offcanvas-end ${isOpen ? 'show' : ''}`}
        tabIndex="-1"
        id="cartOffcanvas"
        aria-labelledby="cartOffcanvasLabel"
        style={{
          visibility: isOpen ? 'visible' : 'hidden',
          width: '100%',
          maxWidth: '450px',
          backgroundColor: '#F5F5DC',
          marginTop: '110px',
          height: 'calc(100vh - 90px)'
        }}
      >
        <div className="offcanvas-header pb-0 border-bottom">
          {view === 'cart' ? (
            <>
              <h5 className="offcanvas-title text-dark" id="cartOffcanvasLabel">
                My Cart ({cart.length})
              </h5>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </>
          ) : (
            null
          )}
        </div>
        <div className="offcanvas-body d-flex flex-column p-0">
          {view === 'cart' ? (
            <>
              {cart.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-4">
                  <p className="text-secondary fs-5">Your cart is empty.</p>
                  <button onClick={onClose} className="btn btn-link text-success text-decoration-underline mt-3">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="flex-grow-1 overflow-auto p-4">
                  {cart.map(item => (
                    <div key={`${item.id}-${item.selectedOption || ''}`} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom cart-item-animate">
                      <img src={item.image} className="rounded" alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'cover' }} />
                      <div className="flex-grow-1">
                        <p className="fw-bold mb-1 text-dark">
                          {item.name}
                          {item.selectedOption && ` (${item.selectedOption})`}
                        </p>
                        {!item.comingSoon ? (
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.selectedOption)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="text-sm text-muted">{item.quantity}</span>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.selectedOption)}
                            >
                              +
                            </button>
                            <span className="text-sm text-muted ms-auto">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ) : (
                          <p className="fw-bold text-info mb-0">Coming Soon</p>
                        )}
                      </div>
                      <button onClick={() => onRemoveFromCart(item.id, item.selectedOption)} className="btn btn-outline-danger btn-sm border-0 p-1">
                        <Trash2Icon style={{ width: '1.25em', height: '1.25em' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {cart.filter(item => !item.comingSoon).length > 0 && (
                <div className="p-4 border-top">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="h5 text-dark">Total</p>
                    <p className="h4 fw-bold text-dark">₹{total.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="main-action-button w-100 py-3"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </>
          ) : (
            <CheckoutForm
              onBackToCart={handleBackToCart}
              cartData={cart}
              onCloseCart={() => { onClose(); onClearCart(); }}
              onPaymentSuccess={onPaymentSuccess}
              setShowPaymentFailure={setShowPaymentFailure}
              handlePlaceOrder={handlePlaceOrder}
              isProcessingOrder={isProcessingOrder}
              setIsProcessingOrder={setIsProcessingOrder}
            />
          )}
        </div>
      </div>
    </>
  );
};

// Main App Component
export default function Page() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastBg, setToastBg] = useState('bg-success');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaymentFailure, setShowPaymentFailure] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [currentQuotationProduct, setCurrentQuotationProduct] = useState(null);

  const isLoggedIn = !!currentUser;

  // Check for existing login in localStorage when page loads
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { user, token } = JSON.parse(userInfo);
      setCurrentUser(user);
      setToken(token);
    }
  }, []);

  const showAppToast = (message, bg = 'bg-success') => {
    setToastMessage(message);
    setToastBg(bg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('userInfo');
    showAppToast('You have been logged out.', 'bg-dark');
  };

  // Quotation modal handler
  const handleAskForQuotation = (product) => {
    setCurrentQuotationProduct(product);
    setShowQuotationModal(true);
  };

  const handlePlaceOrder = async (formData, cartData, onCloseCart, onPaymentSuccess) => {
    console.log("🟢 Place Order clicked");
    setIsProcessingOrder(true);

    const totalAmount = cartData.reduce(
      (sum, item) => item.comingSoon ? sum : sum + item.price * item.quantity,
      0
    );
    const amountInPaise = Math.round(totalAmount * 100);

    console.log("Total Amount (INR):", totalAmount, "Amount (Paise):", amountInPaise);

    try {
      const response = await fetch("http://localhost:5002/api/shop/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise }),
      });

      const orderData = await response.json();

      if (!orderData.orderId) {
        alert("❌ Failed to initiate payment. Please try again. No order ID received.");
        setIsProcessingOrder(false);
        return;
      }

      const options = {
        key: 'rzp_test_PPZSpcfj6SfJPt',
        amount: orderData.amount,
        currency: "INR",
        name: "Growlify Gardening",
        description: "Plant Order Payment",
        order_id: orderData.orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#1e7e34" },
        handler: async function (response) {
          console.log("✅ Razorpay payment successful:", response);

          try {
            await fetch("http://localhost:5002/api/shop/send-confirmation", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                formData,
                cart: cartData,
                paymentResponse: response,
              }),
            });
            onPaymentSuccess();
          } catch (error) {
            console.error("Error sending confirmation email:", error);
            alert("Payment successful, but failed to send confirmation email.");
          } finally {
            setIsProcessingOrder(false);
            onCloseCart();
          }
        },
        modal: {
          ondismiss: function () {
            console.log("❌ Payment popup dismissed");
            setIsProcessingOrder(false);
            setShowPaymentFailure(true);
            window.scrollTo({ top: 0, behavior: "smooth" });

            setTimeout(() => {
              setShowPaymentFailure(false);
            }, 4000);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed details:", response.error);
        setIsProcessingOrder(false);
        setShowPaymentFailure(true);
      });
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Failed to initiate payment. Please try again.");
      setIsProcessingOrder(false);
    }
  };

  const handleAddToCart = (product, selectedOption = null) => {
    if (product.comingSoon) {
      alert("This product is coming soon and cannot be added to the cart yet!");
      return;
    }

    setCart(prevCart => {
      const cartItemId = `${product.id}-${selectedOption || ''}`;
      const existingItem = prevCart.find(item => `${item.id}-${item.selectedOption || ''}` === cartItemId);

      if (existingItem) {
        showAppToast(`${product.name} quantity updated!`, 'bg-dark');
        return prevCart.map(item =>
          `${item.id}-${item.selectedOption || ''}` === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      showAppToast(`${product.name} added to cart!`);
      return [...prevCart, { ...product, quantity: 1, selectedOption }];
    });
  };

  const handleRemoveFromCart = (productId, selectedOption = null) => {
    setCart(prevCart => prevCart.filter(item => {
      const itemIdentifier = `${item.id}-${item.selectedOption || ''}`;
      const targetIdentifier = `${productId}-${selectedOption || ''}`;
      return itemIdentifier !== targetIdentifier;
    }));
  };

  const handleUpdateQuantity = (productId, quantity, selectedOption = null) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId, selectedOption);
    } else {
      setCart(prevCart =>
        prevCart.map(item => {
          const itemIdentifier = `${item.id}-${item.selectedOption || ''}`;
          const targetIdentifier = `${productId}-${selectedOption || ''}`;
          return itemIdentifier === targetIdentifier ? { ...item, quantity } : item;
        })
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentSuccess(true);
    setIsCartOpen(false);
    handleClearCart();
  };

  const handleHidePaymentSuccess = () => {
    setShowPaymentSuccess(false);
  };

  const cartItemCount = useMemo(() =>
    cart.reduce((count, item) => (item.comingSoon ? count : count + item.quantity), 0),
    [cart]
  );

  return (
    <div
      style={{
        backgroundColor: '#F5F5DC',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <main
        className="container py-5"
        style={{
          marginTop: '90px',
        }}
      >
        <div className="p-4 rounded-3 shadow-lg mb-5 d-flex justify-content-between align-items-center header-banner" style={{ backgroundColor: '#E9E9D4', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(40, 167, 69, 0.05) 50%, transparent 70%)',
            animation: 'shimmer 3s infinite',
            pointerEvents: 'none'
          }}></div>

          <div className="d-flex align-items-center gap-3" style={{ position: 'relative', zIndex: 1 }}>
            <div className="bg-success-subtle p-3 rounded-circle logo-container" style={{
              background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
              boxShadow: '0 4px 12px rgba(40, 167, 69, 0.2)'
            }}>
              <LeafIcon style={{ width: '2em', height: '2em', color: '#1B5E20' }} />
            </div>
            <div className="header-text">
              <h1 className="display-5 fw-bold text-dark mb-1" style={{
                background: 'linear-gradient(135deg, #1B5E20 0%, #28a745 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Gardening Essentials</h1>
              <p className="text-secondary mb-0">Everything you need for your urban gardening journey.</p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3" style={{ position: 'relative', zIndex: 1 }}>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="btn btn-success d-flex align-items-center gap-2"
                title={`Logged in as ${currentUser.name}`}
              >
                <UserIcon style={{ width: '1.5em', height: '1.5em' }} />
                Logout
              </button>
            ) : (
              <a
                href="./auth" // <-- This points to your login page
                className="btn btn-outline-success d-flex align-items-center gap-2"
                title="Login"
              >
                <UserIcon style={{ width: '1.5em', height: '1.5em' }} />
                Login
              </a>
            )}

            <button onClick={() => setIsCartOpen(true)} className="btn btn-link text-dark position-relative p-0 text-decoration-none cart-button">
              <ShoppingCartIcon style={{ width: '2em', height: '2em' }} />
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                  {cartItemCount}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
            </button>
          </div>
        </div>


        <div className="row justify-content-center g-4 mb-5 mt-5">
          {products.filter(p => p.id === 16 || p.id === 17).map((product, index) => (
            <div
              className="col-md-6 col-lg-5 product-card-wrapper d-flex"
              key={product.id}
              style={{
                animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`
              }}
            >
              <div className="w-100" style={{ transition: 'transform 0.3s ease', zIndex: 5 }}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  isLoggedIn={isLoggedIn}
                  onAskForQuotation={handleAskForQuotation}
                  onShowLoginToast={() => {
                    showAppToast('Please login to ask for a quotation.', 'bg-dark');
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="section-divider mb-4 text-center">
          <h3 className="text-secondary fw-bold position-relative d-inline-block pb-2 border-bottom border-success border-3">
            Browse Our Collection
          </h3>
        </div>

        {/* Regular Products Grid */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {products.filter(p => p.id !== 16 && p.id !== 17).map((product, index) => (
            <div
              className="col product-card-wrapper"
              key={product.id}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`
              }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                isLoggedIn={isLoggedIn}
                onAskForQuotation={handleAskForQuotation}
                onShowLoginToast={() => {
                  showAppToast('Please login to ask for a quotation.', 'bg-dark');
                }}
              />
            </div>
          ))}
        </div>
      </main >

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onPaymentSuccess={handlePaymentSuccess}
        setShowPaymentFailure={setShowPaymentFailure}
        handlePlaceOrder={handlePlaceOrder}
        isProcessingOrder={isProcessingOrder}
        setIsProcessingOrder={setIsProcessingOrder}
      />

      {/* Quotation Modal */}
      {
        currentQuotationProduct && (
          <QuotationModal
            show={showQuotationModal}
            onClose={() => setShowQuotationModal(false)}
            product={currentQuotationProduct}
            currentUser={currentUser}
            token={token}
            onShowToast={showAppToast}
          />
        )
      }

      {
        showToast && (
          <div
            className={`toast show align-items-center text-white ${toastBg} border-0 fade`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050 }}
          >
            <div className="d-flex">
              <div className="toast-body">
                {toastMessage}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        )
      }

      {
        showPaymentSuccess && (
          <PaymentSuccessAnimation onHideAnimation={handleHidePaymentSuccess} />
        )
      }

      {
        showPaymentFailure && (
          <PaymentFailureAnimation onHideAnimation={() => setShowPaymentFailure(false)} />
        )
      }

      {/* --- All <style jsx="true"> tags remain the same --- */}
      <style jsx="true">{`
      /* ============================================
        GLOBAL STYLES & ANIMATIONS
        ============================================ */
      
      html, body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        scroll-behavior: smooth;
      }
      
      /* ============================================
        KEYFRAME ANIMATIONS
        ============================================ */
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes bounceIn {
        0% {
          opacity: 0;
          transform: scale(0.3) rotate(-180deg);
        }
        50% {
          opacity: 1;
          transform: scale(1.1) rotate(10deg);
        }
        70% {
          transform: scale(0.9) rotate(-5deg);
        }
        100% {
          transform: scale(1) rotate(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes shimmer {
        0% {
          background-position: -200% center;
        }
        100% {
          background-position: 200% center;
        }
      }

      @keyframes sparkle {
        0%, 100% {
          opacity: 0;
          transform: scale(0.8) rotate(0deg);
        }
        50% {
          opacity: 1;
          transform: scale(1.4) rotate(45deg);
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-8px);
        }
      }
      
      @keyframes pulse-glow {
        0%, 100% {
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.4);
        }
        50% {
          box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.4);
        }
      }
      
      @keyframes bounce-in {
        0% {
          opacity: 0;
          transform: scale(0.3) translateY(20px);
        }
        50% {
          opacity: 1;
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.95);
        }
        100% {
          transform: scale(1);
        }
      }
      
      @keyframes gradient-shift {
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
      
      @keyframes spin-slow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
            @keyframes checkmarkGrow {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .form-grid-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .quotation-modal-card {
            max-width: 95%;
            padding: 30px 25px;
          }

          .payment-success-overlay {
            padding: 100px 15px 40px 15px;
          }
        }
      
      @keyframes slideInFromRight {
        from {
          transform: translateX(100%);
          opacity: 0.8;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeInItem {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 0.5;
        }
      }
      
      /* ============================================
        HEADER ANIMATIONS
        ============================================ */
      
      .header-banner {
        animation: slideDown 0.6s ease-out;
      }
      
      .logo-container {
        animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s both;
      }
      
      .header-text h1 {
        animation: slideInLeft 0.8s ease-out 0.4s both;
      }
      
      .header-text p {
        animation: slideInLeft 0.8s ease-out 0.6s both;
      }
      
      .cart-button {
        animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s both;
      }
      
      /* ============================================
        PRODUCT CARDS
        ============================================ */
      
      .product-card-wrapper {
        will-change: transform, opacity;
      }
      
      .card {
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        border: none;
        box-shadow: 0 4px 8px rgba(0,0,0,.05);
        border-radius: 1rem;
        background-color: #ffffff;
        color: var(--card-foreground);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform, box-shadow;
        position: relative;
        overflow: hidden;
      }
      
      .card::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg,
          transparent,
          rgba(40, 167, 69, 0.1),
          transparent
        );
        transform: rotate(45deg);
        transition: all 0.6s ease;
        pointer-events: none;
        opacity: 0;
      }
      
      .card:hover::before {
        animation: shimmer 1.5s infinite;
        opacity: 1;
      }
      
      .card:hover {
          background: linear-gradient(135deg, #ffffff 0%, #f8fff9 100%);
          transform: translateY(-10px) scale(1.02);
          box-shadow: 
            0 20px 40px rgba(40, 167, 69, 0.15),
            0 0 0 1px rgba(40, 167, 69, 0.1),
            inset 0 1px 0 rgba(255,255,255,0.8);
      }
      
      .card-body {
        position: relative;
        z-index: 1;
      }
      
      .card-img-top {
        transition: transform 0.5s ease, filter 0.3s ease;
      }
      
      .card:hover .card-img-top {
        transform: scale(1.1) rotate(2deg);
        filter: brightness(1.05) contrast(1.05);
      }
      
      .card-title {
        font-family: 'Inter', 'Poppins', 'Segoe UI', sans-serif;
        font-weight: 600;
        font-size: 1.25rem;
        color: #1f1f1f;
        transition: color 0.3s ease;
      }
      
      .card:hover .card-title {
        color: #28a745;
      }
      
      .card-text.text-success.fw-bold {
        font-family: 'Inter', 'Poppins', 'Segoe UI', sans-serif;
        font-weight: 600;
        font-size: 1.125rem;
        color: #28a745;
        transition: all 0.3s ease;
      }
      
      .card:hover .card-text.text-success.fw-bold {
        transform: scale(1.1);
        text-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
      }
      
      .card-text.text-muted.small.mb-1 {
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        font-size: 17px;
        color: #060707ff;
        letter-spacing: 0.3px;
        margin-top: 4px;
      }

      .product-description {
        font-family: sans-serif;
        font-style: italic;
        font-weight: 500;
        font-size: 17px;
        color: #444;
      }

      .form-label.small.text-dark {
        font-size: 0.875rem;
        font-weight: 500;
        color: #444;
      }
      
      /* ============================================
        BADGES & LABELS
        ============================================ */
      
      .best-seller, .coming-soon {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 6px 14px;
        background: linear-gradient(90deg, #ff4e50 0%, #ff0000 50%, #ff4e50 100%);
        background-size: 300% auto;
        color: white !important;
        font-weight: bold;
        border-radius: 20px;
        border: none;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.4);
        animation: shimmer 2.5s linear infinite, pulse-glow 2s ease-in-out infinite, float 3s ease-in-out infinite;
        overflow: hidden;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        letter-spacing: 0.5px;
      }

      .best-seller::after, .coming-soon::after {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        top: 10%;
        right: 10%;
        background: radial-gradient(circle, #fff, transparent);
        border-radius: 50%;
        box-shadow:
          0 0 8px rgba(255, 255, 255, 0.9),
          0 0 12px rgba(255, 255, 255, 0.7);
        animation: sparkle 2s ease-in-out infinite;
      }
      
      .best-seller::before, .coming-soon::before {
        content: "";
        position: absolute;
        width: 6px;
        height: 6px;
        bottom: 15%;
        left: 15%;
        background: radial-gradient(circle, #fff, transparent);
        border-radius: 50%;
        box-shadow:
          0 0 6px rgba(255, 255, 255, 0.8),
          0 0 10px rgba(255, 255, 255, 0.6);
        animation: sparkle 2.5s ease-in-out infinite 0.5s;
      }
      
      /* ============================================
        BUTTONS
        ============================================ */
      
      .main-action-button,
      .add-to-cart-button {
        background: linear-gradient(135deg, #28a745 0%, #34ce57 100%) !important;
        background-size: 200% 200%;
        border: none !important;
        padding: 12px 24px;
        color: white !important;
        font-weight: bold;
        border-radius: 10px;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        margin-top: 16px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        text-decoration: none;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        animation: gradient-shift 3s ease infinite;
      }
      
      .main-action-button::before,
      .add-to-cart-button::before {
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
      
      .main-action-button:hover::before,
      .add-to-cart-button:hover::before {
        width: 300px;
        height: 300px;
      }

      .main-action-button:hover,
      .add-to-cart-button:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 
          0 10px 30px rgba(40, 167, 69, 0.4),
          0 0 20px rgba(40, 167, 69, 0.2),
          inset 0 1px 0 rgba(255,255,255,0.3);
        background: linear-gradient(135deg, #34ce57 0%, #28a745 100%) !important;
        color: white !important;
      }
      
      .main-action-button:active,
      .add-to-cart-button:active {
        transform: translateY(-1px) scale(1.02);
        transition: all 0.1s ease;
      }
      
      .main-action-button svg,
      .add-to-cart-button svg {
        transition: transform 0.3s ease;
      }
      
      .add-to-cart-button:hover svg {
        transform: rotate(90deg) scale(1.1);
      }
      
      .quotation-button {
        background: linear-gradient(135deg, #17a2b8 0%, #1fc8e3 100%) !important;
        box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
      }
      
      .quotation-button:hover {
        background: linear-gradient(135deg, #1fc8e3 0%, #17a2b8 100%) !important;
        box-shadow: 
          0 10px 30px rgba(23, 162, 184, 0.4),
          0 0 20px rgba(23, 162, 184, 0.2);
      }
      
      .quotation-button:hover svg {
         transform: scale(1.1) translateX(2px);
      }

      .coming-soon {
        background: linear-gradient(135deg, #dc3545 0%, #ff4458 100%) !important;
        background-size: 200% 200%;
        border: none !important;
        padding: 12px 24px;
        color: white !important;
        font-weight: bold;
        border-radius: 10px;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        margin-top: 16px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        text-decoration: none;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
        animation: gradient-shift 3s ease infinite, pulse-glow 2s ease-in-out infinite;
        cursor: not-allowed;
      }

      .coming-soon:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 
          0 10px 30px rgba(220, 53, 69, 0.5),
          0 0 20px rgba(255, 0, 0, 0.4);
        background: linear-gradient(135deg, #ff4458 0%, #dc3545 100%) !important;
        color: white !important;
        text-decoration: none;
      }
      
      /* ============================================
        FORM INPUTS
        ============================================ */
      
      form input {
        width: 100%;
        padding: 6px 12px;
        margin-bottom: 12px;
        border: 2px solid #e0e0d0;
        border-radius: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background-color: #EFEFD8;
        font-size: 0.9rem;
        position: relative;
      }

      form input:focus {
        border-color: #28a745;
        box-shadow: 
          0 0 0 3px rgba(40, 167, 69, 0.1),
          0 4px 12px rgba(40, 167, 69, 0.15);
        outline: none;
        background-color: #ffffff;
        transform: translateY(-1px);
      }
      
      form input:hover:not(:focus) {
        border-color: #b8b8a0;
        background-color: #f8f8e8;
      }

      form label {
        font-weight: 600;
        margin-bottom: 4px;
        display: block;
        color: #444;
        font-size: 0.9rem;
        transition: color 0.2s ease;
      }
      
      form input:focus + label,
      form input:focus ~ label {
        color: #28a745;
      }
      
      form .form-control.is-invalid {
        border-color: #dc3545;
        padding-right: calc(1.5em + 0.75rem);
        background-image: none;
      }
      
      form .invalid-feedback {
        display: block;
        margin-top: -8px;
        margin-bottom: 8px;
        font-size: 0.875em;
        color: #dc3545;
      }
      
      .form-select {
        transition: all 0.3s ease;
      }
      
      .form-select:focus {
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
      }
      
      /* ============================================
        SHOPPING CART & ICONS
        ============================================ */
      
      .btn-link svg {
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      
      .btn-link:hover svg {
        transform: scale(1.2) rotate(5deg);
        color: #28a745 !important;
        filter: drop-shadow(0 4px 8px rgba(40, 167, 69, 0.3));
      }
      
      .badge {
        animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        transition: all 0.3s ease;
      }
      
      .btn-link:hover .badge {
        transform: scale(1.15);
        box-shadow: 0 0 15px rgba(40, 167, 69, 0.5);
      }
      
      /* ============================================
        TOAST NOTIFICATIONS
        ============================================ */
      
      .toast {
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        border-left: 4px solid #ffffff;
      }
      
      /* ============================================
        OFFCANVAS CART SIDEBAR
        ============================================ */
      
      .offcanvas {
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .offcanvas.show {
        animation: slideInFromRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .cart-item-animate {
        animation: fadeInItem 0.3s ease-out both;
      }
      
      .offcanvas-body > div > div:nth-child(1) { animation-delay: 0.05s; }
      .offcanvas-body > div > div:nth-child(2) { animation-delay: 0.1s; }
      .offcanvas-body > div > div:nth-child(3) { animation-delay: 0.15s; }
      .offcanvas-body > div > div:nth-child(4) { animation-delay: 0.2s; }
      .offcanvas-body > div > div:nth-child(5) { animation-delay: 0.25s; }
      
      .offcanvas-backdrop {
        transition: opacity 0.3s ease;
      }
      
      .offcanvas-backdrop.show {
        animation: fadeIn 0.3s ease;
      }
      
      /* ============================================
        CART ITEM CONTROLS
        ============================================ */
      
      .btn-outline-secondary {
        transition: all 0.2s ease;
      }
      
      .btn-outline-secondary:hover:not(:disabled) {
        transform: scale(1.15);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
      
      .btn-outline-secondary:active:not(:disabled) {
        transform: scale(0.95);
      }
      
      .btn-outline-danger {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .btn-outline-danger:hover {
        transform: scale(1.1) rotate(10deg);
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
      }
      
      /* ============================================
        EMOJI STYLING
        ============================================ */
      
      .card-emoji {
          font-size: 3rem;
          line-height: 1;
          margin-bottom: 1rem;
          display: inline-block;
          animation: float 3s ease-in-out infinite;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
      }
      
      .card:hover .card-emoji {
        animation: float 3s ease-in-out infinite, spin-slow 10s linear infinite;
      }
      
      /* ============================================
        IMAGE PLACEHOLDERS
        ============================================ */
      
      .image-placeholder {
          background-color: var(--muted);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 250px;
          color: var(--muted-foreground);
          font-size: 1.25rem;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
          overflow: hidden;
      }
      
      .image-placeholder img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      /* ============================================
        RESPONSIVE MOBILE STYLES
        ============================================ */
      
      @media (max-width: 767.98px) {
        .header-banner {
          flex-direction: column;
          text-align: center;
          gap: 1rem;
        }
        
        .header-text h1 {
          font-size: 1.75rem;
        }
        
        .card-title {
          font-size: 1.1rem;
        }
        
        .card-text.text-success.fw-bold {
          font-size: 1rem;
        }
      }
      
      /* ============================================
        UTILITY CLASSES
        ============================================ */
      
      .cta-section h2, .cta-section p {
          color: white;
      }
      
      .cta-section p {
          opacity: 0.9;
      }
      
      /* ============================================
        PERFORMANCE OPTIMIZATIONS
        ============================================ */
      
      .card,
      .main-action-button,
      .add-to-cart-button,
      .product-card-wrapper {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Enable GPU acceleration for smoother animations */
      .card:hover,
      .main-action-button:hover,
      .add-to-cart-button:hover {
        will-change: transform;
      }
    `}</style>
    </div >
  );
}
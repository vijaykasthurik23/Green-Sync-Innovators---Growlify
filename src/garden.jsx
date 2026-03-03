import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Sprout, Plus, GitBranch, Grid3x3, XCircle, Sun, CloudRain, Snowflake, Calendar, Sparkles } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Base URL for your backend API - IMPORTANT: Ensure this is correct!
const API_BASE_URL = 'http://localhost:5002/api';

// 🌟 FIX: Function to get the JWT token from the 'userInfo' object in localStorage
const getAuthToken = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        return JSON.parse(userInfo).token; // Get the token from the userInfo object
    }
    return null;
};

// 🌿 Plant suggestions data mapping by district
// 🌿 Plant suggestions data mapping by district with SEASONAL info
const PLANT_SUGGESTIONS = {
    // Karnataka
    'Bengaluru': [
        { name: 'Hibiscus', reason: 'Thrives in moderate climate year-round.', seasons: ['All Year', 'Summer'] },
        { name: 'Rose', reason: 'Loves the cool nights and warm days.', seasons: ['Winter', 'Spring', 'All Year'] },
        { name: 'Marigold', reason: 'Grows easily with consistent sunshine.', seasons: ['Summer', 'Winter'] },
        { name: 'Jasmine', reason: 'Flourishes in balanced rainfall.', seasons: ['Monsoon', 'Summer'] },
        { name: 'Curry Leaf', reason: 'Native to South India, humid conditions.', seasons: ['All Year'] },
        { name: 'Aloe Vera', reason: 'Hardy and thrives in Bengaluru weather.', seasons: ['All Year'] }
    ],
    // Tamil Nadu
    'Chennai': [
        { name: 'Bougainvillea', reason: 'Loves hot, dry conditions.', seasons: ['Summer', 'All Year'] },
        { name: 'Tulsi', reason: 'Thrives in humid coastal heat.', seasons: ['All Year'] },
        { name: 'Neem', reason: 'Handles intense sun and poor soil.', seasons: ['Summer', 'All Year'] },
        { name: 'Coconut Palm', reason: 'Ideal for tropical, humid climate.', seasons: ['All Year'] },
        { name: 'Plumeria', reason: 'Flourishes in hot weather.', seasons: ['Summer'] },
        { name: 'Jasmine', reason: 'Perfect for the warm climate.', seasons: ['Summer', 'Monsoon'] }
    ],
    // Maharashtra
    'Mumbai': [
        { name: 'Money Plant', reason: 'Grows well in humid air.', seasons: ['All Year', 'Monsoon'] },
        { name: 'Areca Palm', reason: 'Thrives in tropical humidity.', seasons: ['All Year'] },
        { name: 'Spider Lily', reason: 'Loves heavy monsoon rains.', seasons: ['Monsoon'] },
        { name: 'Hibiscus', reason: 'Suited for warm, tropical climate.', seasons: ['All Year'] },
        { name: 'Tulsi', reason: 'Grows easily in warm, humid conditions.', seasons: ['All Year'] },
        { name: 'Ferns', reason: 'Loves the coastal humidity.', seasons: ['Monsoon', 'All Year'] }
    ],
    // Delhi NCR
    'Delhi': [
        { name: 'Petunia', reason: 'Perfect for cool winters.', seasons: ['Winter'] },
        { name: 'Bougainvillea', reason: 'Handles extreme summers.', seasons: ['Summer', 'Monsoon'] },
        { name: 'Marigold', reason: 'Hardy plant for varying weather.', seasons: ['Winter', 'Summer'] },
        { name: 'Gulmohar', reason: 'Blooms beautifully in hot summers.', seasons: ['Summer'] },
        { name: 'Aloe Vera', reason: 'Drought-tolerant for dry periods.', seasons: ['All Year'] },
        { name: 'Chrysanthemum', reason: 'Ideal for winter months.', seasons: ['Winter'] }
    ],
    // Default fallback
    'default': [
        { name: 'Tulsi (Holy Basil)', reason: 'Grows well in most climates.', seasons: ['All Year'] },
        { name: 'Marigold', reason: 'Hardy and adapts to various soils.', seasons: ['Winter', 'Summer'] },
        { name: 'Hibiscus', reason: 'Thrives in tropical climates.', seasons: ['All Year'] },
        { name: 'Aloe Vera', reason: 'Low maintenance succulent.', seasons: ['All Year'] },
        { name: 'Curry Leaf', reason: 'Native and grows with good sun.', seasons: ['All Year'] },
        { name: 'Snake Plant', reason: 'Extremely hardy and air-purifying.', seasons: ['All Year'] }
    ]
};

// --- HELPER FUNCTIONS ---

// 1. Get Current Indian Season
const getIndianSeason = () => {
    const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
    if (month === 0 || month === 1) return 'Winter';
    if (month >= 2 && month <= 5) return 'Summer';
    if (month >= 6 && month <= 9) return 'Monsoon';
    return 'Post-Monsoon'; // Oct-Dec
};

// 2. Fetch Image from Pixabay (Placeholder Key)
const fetchPlantImage = async (plantName) => {
    // ⚠️ REPLACE THIS WITH YOUR OWN FREE PIXABAY API KEY ⚠️
    // Get one here: https://pixabay.com/api/docs/
    const PIXABAY_API_KEY = '54429712-336b53a7fbfc4665f8b5e29cd';
    const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1470&auto=format&fit=crop';

    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(plantName + ' plant')}&image_type=photo&per_page=3`);
        if (response.data.hits && response.data.hits.length > 0) {
            return response.data.hits[0].webformatURL;
        }
    } catch (error) {
        console.warn(`Could not fetch image for ${plantName}, using fallback.`);
    }
    return FALLBACK_IMAGE;
};

// Removed onNavigate prop from GardenPage as it will use useNavigate internally
function GardenPage() {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const [page, setPage] = useState('overview');
    const [plants, setPlants] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // For success messages

    // Weather & city state
    const [weatherData, setWeatherData] = useState(null);
    const [userCity, setUserCity] = useState('');

    useEffect(() => {
        // 🌟 FIX: Read from 'userInfo' which is what login saves
        const storedUserInfo = localStorage.getItem('userInfo');
        let city = '';
        if (storedUserInfo) {
            const { user } = JSON.parse(storedUserInfo);
            city = user?.city;
        }

        // Fallback for older data if it exists
        if (!city) {
            city = localStorage.getItem('signupCity');
        }

        if (city) {
            setUserCity(city);
            const fetchWeather = async () => {
                try {
                    const apiKey = 'ef652dd7f8c85f6eba1ecb4dc26a9fe4';
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
                    const { temp } = response.data.main;
                    const description = response.data.weather[0].description;
                    setWeatherData({ temp, description });
                } catch (err) {
                    setWeatherData({ temp: 'N/A', description: 'Could not fetch weather' });
                }
            };
            fetchWeather();
        }
    }, []);

    // State for managing the custom confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [plantToDelete, setPlantToDelete] = useState(null);

    // --- FETCH PLANTS FROM MONGODB ON COMPONENT MOUNT ---
    const fetchPlants = useCallback(async () => {
        setLoading(true);
        setError('');
        setMessage(''); // Clear messages on new fetch
        try {
            const token = getAuthToken();
            if (!token) {
                setError('Kindly Signup / Login Your Account Before adding a Plant ');
                setLoading(false);
                // navigate('/auth'); // Uncomment if you want immediate redirection
                return;
            }
            // 🌟 FIX: Use standard Authorization header
            const response = await axios.get(`${API_BASE_URL}/plants`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPlants(response.data);
        } catch (err) {
            console.error('Error fetching plants:', err);
            if (err.response && err.response.status === 401) {
                setError('Session expired. Please log in again.');
                localStorage.removeItem('userInfo'); // 🌟 FIX: Remove 'userInfo' on auth error
                localStorage.removeItem('currentUser'); // Keep this for cleanup
                navigate('/auth'); // Navigate to login/signup page
            } else {
                setError('Failed to load your garden. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchPlants();
    }, [fetchPlants]);

    const addPlant = async (plantData) => {
        setError('');
        setMessage('');
        try {
            const token = getAuthToken();
            if (!token) {
                setError('Authentication required to add a plant.');
                navigate('/auth'); // Navigate to login/signup page
                return;
            }
            // 🌟 FIX: Use standard Authorization header
            const response = await axios.post(`${API_BASE_URL}/plants`, plantData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Plant added successfully:', response.data);
            setMessage('Plant added successfully!');
            setPage('overview');
            fetchPlants(); // Re-fetch plants to update the list
        } catch (err) {
            console.error('Error adding plant:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Failed to add plant: ${err.response.data.message}`);
            } else {
                setError('Failed to add plant. Please try again.');
            }
        }
    };

    const handleViewDetails = (plant) => {
        setSelectedPlant(plant);
        setPage('viewDetails');
    };

    // Function to initiate the deletion process, showing the modal
    const initiateDeletePlant = (plantId) => {
        setPlantToDelete(plantId);
        setShowConfirmModal(true);
    };

    // Function to confirm deletion after user clicks 'Yes' in modal
    const confirmDeleteAction = async () => {
        setError('');
        setMessage('');
        try {
            const token = getAuthToken();
            if (!token) {
                setError('Authentication required to delete a plant.');
                setShowConfirmModal(false);
                navigate('/auth'); // Navigate to login/signup page
                return;
            }
            // 🌟 FIX: Use standard Authorization header
            await axios.delete(`${API_BASE_URL}/plants/${plantToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Plant deleted successfully:', plantToDelete);
            setMessage('Plant deleted successfully!');
            setSelectedPlant(null);
            setPage('overview');
            fetchPlants(); // Re-fetch plants to update the list
        } catch (err) {
            console.error('Error deleting plant:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Failed to delete plant: ${err.response.data.message}`);
            } else {
                setError('Failed to delete plant. Please try again.');
            }
        } finally {
            setShowConfirmModal(false);
            setPlantToDelete(null);
        }
    };

    // Function to cancel deletion and close the modal
    const cancelDeleteAction = () => {
        setShowConfirmModal(false);
        setPlantToDelete(null);
    };

    return (
        <div style={{ backgroundColor: '#Fffff', minHeight: '100vh', fontFamily: 'Nunito, sans-serif' }} className="d-flex flex-column no-select">
            <style>
                {`
                main, .main-content, .garden-overview-wrapper {
  margin-top: 80px; /* or use padding-top if more appropriate */
}
@media (max-width: 768px) {
  .garden-overview-wrapper {
    margin-top: 100px;
  }
}

                .no-select {
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                input, textarea, select {
                    user-select: text !important;
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    -ms-user-select: text !important;
                }

                .btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .btn:active {
                    transform: translateY(0);
                    box-shadow: none;
                }

                .plant-card {
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                }

                .plant-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                }

                .custom-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1050;
                }

                .custom-modal-content {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                    animation: fadeInScale 0.3s ease-out;
                }

                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .btn-success:hover {
                    background-color: #28a745 !important;
                    color: #fff !important;
                    box-shadow: 0 6px 12px rgba(0, 128, 0, 0.3);
                }

                img.object-fit-cover {
                    object-fit: cover;
                    border-radius: 12px;
                }

                .bg-light.text-muted {
                    font-style: italic;
                    font-size: 0.9rem;
                }

                .btn-danger:hover {
                    background-color: #c82333 !important;
                    box-shadow: 0 6px 12px rgba(200, 35, 51, 0.3);
                }

                .text-success {
                    color: #28a745 !important;
                }

                /* New styles for AddPlantForm inputs */
                input.form-control,
                select.form-select {
                  border-radius: 10px !important;
                  border: 1px solid #bfc8a3 !important;
                }
                input.form-control:focus,
                select.form-select:focus {
                  border-color: #8ba663 !important;
                  box-shadow: 0 0 0 0.1rem rgba(139, 166, 99, 0.25);
                }
                form label {
                  font-weight: 600;
                }
                  
                `}
            </style>

            <main className="flex-grow-1 mt-4">
                {userCity && weatherData && (
                    <div className="d-flex justify-content-center mt-4">
                        <div
                            className="text-center p-4 rounded-4 shadow border border-success-subtle"
                            style={{
                                background: 'linear-gradient(135deg, #e6ffe6, #ccf5cc)',
                                maxWidth: '480px',
                                width: '100%',
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                                <Sun className="text-warning" size={28} />
                                <h5 className="fw-bold text-success mb-0">Live Weather – {userCity}</h5>
                            </div>
                            <p className="mb-1 text-dark fs-5">🌡️ <strong>{weatherData.temp}°C</strong></p>
                            <p className="mb-0 text-muted fst-italic">🌦️ {weatherData.description}</p>
                        </div>
                    </div>
                )}

                {error && <div className="alert alert-danger text-center mt-3 mb-3">{error}</div>}
                {message && <div className="alert alert-success text-center mt-3">{message}</div>}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Plant Suggestions - shown on overview page */}
                        {page === 'overview' && userCity && <PlantSuggestions userCity={userCity} />}

                        {/* Pass navigate to GardenOverview for the Diagnose button */}
                        {page === 'overview' && <GardenOverview plants={plants} onNavigate={setPage} onViewDetails={handleViewDetails} onDiagnoseClick={() => navigate('/diagnose')} />}
                        {page === 'addPlant' && <AddPlantForm addPlant={addPlant} />}
                        {page === 'viewDetails' && selectedPlant && (
                            <ViewPlantDetails
                                plant={selectedPlant}
                                onBack={() => {
                                    setPage('overview');
                                    setSelectedPlant(null);
                                }}
                                onDelete={initiateDeletePlant}
                            />
                        )}
                    </>
                )}
            </main>

            {/* Custom Confirmation Modal */}
            {showConfirmModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <h4 className="mb-3">Confirm Deletion</h4>
                        <p className="mb-4">Are you sure you want to delete this plant? This action cannot be undone.</p>
                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-danger" onClick={confirmDeleteAction}>Yes, Delete</button>
                            <button className="btn btn-outline-secondary" onClick={cancelDeleteAction}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const AddPlantForm = ({ addPlant }) => {
    const [plantName, setPlantName] = useState('');
    const [location, setLocation] = useState('');
    const [watering, setWatering] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all required fields (excluding sunlight)
        if (!plantName || !location || !watering) {
            setShowErrorModal(true);
            return;
        }

        // Validate location
        const allowedLocations = ['indoor', 'outdoor', 'balcony'];
        if (!allowedLocations.includes(location)) {
            setShowErrorModal(true);
            return;
        }

        let base64Image = null;
        if (imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            await new Promise((resolve) => {
                reader.onloadend = () => {
                    base64Image = reader.result;
                    resolve();
                };
            });
        }

        // Map frontend watering options to backend enum values
        let backendWateringValue;
        switch (watering) {
            case 'daily':
                backendWateringValue = 'daily';
                break;
            case 'two-three':
                backendWateringValue = '2–3 times per week';
                break;
            case 'alternate':
                backendWateringValue = 'alternate days';
                break;
            default:
                backendWateringValue = '';
        }

        addPlant({
            plantName,
            location,
            watering: backendWateringValue,
            image: base64Image
        });
    };

    // Updated colors for the form and fields
    const formContainerBackgroundColor = '#FDFCE5'; // Soft creamy background
    const inputFieldBackgroundColor = '#DDE3C2';    // Olive light green fields

    return (
        <div className="container py-5 no-select">
            <div className="text-center mb-4">
                <Sprout className="text-success mb-2" size={40} />
                <h2 className="fw-bold">🌿 Add a New Plant to Your Garden</h2>
                <p className="text-secondary">Fill in the details below to add a new plant to your UrbanGrow dashboard.</p>
            </div>

            <div className="d-flex justify-content-center">
                <div className="shadow p-5 rounded w-100" style={{ maxWidth: '600px', backgroundColor: formContainerBackgroundColor }}>
                    <h4 className="mb-3 fw-bold">Plant Details</h4>
                    <p className="text-secondary small mb-4">Help us understand your plant's needs.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Plant Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={plantName}
                                placeholder="e.g., Cherry Tomato, Basil"
                                onChange={(e) => setPlantName(e.target.value)}
                                style={{ backgroundColor: inputFieldBackgroundColor }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Location</label>
                            <select
                                className="form-select"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                style={{ backgroundColor: inputFieldBackgroundColor }}
                            >
                                <option value="">Select where your plant is located</option>
                                <option value="indoor">Indoor</option>
                                <option value="outdoor">Outdoor</option>
                                <option value="balcony">Balcony</option>
                            </select>
                        </div>
                        {/* Sunlight Needed field REMOVED as per previous request */}
                        <div className="mb-3">
                            <label className="form-label">Watering Frequency</label>
                            <select
                                className="form-select"
                                value={watering}
                                onChange={(e) => setWatering(e.target.value)}
                                style={{ backgroundColor: inputFieldBackgroundColor }}
                            >
                                <option value="">Select how often to water</option>
                                <option value="daily">Daily</option>
                                <option value="two-three">2–3 times per week</option>
                                <option value="alternate">Alternate Days</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Upload Photo (Optional)</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleImageChange}
                                accept="image/jpeg,image/png,image/webp"
                                style={{ backgroundColor: inputFieldBackgroundColor }}
                            />
                            <small className="text-muted">Max file size: 5MB. Accepted formats: JPG, PNG, WEBP.</small>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-success w-100 fw-semibold"
                            style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                        >
                            Save Plant
                        </button>
                    </form>
                </div>
            </div>

            {/* Custom Error Modal */}
            {showErrorModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <h4 className="mb-3 text-danger">Validation Error</h4>
                        <p className="mb-4">Please fill in all required fields (Plant Name, Location, Watering).</p>
                        <button className="btn btn-primary" onClick={() => setShowErrorModal(false)}>Got It</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// 🌿 Plant Suggestions Component - Compact & Enhanced with Shiny Seasonal Badges
const PlantSuggestions = ({ userCity }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSeason, setCurrentSeason] = useState('');

    // Helper for Season Badges
    const getSeasonStyle = (season) => {
        switch (season) {
            case 'Summer': return { icon: <Sun size={10} strokeWidth={3} />, color: 'bg-warning-subtle text-warning border-warning-subtle' };
            case 'Winter': return { icon: <Snowflake size={10} strokeWidth={3} />, color: 'bg-info-subtle text-info border-info-subtle' };
            case 'Monsoon': return { icon: <CloudRain size={10} strokeWidth={3} />, color: 'bg-primary-subtle text-primary border-primary-subtle' };
            case 'All Year': return { icon: <Calendar size={10} strokeWidth={3} />, color: 'bg-success-subtle text-success border-success-subtle' };
            case 'Spring': return { icon: <Sprout size={10} strokeWidth={3} />, color: 'bg-danger-subtle text-danger border-danger-subtle' };
            default: return { icon: <Sprout size={10} strokeWidth={3} />, color: 'bg-secondary-subtle text-secondary border-secondary-subtle' };
        }
    };

    useEffect(() => {
        const loadSuggestions = async () => {
            setLoading(true);
            const season = getIndianSeason();
            setCurrentSeason(season);

            // 1. Get raw suggestions
            let rawPlants = [];
            if (PLANT_SUGGESTIONS[userCity]) {
                rawPlants = PLANT_SUGGESTIONS[userCity];
            } else {
                const cityLower = userCity.toLowerCase();
                const matchedKey = Object.keys(PLANT_SUGGESTIONS).find(key => key.toLowerCase() === cityLower);
                rawPlants = matchedKey ? PLANT_SUGGESTIONS[matchedKey] : PLANT_SUGGESTIONS['default'];
            }

            // 2. Filter/Prioritize by Season
            const sortedPlants = [...rawPlants].sort((a, b) => {
                const aMatch = a.seasons.includes(season);
                const bMatch = b.seasons.includes(season);
                const aAllYear = a.seasons.includes('All Year'); // Prioritize All Year too 
                const bAllYear = b.seasons.includes('All Year');

                if (aMatch && !bMatch) return -1;
                if (!aMatch && bMatch) return 1;
                // Secondary sort: All Year vs others if both match (or don't match) season
                if (aAllYear && !bAllYear) return -1;
                if (!aAllYear && bAllYear) return 1;
                return 0;
            });

            // Take top 6
            const topPlants = sortedPlants.slice(0, 6);

            // 3. Fetch Images
            const plantsWithImages = await Promise.all(topPlants.map(async (plant) => {
                const imageUrl = await fetchPlantImage(plant.name);
                return { ...plant, imageUrl };
            }));

            setRecommendations(plantsWithImages);
            setLoading(false);
        };

        if (userCity) {
            loadSuggestions();
        }
    }, [userCity]);

    if (!userCity) return null;

    const currentSeasonStyle = getSeasonStyle(currentSeason);

    return (
        <div className="container mt-4 mb-4 px-3">
            {/* Headers - Compact with Shiny Badge */}
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <div>
                    <h5 className="fw-bold text-dark mb-0">
                        🌱 Suggested Plants for <span className="text-success">{userCity}</span>
                    </h5>
                    <small className="text-muted">
                        Tailored for <span className={`fw-bold text-dark`}>{currentSeason}</span>
                    </small>
                </div>
                <span className={`badge ${currentSeasonStyle.color} border rounded-pill px-2 py-1 shadow-sm d-flex align-items-center gap-1`}>
                    {currentSeasonStyle.icon} {currentSeason}
                </span>
            </div>

            {loading ? (
                // Compact Skeleton
                <div className="row g-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div className="col-12 col-md-6 col-lg-4" key={i}>
                            <div className="card border-0 shadow-sm p-2 d-flex flex-row align-items-center gap-3">
                                <div className="bg-secondary-subtle rounded-3" style={{ width: '60px', height: '60px' }}></div>
                                <div className="w-100">
                                    <span className="placeholder col-6 bg-secondary mb-1"></span>
                                    <span className="placeholder col-10 bg-secondary"></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="row g-3">
                    {recommendations.map((plant, index) => (
                        <div className="col-12 col-md-6 col-lg-4" key={index}>
                            <div
                                className="card border-0 shadow-sm rounded-3 overflow-hidden h-100 position-relative"
                                style={{ transition: 'all 0.2s ease', backgroundColor: '#fff' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
                                }}
                            >
                                <div className="d-flex align-items-center p-2">
                                    {/* Small Thumbnail Image */}
                                    <div className="flex-shrink-0 position-relative">
                                        <img
                                            src={plant.imageUrl}
                                            alt={plant.name}
                                            className="rounded-3 object-fit-cover shadow-sm"
                                            style={{ width: '70px', height: '70px' }}
                                        />
                                        {/* "Perfect Now" Shiny Indicator */}
                                        {plant.seasons.includes(currentSeason) && (
                                            <div
                                                className="position-absolute shadow-sm d-flex align-items-center justify-content-center bg-white rounded-circle border border-warning"
                                                style={{
                                                    width: '20px', height: '20px',
                                                    bottom: '-5px', right: '-5px',
                                                    zIndex: 2
                                                }}
                                                title="Perfect for this season!"
                                            >
                                                <Sparkles size={12} className="text-warning fill-warning" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Content - Compact */}
                                    <div className="flex-grow-1 ms-3" style={{ minWidth: 0 }}>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h6 className="fw-bold text-dark mb-1 text-truncate">{plant.name}</h6>
                                        </div>
                                        <p className="text-muted small mb-1 lh-sm text-truncate-2" style={{ fontSize: '0.85rem' }}>
                                            {plant.reason}
                                        </p>

                                        {/* Colorful Seasonal Badges */}
                                        <div className="d-flex gap-1 flex-wrap" style={{ minHeight: '18px' }}>
                                            {plant.seasons.slice(0, 3).map((s, i) => { // Show up to 3 badges
                                                const style = getSeasonStyle(s);
                                                return (
                                                    <span key={i} className={`badge ${style.color} border rounded-1 py-0 px-1 d-flex align-items-center gap-1`} style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>
                                                        {style.icon} {s}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// onDiagnoseClick prop is no longer needed in GardenOverview, it will directly use navigate
const GardenOverview = ({ plants, onNavigate, onViewDetails, onDiagnoseClick }) => {
    // formatSunlight function removed as it is no longer used.

    return (
        <div className="container py-5 no-select container ">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-3 rounded">
                        <Grid3x3 className="text-success" size={28} />
                    </div>
                    <h2 className="fw-bold">🌸 Your Garden Overview</h2>
                </div>
                <div className="d-flex gap-2">
                    <button onClick={() => onNavigate('addPlant')} className="btn btn-success d-flex align-items-center gap-2">
                        <Plus size={18} /> Add New Plant
                    </button>
                    {/* Changed onDiagnoseClick to directly call the prop passed from GardenPage */}
                    <button onClick={onDiagnoseClick} className="btn btn-danger d-flex align-items-center gap-2">
                        <GitBranch size={18} /> Diagnose Plant
                    </button>
                </div>
            </div>
            <div className="row g-4">
                {plants.length > 0 ? (
                    plants.map((plant) => (
                        <div className="col-sm-6 col-md-4 col-lg-3" key={plant._id}>
                            <div className="bg-white rounded-4 shadow-sm h-100 overflow-hidden plant-card border border-success-subtle">
                                {plant.image ? (
                                    <img src={plant.image} alt={plant.plantName} className="w-100 object-fit-cover rounded-top-4" style={{ height: '200px' }} />
                                ) : (
                                    <div className="bg-light d-flex align-items-center justify-content-center h-100 text-muted">
                                        No Image
                                    </div>
                                )}
                                <div className="p-3">
                                    <h5 className="fw-bold">{plant.plantName}</h5>
                                    <button onClick={() => onViewDetails(plant)} className="btn btn-success w-100 fw-semibold shadow-sm" style={{ borderRadius: '30px' }}>
                                        🌿 View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5 border rounded bg-light w-100 text-muted">
                        <Sprout size={64} className="mb-3" />
                        <h5>Your garden is empty.</h5>
                        <p>Click "Add New Plant" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ViewPlantDetails = ({ plant, onBack, onDelete }) => {
    // Removed formatSunlight as it's no longer used and caused the ESLint warning.
    // The 'Sunlight' property is also removed from display.

    const formatWatering = (watering) => {
        switch (watering) {
            case 'daily': return 'Daily';
            case 'alternate days': return '2-3 times a week'; // Display as '2-3 times a week'
            case '2–3 times per week': return '2-3 times a week'; // Display as '2-3 times a week'
            default: return 'N/A';
        }
    };

    return (
        <div className="container py-5 d-flex flex-column align-items-center no-select">
            <div className="d-flex justify-content-between align-items-center mb-4" style={{ width: '100%', maxWidth: '720px' }}>
                <button onClick={onBack} className="btn btn-outline-secondary">← Back to Garden</button>
                <h2 className="fw-bold mb-0 text-success">🌱 {plant.plantName}</h2>
                <button onClick={() => onDelete(plant._id)} className="btn btn-danger d-flex align-items-center gap-2">
                    <XCircle size={18} /> Delete
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-4 p-4 d-flex flex-column flex-md-row gap-4 border border-success-subtle" style={{ maxWidth: '720px', width: '100%' }}>
                <div className="flex-shrink-0 rounded-3 overflow-hidden" style={{ width: '250px', height: '250px', border: '3px solid #e2f7e2' }}>
                    {plant.image ? (
                        <img src={plant.image} alt={plant.plantName} className="w-100 h-100 object-fit-cover" />
                    ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center h-100 text-muted">
                            No Image Available
                        </div>
                    )}
                </div>
                <div className="flex-grow-1 d-flex flex-column justify-content-center ">
                    <h4 className="fw-bold text-success mb-4">{plant.plantName}</h4>
                    <p className="mb-2 text-dark"><strong>📍 Location:</strong> <span className="text-muted">{plant.location?.charAt(0).toUpperCase() + plant.location?.slice(1) || 'N/A'}</span></p>
                    {/* Removed the Sunlight display as the field is no longer collected */}
                    <p className="mb-0 text-dark"><strong>💧 Watering:</strong> <span className="text-muted">{formatWatering(plant.watering)}</span></p>
                </div>
            </div>
        </div>
    );
};

export default GardenPage;
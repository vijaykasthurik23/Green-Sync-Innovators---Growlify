const axios = require('axios');

const API_URL = 'http://localhost:5002/api';

const testFlow = async () => {
    try {
        console.log('🚀 Starting System Test...');

        // 1. Signup a test user
        const email = `test_user_${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`\n1️⃣  Registering new user: ${email}`);

        // Step 1: Request OTP
        await axios.post(`${API_URL}/send-otp`, { email });

        // Step 2: Signup (using '123456' which is likely the hardcoded test OTP or we mock it)
        // Wait, I need to check if OTP is hardcoded or mocked in backend. 
        // If not, I'll use the login endpoint with a known user if possible, or just try to signup with a fixed OTP if testing mode is on.
        // Let's assume for this test we can't easily signup without real email.
        // improved strategy: Login as admin or a known user? 
        // Let's look at the backend send-otp code first.

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
    }
};

// ... actually let's check the OTP logic first before writing the script.

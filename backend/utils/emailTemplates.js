let IMAGE_BASE = './email_assets/';
const setImageBase = (base) => { IMAGE_BASE = base; };

const ASSETS = {
  get sick() { return `${IMAGE_BASE}sick_plant.png`; },
  get healthy() { return `${IMAGE_BASE}healthy_plant.png`; },
  get water() { return `${IMAGE_BASE}reminder_plant.png`; },
  get seed() { return `${IMAGE_BASE}dormant_seed.png`; },
  get bird() { return `${IMAGE_BASE}otp_hummingbird.png`; },
  get magic() { return `${IMAGE_BASE}daily_tip.png`; },
  get fruit() { return `${IMAGE_BASE}daily_tip.png`; },
  get sprout() { return `${IMAGE_BASE}dormant_seed.png`; },
  get vines() { return `${IMAGE_BASE}sick_plant.png`; }
};

// ==========================================
// 1. SICK (Medical Report Style)
// ==========================================
const diagnosisTemplate = (name, plantName, diseaseName, confidence, cure, cause) => {
  const isHealthy = diseaseName && diseaseName.toLowerCase().includes('healthy');
  if (isHealthy) return healthyDiagnosis(name, plantName, diseaseName);

  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 20px; background-color: #fceceb; font-family: 'Courier New', monospace;">
  <div style="max-width: 500px; margin: 0 auto; background: #fff; border: 2px solid #e53935; border-radius: 8px; overflow: hidden;">
    <div style="background: #e53935; color: white; padding: 15px; text-align: center; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
      ⚠️ Urgent Care Required
    </div>
    <div style="padding: 20px; text-align: center;">
      <img src="${ASSETS.sick}" style="width: 180px; margin-bottom: 20px; border-radius: 50%; border: 4px solid #fceceb;">
      <h1 style="font-family: Helvetica, Arial, sans-serif; margin: 0; color: #b71c1c;">Seeking the Sunlight</h1>
      <div style="margin: 20px 0; border: 1px dashed #e53935; padding: 15px; background: #fff5f5; text-align: left;">
        <div><strong>Patient:</strong> ${plantName}</div>
        <div><strong>Diagnosis:</strong> ${diseaseName}</div>
        <div style="margin-top: 10px; color: #ba1a1a;"><strong>Prescription:</strong> ${cure}</div>
      </div>
      <p style="font-family: Helvetica, Arial, sans-serif; color: #555; line-height: 1.5;">
        Something in the ecosystem is slightly out of balance. The leaves are losing their luster, but with the right nutrients and a quick adjustment, we can bring the vibrance back.
      </p>
      <a href="http://localhost:3000/my-garden" style="display: block; background: #d32f2f; color: white; text-decoration: none; padding: 15px; border-radius: 4px; font-weight: bold; text-transform: uppercase; margin-top: 20px;">Start Treatment</a>
    </div>
  </div>
</body>
</html>`;
};

// ==========================================
// 2. HEALTHY (Fitness/Stats Style)
// ==========================================
const healthyDiagnosis = (name, plantName, diseaseName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 20px; background-color: #e8f5e9; font-family: Helvetica, Arial, sans-serif;">
  <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #a5d6a7 0%, #66bb6a 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 20px rgba(76, 175, 80, 0.3);">
    <div style="padding: 40px 20px; text-align: center; color: white;">
      <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; font-size: 32px;">💪</div>
      <h1 style="margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">In Full Photosynthesis</h1>
    </div>
    <div style="background: white; padding: 30px; border-radius: 20px 20px 0 0;">
      <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 20px;">
        <img src="${ASSETS.healthy}" style="width: 100px; height: 100px; border-radius: 12px; object-fit: cover;">
        <div>
           <h3 style="margin: 0; color: #2e7d32;">${plantName}</h3>
           <span style="background: #e6f4ea; color: #1b5e20; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">STATUS: THRIVING</span>
        </div>
      </div>
      <p style="color: #4b5563; line-height: 1.6;">
        The soil is rich, the pH is perfect, and the leaves are reaching for the sky. The vitals are strong, and the growth cycle is operating at peak efficiency.
      </p>
      <a href="http://localhost:3000/my-garden" style="display: block; text-align: center; background: #2e7d32; color: white; text-decoration: none; padding: 15px; border-radius: 50px; font-weight: bold; margin-top: 25px;">View Vitality Stats</a>
    </div>
  </div>
</body>
</html>`;
};

// ==========================================
// 3. REMINDER (Water Splash Style)
// ==========================================
const smartReminderTemplate = (plantName, tips) => {
  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 20px; background-color: #e0f7fa; font-family: Helvetica, Arial, sans-serif;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 30px; overflow: hidden; position: relative;">
     <div style="background: #0288d1; height: 150px; clip-path: ellipse(80% 60% at 50% 30%); position: absolute; top:0; left:0; right:0;"></div>
     <div style="padding: 40px 20px; text-align: center; position: relative; z-index: 2;">
        <img src="${ASSETS.water}" style="width: 160px; height: 160px; border: 5px solid white; border-radius: 50%; box-shadow: 0 5px 15px rgba(2, 136, 209, 0.3); background: #fff;">
        <h1 style="color: #01579b; margin-top: 20px;">💧 Time to Water! 💧</h1>
        <div style="color: #555; font-size: 16px; margin: 15px 0; font-weight: bold;">🌱 ${plantName}</div>
        
        <!-- Water Drop Indicator Section -->
        <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 20px; margin: 20px 0; border: 2px solid #64b5f6;">
          <div style="font-size: 40px; margin-bottom: 10px;">💧💧💧</div>
          <div style="color: #01579b; font-size: 16px; line-height: 1.6;">
            ${tips}
          </div>
        </div>
        
        <p style="color: #0277bd; font-size: 14px; line-height: 1.5; background: #e1f5fe; padding: 15px; border-radius: 16px; margin-top: 15px;">
          Just a quick misting to keep the momentum going. Even the strongest perennials benefit from a little hydration at the right time.
        </p>
        <a href="http://localhost:3000/my-garden" style="display: inline-block; background: linear-gradient(135deg, #03a9f4 0%, #0288d1 100%); color: white; text-decoration: none; padding: 15px 35px; border-radius: 25px; font-weight: bold; box-shadow: 0 4px 15px rgba(3, 169, 244, 0.4); margin-top: 20px; font-size: 16px;">🌿 Check My Garden 💧</a>
     </div>
  </div>
</body>
</html>`;
};

// ==========================================
// 4. RE-ENGAGEMENT (Letters / Envelope Style)
// ==========================================
const reengagementTemplate = (name, daysInactive) => {
  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 20px; background-color: #ebe5ce; font-family: 'Georgia', serif;">
  <div style="max-width: 500px; margin: 0 auto; background: #fdfbf7; border: 1px solid #d4c5a9; padding: 40px; box-shadow: 5px 5px 0px rgba(0,0,0,0.05);">
    <div style="text-align: center; border-bottom: 2px solid #ebe5ce; padding-bottom: 20px; margin-bottom: 30px;">
       <img src="${ASSETS.seed}" style="width: 100px; filter: sepia(0.5);">
       <h1 style="color: #5d4037; font-size: 28px; font-style: italic;">Awakening the Roots</h1>
    </div>
    <p style="font-size: 18px; color: #4e342e; line-height: 1.8;">
      Dear Gardener,
    </p>
    <p style="font-size: 16px; color: #5d4037; line-height: 1.8;">
       The garden has been quiet lately. The soil is still warm and waiting, ready for you to break through the surface and start climbing toward the sun again.
    </p>
    <div style="text-align: center; margin-top: 40px;">
      <a href="http://localhost:3000/login" style="background: #795548; color: #fff; text-decoration: none; padding: 12px 24px; font-family: Helvetica, sans-serif; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Resume Growth</a>
    </div>
  </div>
</body>
</html>`;
};

// ==========================================
// 5. OTP (Security Ticket Style)
// ==========================================
const otpTemplate = (name, code, purpose) => {
  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 20px; background-color: #212121; font-family: 'Courier New', monospace;">
  <div style="max-width: 500px; margin: 0 auto; background: #333; border-radius: 12px; border: 1px solid #444; color: #fff; overflow: hidden;">
    <div style="padding: 20px; background: #000; display: flex; align-items: center; justify-content: space-between;">
      <span style="color: #4caf50; font-weight: bold;">> GROWLIFY_SECURE_ACCESS</span>
      <span style="width: 10px; height: 10px; background: #4caf50; border-radius: 50%; display: inline-block;"></span>
    </div>
    <div style="padding: 30px; text-align: center;">
      <img src="${ASSETS.bird}" style="width: 80px; border-radius: 50%; border: 2px solid #4caf50; margin-bottom: 20px;">
      <h1 style="font-size: 20px; margin-bottom: 10px;">A Unique Grain of Pollen</h1>
      <p style="color: #aaa; font-size: 12px; margin-bottom: 30px;">
        To ensure this interaction stays within your garden, use this specific element to fertilize the request. This grain is delicate and expires quickly.
      </p>
      <div style="background: #222; border: 2px dashed #555; padding: 20px; font-size: 32px; letter-spacing: 10px; color: #4caf50; margin-bottom: 30px; font-weight: bold;">
        ${code}
      </div>
      <a href="#" style="background: #4caf50; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold; text-transform: uppercase;">>> Authenticate</a>
    </div>
  </div>
</body>
</html>`;
};

// ==========================================
// 6. DAILY TIP (Magazine Snippet Style)
// ==========================================
const organicTipTemplate = (name, plantName, day, tip, itemName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 20px; background-color: #fafafa; font-family: 'Georgia', serif;">
  <div style="max-width: 500px; margin: 0 auto; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); display: flex; flex-direction: column;">
    <div style="background: url('${ASSETS.magic}') center/cover no-repeat; height: 300px; position: relative;">
      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white;">
        <span style="background: #fdd835; color: black; font-family: Helvetica, sans-serif; font-weight: bold; font-size: 10px; padding: 4px 8px; text-transform: uppercase;">Daily Wisdom</span>
        <h1 style="margin: 10px 0 0 0; font-size: 24px;">A Teaspoon of Wisdom</h1>
      </div>
    </div>
    <div style="padding: 30px; text-align: center;">
      <p style="font-size: 18px; font-style: italic; color: #333; line-height: 1.6; margin-bottom: 20px;">
        "Today's enrichment is designed to help your garden thrive."
      </p>
      <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0; font-family: Helvetica, sans-serif; color: #555; font-size: 14px;">
        <strong>Quick Tip:</strong> ${tip}
      </div>
      <div style="margin-top: 25px;">
        <a href="http://localhost:3000/my-garden" style="font-family: Helvetica, sans-serif; font-weight: bold; text-decoration: none; color: #000; border-bottom: 2px solid #fdd835;">APPLY TIP →</a>
      </div>
    </div>
  </div>
</body>
</html>`;
};

// ==========================================
// 7. REWARD (Gift Card Style)
// ==========================================
const rewardRedeemedTemplate = (name, rewardName, pointsSpent, remainingPoints) => {
  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 20px; background-color: #263238; font-family: Helvetica, Arial, sans-serif;">
  <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(45deg, #FFD700, #FDB931); border-radius: 12px; padding: 3px; box-shadow: 0 0 20px rgba(253, 185, 49, 0.4);">
    <div style="background: #1a1a1a; border-radius: 10px; padding: 40px; text-align: center; color: white;">
      <img src="${ASSETS.fruit}" style="width: 100px; margin-bottom: 20px;">
      <h1 style="color: #FFD700; text-transform: uppercase; letter-spacing: 2px; font-size: 24px; margin-bottom: 10px;">Ripe for the Taking</h1>
      <p style="color: #ccc; font-size: 14px; margin-bottom: 30px;">
        Your dedication has finally moved from blossom to fruit. This rare harvest is a direct result of your care.
      </p>
      <div style="background: #262626; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
         <div style="color: #FFD700; font-weight: bold; font-size: 18px;">unlocked: ${rewardName}</div>
      </div>
      <a href="http://localhost:3000/profile" style="background: #FFD700; color: #1a1a1a; text-decoration: none; padding: 12px 30px; font-weight: bold; border-radius: 30px;">CLAIM HARVEST</a>
    </div>
  </div>
</body>
</html>`;
};

// ==========================================
// 8. REGISTRATION (New Grower Pass Style)
// ==========================================
const registerTemplate = (name) => {
  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 20px; background-color: #8d6e63; font-family: monospace;">
  <div style="max-width: 500px; margin: 0 auto; background: #d7ccc8; border: 2px solid #5d4037; border-radius: 2px; position: relative;">
     <div style="position: absolute; width: 20px; height: 20px; background: #8d6e63; border-radius: 50%; top: 50%; left: -12px; margin-top: -10px;"></div>
     <div style="position: absolute; width: 20px; height: 20px; background: #8d6e63; border-radius: 50%; top: 50%; right: -12px; margin-top: -10px;"></div>
     
     <div style="padding: 30px; text-align: center; border-bottom: 2px dashed #5d4037;">
        <h1 style="text-transform: uppercase; color: #3e2723; margin: 0;">Fresh Soil Pass</h1>
        <div style="margin-top: 5px; color: #5d4037;">New Potential Unlocked</div>
     </div>
     
     <div style="padding: 30px; text-align: center;">
        <img src="${ASSETS.sprout}" style="width: 100px; margin-bottom: 20px;">
        <p style="font-family: Helvetica, sans-serif; color: #4e342e; line-height: 1.5; margin-bottom: 30px;">
          A new plot has been cleared just for you. The journey from a single seed to a sprawling canopy begins right here.
        </p>
        <a href="http://localhost:3000/my-garden" style="border: 2px solid #3e2723; color: #3e2723; padding: 10px 25px; text-decoration: none; font-weight: bold; text-transform: uppercase; display: inline-block;">Plant First Seed</a>
     </div>
  </div>
</body>
</html>`;
};

// ==========================================
// 9. ALERT (System Warning Style)
// ==========================================
const systemAlertTemplate = (message) => {
  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 20px; background-color: #212121; font-family: Helvetica, Arial, sans-serif;">
  <div style="max-width: 500px; margin: 0 auto; background: #000; color: #ffeb3b; border-top: 5px solid #ffeb3b; border-bottom: 5px solid #ffeb3b;">
    <div style="padding: 10px; background: #ffeb3b; color: #000; font-weight: bold; text-align: center; text-transform: uppercase;">
      ⚠️ System Alert ⚠️
    </div>
    <div style="padding: 30px; text-align: center;">
      <h1 style="color: #fff; text-transform: uppercase; font-size: 24px;">Directing the Growth</h1>
      <p style="color: #ccc; margin: 20px 0; font-family: monospace;">
        Things are expanding faster than the current trellis can handle. A quick adjustment is needed.
      </p>
      <div style="border: 1px solid #333; padding: 15px; margin-bottom: 30px; color: #ffeb3b; font-family: monospace;">
         ${message}
      </div>
      <a href="http://localhost:3000" style="background: #ffeb3b; color: #000; text-decoration: none; padding: 12px 30px; font-weight: bold; display: inline-block;">MANAGE EXPANSION</a>
    </div>
  </div>
</body>
</html>`;
};

module.exports = {
  setImageBase,
  diagnosisTemplate,
  smartReminderTemplate,
  reengagementTemplate,
  otpTemplate,
  organicTipTemplate,
  rewardRedeemedTemplate,
  registerTemplate,
  systemAlertTemplate
};

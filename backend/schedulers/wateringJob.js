// schedulers/wateringJob.js

const Plant = require('../models/Plant');
const Signup = require('../models/Signup');
const { smartReminderTemplate } = require('../utils/emailTemplates');
const { sendEmail, sendSmartReminderEmail } = require('../services/emailService');
const getWeather = require('../services/weatherService');
const logger = require('../utils/logger'); // 🌟 Logging support

// 🌟 Motivational quotes or plant facts
// 🌟 Motivational quotes or plant facts (100 items)
const quotes = [
  "🌿 \"To plant a garden is to believe in tomorrow.\" – Audrey Hepburn",
  "🌱 \"Your mind is a garden. Your thoughts are the seeds. You can grow flowers or weeds.\"",
  "🌸 \"The earth laughs in flowers.\" – Ralph Waldo Emerson",
  "🌞 \"Keep growing, even if no one applauds you.\"",
  "🌼 \"Grow through what you go through.\"",
  "🍃 \"Let your dreams blossom like your garden.\"",
  "🌻 \"Where flowers bloom, so does hope.\" – Lady Bird Johnson",
  "🌿 \"Small seeds. Big forests.\"",
  "🌱 \"Water me today; thank yourself tomorrow.\"",
  "🌸 \"Progress is quieter than petals opening.\"",
  "🌞 \"Sunshine and patience make miracles.\"",
  "🌼 \"Every leaf is a little victory.\"",
  "🍃 \"Roots first, flowers later.\"",
  "🌻 \"Bloom where you are planted.\"",
  "🌿 \"One day or day one—plant it.\"",
  "🌱 \"A little dirt grows a lot of good.\"",
  "🌸 \"Be gentle—growth is happening.\"",
  "🌞 \"Light finds those who lean toward it.\"",
  "🌼 \"Nourish the roots you want to keep.\"",
  "🍃 \"Mistakes are compost for growth.\"",
  "🌻 \"Drink water, get sunlight, repeat.\"",
  "🌿 \"Quiet care. Loud results.\"",
  "🌱 \"Deep roots, calm storms.\"",
  "🌸 \"Tiny drops keep giants alive.\"",
  "🌞 \"Even cacti need care.\"",
  "🌼 \"You're closer than you think—one more watering.\"",
  "🍃 \"Let today be a green day.\"",
  "🌻 \"Hope is a hardy perennial.\"",
  "🌿 \"Grow slow, grow strong.\"",
  "🌱 \"Take your time; forests do.\"",
  "🌸 \"Kind hands make kind gardens.\"",
  "🌞 \"No rain? We make our own routine.\"",
  "🌼 \"Care is a daily sunlight.\"",
  "🍃 \"Trim the worry, keep the wonder.\"",
  "🌻 \"We rise by being rooted.\"",
  "🌿 \"A sip for me, a smile for you.\"",
  "🌱 \"Seeds don't rush—and still they bloom.\"",
  "🌸 \"Water today, wonder tomorrow.\"",
  "🌞 \"Turn toward the good.\"",
  "🌼 \"Patience is plant music.\"",
  "🍃 \"Green is the color of second chances.\"",
  "🌻 \"Your consistency is my climate.\"",
  "🌿 \"Nudge, nurture, nature.\"",
  "🌱 \"Every refill is a little love note.\"",
  "🌸 \"Blooming is a team sport.\"",
  "🌞 \"You are the weather I wait for.\"",
  "🌼 \"Give what you want to grow.\"",
  "🍃 \"Care turns corners.\"",
  "🌻 \"Roots remember.\"",
  "🌿 \"Let the day drip gently.\"",
  "🌱 \"You + me + a cup of water = magic.\"",
  "🌸 \"We measure progress in new leaves.\"",
  "🌞 \"Shine happens slowly, then all at once.\"",
  "🌼 \"Green dreams need real sips.\"",
  "🍃 \"Pull the weeds; keep the lessons.\"",
  "🌻 \"Hope has chlorophyll.\"",
  "🌿 \"Keep it moist, keep it moving.\"",
  "🌱 \"Consistency is the best fertilizer.\"",
  "🌸 \"Whisper to me with water.\"",
  "🌞 \"Cloudy days still grow roots.\"",
  "🌼 \"Care is a circle—water, wait, wonder.\"",
  "🍃 \"Fresh water, fresh start.\"",
  "🌻 \"We grow by inches and intentions.\"",
  "🌿 \"No rush, just roots.\"",
  "🌱 \"Your routine is my rain.\"",
  "🌸 \"Leaves up, spirits up.\"",
  "🌞 \"Sun after sip—perfect duo.\"",
  "🌼 \"Make room for new shoots.\"",
  "🍃 \"Prune the doubt.\"",
  "🌻 \"I bloom because you do.\"",
  "🌿 \"Sip-sized miracles.\"",
  "🌱 \"Today's splash prevents tomorrow's wilt.\"",
  "🌸 \"Green goals, daily drops.\"",
  "🌞 \"Let light land on your plans.\"",
  "🌼 \"Care scales: tiny to towering.\"",
  "🍃 \"Thank you for showing up like seasons.\"",
  "🌻 \"Even pots can hold wild dreams.\"",
  "🌿 \"Water is how we say 'I'm here.'\"",
  "🌱 \"Deep drinks, deeper peace.\"",
  "🌸 \"Leaves are love letters.\"",
  "🌞 \"Stand tall. Stretch slowly.\"",
  "🌼 \"Every bud began shy.\"",
  "🍃 \"Refill the can, refill the soul.\"",
  "🌻 \"Green is the slowest fireworks.\"",
  "🌿 \"Let kindness drip from the edges.\"",
  "🌱 \"You can't rush chlorophyll.\"",
  "🌸 \"Spritz away the stress.\"",
  "🌞 \"Sun-kissed and sip-fit.\"",
  "🌼 \"The quiet habit that changes everything: water.\"",
  "🍃 \"Healthy roots, happy rooms.\"",
  "🌻 \"A faithful gardener grows faith.\"",
  "🌿 \"Moist soil, mellow soul.\"",
  "🌱 \"Care today, canopy tomorrow.\"",
  "🌸 \"Every droplet votes for life.\"",
  "🌞 \"Light loves the patient.\"",
  "🌼 \"We bloom best with boundaries and bottles.\"",
  "🍃 \"Trim the tired, keep the thriving.\"",
  "🌻 \"There's a forest inside this pot.\"",
  "🌿 \"Green gratitude in every gulp.\"",
  "🌱 \"Hydrate the hope.\""
];


const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning!";
  if (hour < 17) return "Good afternoon!";
  return "Good evening!";
};

const sendWateringReminders = async (location) => {
  logger.info(`[NODE-CRON] Running watering reminder job for location: ${location}`);

  try {
    const plants = await Plant.find({});
    const users = await Signup.find({});

    for (const plant of plants) {
      if (!plant.userId) {
        logger.warn(`[SKIP] Plant "${plant.plantName}" has no userId`);
        continue;
      }

      const isMatchingLocation =
        (location === '2-3 times/week' && plant.schedule === '2-3 times/week') ||
        (plant.location && plant.location.toLowerCase() === location.toLowerCase());

      if (!isMatchingLocation) continue;

      const user = users.find(u => u._id.toString() === plant.userId.toString());
      if (!user || !user.city || !user.email) {
        logger.warn(`[SKIP] Missing user data for plant "${plant.plantName}" — userId: ${plant.userId}`);
        continue;
      }

      // 🌧️ Weather check
      const weather = await getWeather(user.city);
      if (typeof weather === 'string') {
        const lowerWeather = weather.toLowerCase();
        const rainyWords = ['rain', 'drizzle', 'thunderstorm', 'shower', 'light'];
        if (rainyWords.some(word => lowerWeather.includes(word))) {
          logger.info(`[SKIP] Weather in ${user.city} is "${weather}". Skipping watering email to ${user.email}`);
          continue;
        }
      }

      // 💧 Determine water amount
      let amount = '150ml';
      if (plant.location === 'Indoor') {
        amount = '80–100ml (twice daily)';
      } else if (plant.location === 'Balcony') {
        amount = '75–100ml (twice daily)';
      } else if (plant.location === 'Outdoor') {
        amount = '60–80ml (3 times daily)';
      } else if (plant.schedule === '2-3 times/week') {
        amount = '200–300ml';
      }

      // Extract number for display
      const metrics = amount.match(/\d+/g);
      const amountNum = metrics ? metrics[0] : '100';

      const quote = getRandomQuote();
      const greeting = getTimeGreeting();

      const subject = `💧 ${plant.plantName || 'Your Plant'} needs watering (${greeting})`;

      const text = `
${greeting} ${user.name || 'Gardener'} 🌞,

It's me, your plant *${plant.plantName || 'Green Buddy'}*! 🌿

I just wanted to whisper gently... I'm feeling a little thirsty right now. Could you please give me some water?

📍 I'm in the **${plant.location || 'garden'}**
💧 I'd love about **${amount}**

Weather in ${user.city} is currently "${weather}" — looks like it's safe to water me. 🌤️

✨ Quote of the Day:
${quote}

Thanks for always caring for me. Your love helps me grow 🌱💚

Leaf-fully yours,  
*${plant.plantName || 'Your Plant'}*

– Team Growlify 🌿
      `;

      const tips = `Recommended Amount: <strong>${amount}</strong><br><br>Current Weather: ${weather} 🌤️<br><br><i>"${quote}"</i>`;

      await sendSmartReminderEmail(
        user.email,
        plant.plantName || 'Plant',
        tips
      );

      logger.info(`[EMAIL SENT] to ${user.email} for ${plant.plantName}`);
    }
  } catch (err) {
    logger.error(`[NODE-CRON] Error in watering reminder: ${err.stack || err.message}`);
  }
};

module.exports = { sendWateringReminders };

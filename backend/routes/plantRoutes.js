const express = require('express');
const router = express.Router();
const { addPlant, getPlants, deletePlant, sendDiagnosisReport } = require('../controllers/plantController');
const { sendWateringReminders } = require('../schedulers/wateringJob');

router.post('/', addPlant);
router.get('/', getPlants);
router.post('/diagnosis-email', sendDiagnosisReport); // ✅ New Interactive Email Route
router.get('/test-water', async (req, res) => {
    console.log('Manually triggering watering reminders...');
    try {
        await sendWateringReminders('Indoor');
        res.json({ message: 'Watering reminders triggered manually for Indoor plants!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to trigger reminders' });
    }
});
router.delete('/:id', deletePlant);

module.exports = router;

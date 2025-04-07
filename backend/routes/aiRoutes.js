// backend/routes/aiRoutes.js
const express = require('express');
const router = express.Router();

// Placeholder route for AI-related features
router.get('/test', (req, res) => {
  res.json({ message: 'AI Routes are working!' });
});

// Example route for a future AI feature (e.g., thermal analysis)
router.post('/thermal-analysis', (req, res) => {
  res.json({ message: 'Thermal analysis endpoint - to be implemented' });
});

module.exports = router;
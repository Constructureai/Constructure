// C:\CONSTRUCTURE\backend\routes\auth.js
const express = require('express');
const router = express.Router();

router.post('/signup', (req, res) => {
  const { email, password } = req.body;
  // Mock response for testing (replace with actual database logic later)
  if (email && password) {
    res.json({ user: { id: '1', email, role: 'user' } });
  } else {
    res.status(400).json({ message: 'Email and password are required' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Mock response for testing
  if (email === 'test@example.com' && password === 'password123') {
    res.json({ user: { id: '1', email, role: 'user' } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
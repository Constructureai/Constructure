const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, password, role = 'User', tier = 'Basic' } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role, tier });
  await user.save();
  res.status(201).send('User registered');
};
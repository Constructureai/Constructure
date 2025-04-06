const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['CEO', 'Project Manager', 'Employee'], default: 'Employee' },
  tier: { type: String, enum: ['Basic', 'Premium', 'None'], default: 'Basic' }
});

module.exports = mongoose.model('User', UserSchema);
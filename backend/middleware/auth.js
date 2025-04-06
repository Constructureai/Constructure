const User = require('../models/User');

const restrictToTier = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user || user.tier === 'None') return res.status(403).send('Subscription required');
  next();
};

module.exports = { restrictToTier };
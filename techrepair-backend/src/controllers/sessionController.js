const Session = require('../models/Session');
const logger = require('../utils/logger');

exports.create = async (req, res) => {
  try {
    const session = await Session.create({ user: req.user.id, token: req.body.token });
    res.status(201).json(session);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.list = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id });
    res.json(sessions);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

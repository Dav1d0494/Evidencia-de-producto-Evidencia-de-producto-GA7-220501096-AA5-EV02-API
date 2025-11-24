const Permission = require('../models/Permission');
const logger = require('../utils/logger');

exports.list = async (req, res) => {
  try {
    const permissions = await Permission.find({});
    res.json(permissions);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const p = await Permission.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

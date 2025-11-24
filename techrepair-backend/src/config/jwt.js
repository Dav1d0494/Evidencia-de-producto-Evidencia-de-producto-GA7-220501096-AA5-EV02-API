module.exports = {
  secret: process.env.JWT_SECRET || 'change_this_secret',
  options: {
    expiresIn: '7d',
  },
};

module.exports = (schema) => {
  // schema is a function that validates req.body and throws or returns error
  return (req, res, next) => {
    if (!schema) return next();
    try {
      const result = schema(req.body);
      if (result && result.error) return res.status(400).json({ message: result.error });
      next();
    } catch (err) {
      return res.status(400).json({ message: 'Validation error', details: err.message });
    }
  };
};

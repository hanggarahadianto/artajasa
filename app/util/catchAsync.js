module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      res.json({ status: false, message: error.message });
    });
  };
};

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      if (error.name === 'SequelizeConnectionRefusedError') {
        res
          .status(500)
          .json({
            status: false,
            message: 'Database connection ' + error.parent.code,
          });
      } else {
        res.status(500).json({ status: false, message: error.message });
      }
    });
  };
};

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      if (error.name === 'SequelizeConnectionRefusedError') {
        res.status(500).json({
          status: false,
          message: 'Database connection ' + error.parent.code,
        });
      } else if (error.name === 'ValidationError') {
        res.status(403).json({
          status: false,
          message: error.message.replace(/[\\"]/g, ''),
        });
      } else if (error.name === 'Error') {
        res.status(409).json({
          status: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: false,
          message: error.message,
        });
      }
    });
  };
};

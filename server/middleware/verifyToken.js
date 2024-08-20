const jwt = require("jsonwebtoken");
const SECRET = require('../routers/secret');

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(403);
  }

  // Extract the token after "Bearer"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(token, SECRET, function (err, decoded) {
    if (err) {
      return res.sendStatus(403);
    } else {
      next();
    }
  });
};

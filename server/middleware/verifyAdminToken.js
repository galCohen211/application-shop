const jwt = require("jsonwebtoken");
const SECRET = require('../routers/secret');

module.exports = function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(403);
  }

  // Extract the token after "Bearer"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role === "admin") {
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    res.sendStatus(403);
  }
};

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('authHeader:', authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  console.log('token:', token);

  if (!token) return res.sendStatus(401); // No token, not authorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT Error:', err);
      return res.sendStatus(403); // Token invalid
    }
    req.user = decoded; // decoded = { userId: '...' }
    next();
  });
}

module.exports = {
  authenticateToken,
};

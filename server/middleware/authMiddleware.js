const jwt = require('jsonwebtoken');
require('dotenv').config();

/*
  Provjera tokena
*/

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Pristup zabranjen, token nije proslijeđen' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Nevažeći token' });
  }
};

module.exports = authMiddleware;
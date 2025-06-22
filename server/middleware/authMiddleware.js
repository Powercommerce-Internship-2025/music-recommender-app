import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/*
  Provjera tokena
*/

// middleware/authMiddleware.js
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Pristup zabranjen, token nije proslijeđen' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Dekodirani token:', decoded); // Dodaj ovo za debug
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Greška s tokenom:', error.message); // Dodaj ovo za debug
    res.status(401).json({ error: 'Nevažeći token' });
  }
};

export default authMiddleware;
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/*
  Provjera tokena
*/

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Pristup zabranjen, token nije proslijeđen' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Dekodirani token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Greška s tokenom:', error.message);
    res.status(401).json({ error: 'Nevažeći token' });
  }
};

export default authMiddleware;
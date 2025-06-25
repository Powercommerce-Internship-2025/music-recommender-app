import express from 'express';
import { getProfile, updateProfile, updatePassword, getDashboardData } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/*
  Rute za upravljanje korisničkim profilom i dashboardom
*/

router.get('/dashboard', authMiddleware, getDashboardData); // NOVA RUTA
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, updatePassword);

export default router;
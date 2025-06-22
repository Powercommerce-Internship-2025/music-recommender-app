import express from 'express';
import musicController from '../controllers/musicController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/*
  Definisane rute za muziku
*/

router.get('/albums', musicController.getAlbums);
router.get('/artists', musicController.getArtists);
router.post('/like', authMiddleware, musicController.addLike);

export default router;

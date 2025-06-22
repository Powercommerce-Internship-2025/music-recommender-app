import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import musicRoutes from './routes/musicRoutes.js';

const app = express();

/*
  Dozvole za zahtjeve sa localhosta 5173
*/

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

app.get('/health', (req, res) => {
  res.json({ message: 'Music Recommender API' });
});

sequelize.sync().then(() => {
  console.log('Baza podataka povezana');
}).catch(err => {
  console.error('Greška pri povezivanju baze:', err);
});

export default app;
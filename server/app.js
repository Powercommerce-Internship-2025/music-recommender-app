const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');

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

sequelize.sync().then(() => {
  console.log('Baza podataka povezana');
}).catch(err => {
  console.error('Greška pri povezivanju baze:', err);
});

module.exports = app;
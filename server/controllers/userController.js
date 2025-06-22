import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Album, Like, User, Artist } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

/*
  Kreiranje korisnika tj registracija
*/
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'Korisnik kreiran', user: { id: user.id, username, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/*
  Logiranje korisnika tj login
*/
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Korisnik ne postoji' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Pogrešna lozinka' });
    
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Odjavljen' });
};

export { register, login, logout };
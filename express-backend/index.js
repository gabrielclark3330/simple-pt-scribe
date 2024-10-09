import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import pg from "pg";
const { Pool } = pg;

import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// PostgreSQL Pool Setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Make the pool accessible globally
app.locals.pool = pool;

// Routes
app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);
app.use('/profiles', profileRoutes);
app.use('/notes', noteRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

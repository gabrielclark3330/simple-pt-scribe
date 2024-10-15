import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = [
  // Validation
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').notEmpty(),
  body('last_name').notEmpty(),

  async (req, res) => {
    const pool = req.app.locals.pool;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data
    const { password, email, first_name, last_name } = req.body;

    try {
      // Check if the email already exists
      const userExists = await pool.query('SELECT * FROM profile WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert the new user into the database
      const result = await pool.query(
        'INSERT INTO profile (password, email, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
        [hashedPassword, email, first_name, last_name]
      );

      // Generate a JWT token upon signup
      const token = jwt.sign({ id: result.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  },
];

export const login = [
  // Validation
  body('email').isEmail(),
  body('password').exists(),

  async (req, res) => {
    const pool = req.app.locals.pool;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data
    const { email, password } = req.body;

    try {
      // Find the user by email
      const userResult = await pool.query('SELECT * FROM profile WHERE email = $1', [email]);

      if (userResult.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const user = userResult.rows[0];

      // Compare the password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  },
];

export const validateToken = (req, res) => {
  // If the request reaches here, the token has been validated by the middleware
  res.status(200).json({ message: 'Token is valid.' });
};
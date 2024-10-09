import bcrypt from 'bcrypt';

export const getAllProfiles = async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const result = await pool.query('SELECT * FROM profile');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

export const getProfileById = async (req, res) => {
  const pool = req.app.locals.pool;
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM profile WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

export const updateProfile = async (req, res) => {
  const pool = req.app.locals.pool;
  const id = req.params.id;
  const { password, email, first_name, last_name } = req.body;
  try {
    // Hash the new password if provided
    let hashedPassword;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Update the profile
    const result = await pool.query(
      'UPDATE profile SET password = COALESCE($1, password), email = $2, first_name = $3, last_name = $4 WHERE id = $5 RETURNING *',
      [hashedPassword, email, first_name, last_name, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

export const createPatient = async (req, res) => {
    const pool = req.app.locals.pool;
    const { first_name, last_name } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO patient (first_name, last_name) VALUES ($1, $2) RETURNING *',
        [first_name, last_name]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
  export const getAllPatients = async (req, res) => {
    const pool = req.app.locals.pool;
    try {
      const result = await pool.query('SELECT * FROM patient');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
  export const getPatientById = async (req, res) => {
    const pool = req.app.locals.pool;
    const id = req.params.id;
    try {
      const result = await pool.query('SELECT * FROM patient WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
  export const updatePatient = async (req, res) => {
    const pool = req.app.locals.pool;
    const id = req.params.id;
    const { first_name, last_name } = req.body;
    try {
      const result = await pool.query(
        'UPDATE patient SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *',
        [first_name, last_name, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
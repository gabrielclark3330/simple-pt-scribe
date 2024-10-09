export const createNote = async (req, res) => {
    const pool = req.app.locals.pool;
    const {
      patient_id,
      transcript,
      subjective,
      objective,
      assessment,
      plan,
      length,
      date_recorded,
      type,
      note_owner,
    } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO note
        (patient_id, transcript, subjective, objective, assessment, plan, length, date_recorded, type, note_owner)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          patient_id,
          transcript,
          subjective,
          objective,
          assessment,
          plan,
          length,
          date_recorded,
          type,
          note_owner,
        ]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
  export const getAllNotes = async (req, res) => {
    const pool = req.app.locals.pool;
    try {
      const result = await pool.query('SELECT * FROM note');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
  export const getNoteById = async (req, res) => {
    const pool = req.app.locals.pool;
    const id = req.params.id;
    try {
      const result = await pool.query('SELECT * FROM note WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
  export const updateNote = async (req, res) => {
    const pool = req.app.locals.pool;
    const id = req.params.id;
    const {
      patient_id,
      transcript,
      subjective,
      objective,
      assessment,
      plan,
      length,
      date_recorded,
      type,
      note_owner,
    } = req.body;
    try {
      const result = await pool.query(
        `UPDATE note SET
        patient_id = $1,
        transcript = $2,
        subjective = $3,
        objective = $4,
        assessment = $5,
        plan = $6,
        length = $7,
        date_recorded = $8,
        type = $9,
        note_owner = $10
        WHERE id = $11 RETURNING *`,
        [
          patient_id,
          transcript,
          subjective,
          objective,
          assessment,
          plan,
          length,
          date_recorded,
          type,
          note_owner,
          id,
        ]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
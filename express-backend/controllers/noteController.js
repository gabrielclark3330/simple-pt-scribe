export const createNote = async (req, res) => {
  const pool = req.app.locals.pool;
  const {
    patient_id,
    transcript,
    length,
    date_recorded,
    type,
    note_owner,
    note_content,
  } = req.body;

  if (!patient_id || !transcript || length === undefined || !type || !note_owner || !note_content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const patientResult = await pool.query('SELECT * FROM patient WHERE id = $1', [patient_id]);
    if (patientResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid patient_id' });
    }

    // Verify that note_owner matches the authenticated user
    // Assuming you have access to req.user from authentication middleware
    if (req.user.id !== note_owner) {
      return res.status(403).json({ error: 'Unauthorized to create note for this user' });
    }

    const result = await pool.query(
      `INSERT INTO note
      (patient_id, transcript, length, date_recorded, type, note_owner, note_content)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        patient_id,
        transcript,
        length,
        date_recorded,
        type,
        note_owner,
        JSON.stringify(note_content),
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
    const result = await pool.query(`
      SELECT 
        note.id,
        note.transcript,
        note.length,
        note.date_recorded,
        note.type,
        note.note_owner,
        note.note_content,
        patient.id AS patient_id,
        patient.first_name AS patient_first_name,
        patient.last_name AS patient_last_name
      FROM 
        note
      JOIN 
        patient ON note.patient_id = patient.id
      ORDER BY 
        note.date_recorded DESC
    `);

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
    const result = await pool.query(`
      SELECT 
        note.id,
        note.transcript,
        note.length,
        note.date_recorded,
        note.type,
        note.note_owner,
        note.note_content,
        patient.id AS patient_id,
        patient.first_name AS patient_first_name,
        patient.last_name AS patient_last_name
      FROM 
        note
      JOIN 
        patient ON note.patient_id = patient.id
      WHERE 
        note.id = $1
    `, [id]);

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
    length,
    date_recorded,
    type,
    note_owner,
    note_content,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE note SET
      patient_id = $1,
      transcript = $2,
      length = $3,
      date_recorded = $4,
      type = $5,
      note_owner = $6,
      note_content = $7
      WHERE id = $8 RETURNING *`,
      [
        patient_id,
        transcript,
        length,
        date_recorded,
        type,
        note_owner,
        note_content,
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

export const getNotesByPatientId = async (req, res) => {
  const pool = req.app.locals.pool;
  const patientId = req.params.patientId;
  try {
    const result = await pool.query(`
      SELECT 
        note.id,
        note.transcript,
        note.length,
        note.date_recorded,
        note.type,
        note.note_owner,
        note.note_content,
        patient.id AS patient_id,
        patient.first_name AS patient_first_name,
        patient.last_name AS patient_last_name
      FROM 
        note
      JOIN 
        patient ON note.patient_id = patient.id
      WHERE 
        note.patient_id = $1
      ORDER BY 
        note.date_recorded DESC
    `, [patientId]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
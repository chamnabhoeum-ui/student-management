const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpass',
  database: process.env.DB_NAME || 'college',
});

app.delete('/students/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM students WHERE student_id = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Student not found' });
    res.json({ message: `Student ${req.params.id} deleted successfully` });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

app.listen(8082, () => console.log('Delete service on 8082'));

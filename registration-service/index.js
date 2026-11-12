const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpass',
  database: process.env.DB_NAME || 'college',
  waitForConnections: true,
  connectionLimit: 10,
});

async function initDb() {
  for (let i = 0; i < 30; i++) {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS students (
        student_id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(100) NOT NULL,
        student_mobile VARCHAR(20) NOT NULL,
        student_email VARCHAR(100) NOT NULL UNIQUE,
        student_password VARCHAR(255) NOT NULL
      )`);
      console.log('Database ready');
      return;
    } catch (e) {
      console.log('Waiting for DB...', e.code);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  process.exit(1);
}

app.post('/register', async (req, res) => {
  const { student_name, student_mobile, student_email, student_password } = req.body;
  if (!student_name || !student_mobile || !student_email || !student_password)
    return res.status(400).json({ message: 'All fields are required' });
  try {
    const hash = await bcrypt.hash(student_password, 10);
    const [result] = await pool.query(
      'INSERT INTO students (student_name, student_mobile, student_email, student_password) VALUES (?,?,?,?)',
      [student_name, student_mobile, student_email, hash]);
    res.status(201).json({ message: 'Student registered', student_id: result.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

initDb().then(() => app.listen(8081, () => console.log('Registration service on 8081')));

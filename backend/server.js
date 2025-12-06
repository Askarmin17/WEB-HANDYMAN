require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Test root
app.get('/', (req, res) => {
  res.send('Backend WEB-HANDYMAN berjalan 🚀');
});

// --- AUTH: register & login (simple, no hashing - upgrade recommended) ---
app.post('/api/register', (req, res) => {
  const { nama_depan, nama_belakang, email, password, jenis_kelamin, alamat } = req.body;
  const sql = `INSERT INTO users (nama_depan, nama_belakang, email, password, jenis_kelamin, alamat) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [nama_depan, nama_belakang, email, password, jenis_kelamin, alamat], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, message: 'Register Berhasil' });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (result.length > 0) res.json({ success: true, user: result[0] });
    else res.status(401).json({ success: false, message: 'Salah email/pass' });
  });
});

// --- Pesanan ---
app.post('/api/pesanan', (req, res) => {
  const { nama_user, kategori, deskripsi, alamat, foto } = req.body;
  const sql = "INSERT INTO pesanan (nama_user, kategori_jasa, deskripsi_masalah, alamat, `Foto masalah`) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [nama_user, kategori, deskripsi, alamat, foto], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, message: 'Pesanan Terkirim!' });
  });
});

// --- CHAT system ---
app.get('/api/chats/:email', (req, res) => {
  const userEmail = req.params.email;
  const sql = "SELECT * FROM chats WHERE user_email = ? OR user_email = 'ALL' ORDER BY created_at ASC";
  db.query(sql, [userEmail], (err, result) => {
    if (err) return res.status(500).json([]);
    res.json(result);
  });
});

app.post('/api/chats', (req, res) => {
  const { user_email, sender_role, message } = req.body;
  const sql = "INSERT INTO chats (user_email, sender_role, message) VALUES (?, ?, ?)";
  db.query(sql, [user_email, sender_role, message], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    // Simulasi bot admin membalas
    if (sender_role === 'user') {
      setTimeout(() => {
        const reply = "Terima kasih! Admin kami sedang mengecek pesan Anda.";
        const sqlBot = "INSERT INTO chats (user_email, sender_role, message) VALUES (?, 'admin', ?)";
        db.query(sqlBot, [user_email, reply], (err2) => {
          // ignore error in bot reply
        });
      }, 3000);
    }
    res.json({ success: true });
  });
});

// Minimal tukang CRUD examples using tables in your SQL dump
app.get('/tukang', (req, res) => {
  db.query('SELECT * FROM tukang', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/tukang', (req, res) => {
  const { nama, email, password, alamat, no_telepon, spesialisasi } = req.body;
  const sql = "INSERT INTO tukang (nama, email, password, alamat, no_telepon, spesialisasi) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [nama, email, password, alamat, no_telepon, spesialisasi], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tukang ditambahkan', id: result.insertId });
  });
});

app.delete('/tukang/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM tukang WHERE tukang_id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tukang dihapus' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

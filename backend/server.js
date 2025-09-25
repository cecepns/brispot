const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads-brispot');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'foto-' + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploads static
app.use('/uploads-brispot', express.static(path.join(__dirname, 'uploads-brispot')));

// Database pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'brispot',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Healthcheck
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, db: rows[0].ok === 1 });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// List pengajuan (with optional search and pagination)
app.get('/api/pengajuan', async (req, res) => {
  try {
    const { q = '', page = 1, pageSize = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);
    const like = `%${q}%`;

    const [totalRows] = await pool.query(
      'SELECT COUNT(*) AS count FROM pengajuan WHERE nama LIKE ? OR nik LIKE ? OR npwp LIKE ? OR pekerjaan LIKE ? OR nomor_hp LIKE ?',
      [like, like, like, like, like]
    );
    const total = totalRows[0].count;

    const [rows] = await pool.query(
      'SELECT * FROM pengajuan WHERE nama LIKE ? OR nik LIKE ? OR npwp LIKE ? OR pekerjaan LIKE ? OR nomor_hp LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [like, like, like, like, like, Number(pageSize), offset]
    );

    res.json({ data: rows, meta: { total, page: Number(page), pageSize: Number(pageSize) } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get detail pengajuan by id
app.get('/api/pengajuan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM pengajuan WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create pengajuan (with optional foto)
app.post('/api/pengajuan', upload.single('foto'), async (req, res) => {
  try {
    const body = req.body;
    const file = req.file;

    const payload = {
      mode: body.mode || 'pengajuan',
      nama: body.nama || '',
      nik: body.nik || '',
      ttl: body.ttl || '',
      npwp: body.npwp || '',
      pekerjaan: body.pekerjaan || '',
      nomor_hp: body.nomorHp || null,
      nominal_pengajuan: body.nominalPengajuan ? Number(body.nominalPengajuan) : null,
      jangka_waktu: body.jangkaWaktu ? Number(body.jangkaWaktu) : null,
      angsuran: body.angsuran ? Number(body.angsuran) : null,
      bunga: body.bunga ? Number(body.bunga) : null,
      revisi_nominal: body.revisiNominal ? Number(body.revisiNominal) : null,
      status: body.status || 'Proses',
      progress: body.progress || null,
      foto_path: file ? `/uploads-brispot/${file.filename}` : null,
    };

    const [result] = await pool.query(
      `INSERT INTO pengajuan
      (mode, nama, nik, ttl, npwp, pekerjaan, nomor_hp, nominal_pengajuan, jangka_waktu, angsuran, bunga, revisi_nominal, status, progress, foto_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.mode,
        payload.nama,
        payload.nik,
        payload.ttl,
        payload.npwp,
        payload.pekerjaan,
        payload.nomor_hp,
        payload.nominal_pengajuan,
        payload.jangka_waktu,
        payload.angsuran,
        payload.bunga,
        payload.revisi_nominal,
        payload.status,
        payload.progress,
        payload.foto_path,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM pengajuan WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update pengajuan (json or multipart)
app.put('/api/pengajuan/:id', upload.single('foto'), async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const file = req.file;

    // Get previous for potential file cleanup
    const [existingRows] = await pool.query('SELECT * FROM pengajuan WHERE id = ?', [id]);
    if (existingRows.length === 0) return res.status(404).json({ error: 'Not found' });
    const existing = existingRows[0];

    const payload = {
      mode: body.mode ?? existing.mode,
      nama: body.nama ?? existing.nama,
      nik: body.nik ?? existing.nik,
      ttl: body.ttl ?? existing.ttl,
      npwp: body.npwp ?? existing.npwp,
      pekerjaan: body.pekerjaan ?? existing.pekerjaan,
      nomor_hp: body.nomorHp !== undefined ? body.nomorHp : existing.nomor_hp,
      nominal_pengajuan: body.nominalPengajuan !== undefined ? Number(body.nominalPengajuan) : existing.nominal_pengajuan,
      jangka_waktu: body.jangkaWaktu !== undefined ? Number(body.jangkaWaktu) : existing.jangka_waktu,
      angsuran: body.angsuran !== undefined ? Number(body.angsuran) : existing.angsuran,
      bunga: body.bunga !== undefined ? Number(body.bunga) : existing.bunga,
      revisi_nominal: body.revisiNominal !== undefined ? Number(body.revisiNominal) : existing.revisi_nominal,
      status: body.status ?? existing.status,
      progress: body.progress ?? existing.progress,
      foto_path: file ? `/uploads-brispot/${file.filename}` : existing.foto_path,
    };

    await pool.query(
      `UPDATE pengajuan SET mode=?, nama=?, nik=?, ttl=?, npwp=?, pekerjaan=?, nomor_hp=?, nominal_pengajuan=?, jangka_waktu=?, angsuran=?, bunga=?, revisi_nominal=?, status=?, progress=?, foto_path=? WHERE id=?`,
      [
        payload.mode,
        payload.nama,
        payload.nik,
        payload.ttl,
        payload.npwp,
        payload.pekerjaan,
        payload.nomor_hp,
        payload.nominal_pengajuan,
        payload.jangka_waktu,
        payload.angsuran,
        payload.bunga,
        payload.revisi_nominal,
        payload.status,
        payload.progress,
        payload.foto_path,
        id,
      ]
    );

    // Cleanup old file if replaced
    if (file && existing.foto_path) {
      const imageName = path.basename(existing.foto_path);
      const imagePath = path.join(__dirname, 'uploads-brispot', imageName);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log(`Deleted old image: ${imageName}`);
        } catch (deleteError) {
          console.error(`Failed to delete image ${imageName}:`, deleteError);
        }
      }
    }

    const [rows] = await pool.query('SELECT * FROM pengajuan WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete pengajuan
app.delete('/api/pengajuan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [existingRows] = await pool.query('SELECT * FROM pengajuan WHERE id = ?', [id]);
    if (existingRows.length === 0) return res.status(404).json({ error: 'Not found' });
    const existing = existingRows[0];

    await pool.query('DELETE FROM pengajuan WHERE id = ?', [id]);

    if (existing.foto_path) {
      const imageName = path.basename(existing.foto_path);
      const imagePath = path.join(__dirname, 'uploads-brispot', imageName);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log(`Deleted image: ${imageName}`);
        } catch (deleteError) {
          console.error(`Failed to delete image ${imageName}:`, deleteError);
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update progress/status quickly
app.patch('/api/pengajuan/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, status } = req.body;
    await pool.query('UPDATE pengajuan SET progress = ?, status = ? WHERE id = ?', [progress || null, status || 'Proses', id]);
    const [rows] = await pool.query('SELECT * FROM pengajuan WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`BRISPOT backend listening on http://localhost:${PORT}`);
});



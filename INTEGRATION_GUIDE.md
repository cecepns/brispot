# BRISPOT - Panduan Integrasi API

## Status Integrasi ✅

Halaman input data dan list data pengajuan telah berhasil terintegrasi dengan API backend!

## Fitur yang Telah Diintegrasikan

### 1. Halaman Input Data (`/input-data`)
- ✅ **Integrasi API CREATE**: Form input data terhubung dengan endpoint `POST /api/pengajuan`
- ✅ **Upload Foto**: Support upload file foto dengan Multer
- ✅ **Mode Pengajuan/Revisi**: Toggle antara mode pengajuan dan revisi
- ✅ **Progress Tracking**: Sistem progress step untuk tracking status
- ✅ **Edit Mode**: Support edit data existing via URL parameter `?edit=ID`
- ✅ **Validation**: Client-side validation untuk field wajib
- ✅ **Error Handling**: Menampilkan error message jika gagal submit
- ✅ **Success Feedback**: Konfirmasi berhasil dengan preview data

### 2. Halaman List Data (`/list-data`)
- ✅ **Integrasi API READ**: Menampilkan data dari endpoint `GET /api/pengajuan`
- ✅ **Search & Filter**: Pencarian berdasarkan nama, NIK, NPWP, pekerjaan
- ✅ **Pagination**: Support pagination dengan page size 10
- ✅ **Detail View**: Modal detail untuk melihat data lengkap
- ✅ **Edit Integration**: Tombol edit yang redirect ke form input
- ✅ **Delete Integration**: Hapus data via `DELETE /api/pengajuan/:id`
- ✅ **Progress Update**: Update progress dan status via `PATCH /api/pengajuan/:id/progress`
- ✅ **Photo Display**: Menampilkan foto profil dari uploads

### 3. Navigation & UX
- ✅ **Cross-page Navigation**: Tombol navigasi antar halaman
- ✅ **Loading States**: Loading indicator saat fetch/update data
- ✅ **Error States**: Error handling dengan pesan yang jelas
- ✅ **Responsive Design**: UI yang responsive untuk mobile/desktop

## API Endpoints yang Digunakan

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/pengajuan` | List data dengan search & pagination |
| GET | `/api/pengajuan/:id` | Detail data by ID |
| POST | `/api/pengajuan` | Create data baru |
| PUT | `/api/pengajuan/:id` | Update data existing |
| DELETE | `/api/pengajuan/:id` | Delete data |
| PATCH | `/api/pengajuan/:id/progress` | Update progress/status |

## Cara Menjalankan

### 1. Backend Server
```bash
cd backend
npm install
npm start
# Server akan berjalan di http://localhost:4000
```

### 2. Frontend Development
```bash
npm install
npm run dev
# Frontend akan berjalan di http://localhost:5173
```

## URL Routes

- `/input-data` - Form input data pengajuan
- `/input-data?edit=ID` - Form edit data (replace ID dengan ID data)
- `/list-data` - List semua data pengajuan
- `/revisi-briguna-digital/*` - Halaman revisi yang sudah ada

## Fitur Tambahan

### Error Handling
- Connection error handling dengan pesan informatif
- Validation error untuk field wajib
- Server error dengan status code

### Data Management
- Auto-reset form setelah submit berhasil
- Preserve mode (pengajuan/revisi) saat edit
- Photo upload dengan preview
- Currency formatting untuk nominal

### User Experience
- Loading states untuk semua async operations
- Success/error feedback yang jelas
- Modal confirmations untuk destructive actions
- Responsive design untuk semua device

## Database Schema

Tabel `pengajuan` dengan kolom:
- `id`, `mode`, `nama`, `nik`, `ttl`, `npwp`, `pekerjaan`
- `nominal_pengajuan`, `jangka_waktu`, `angsuran`, `bunga`
- `revisi_nominal`, `status`, `progress`, `foto_path`
- `created_at`, `updated_at`

## Troubleshooting

### Backend tidak bisa connect
- Pastikan MySQL server berjalan
- Check environment variables di `.env`
- Pastikan database `brispot` sudah dibuat
- Run `schema.sql` untuk create table

### Frontend error
- Pastikan backend server berjalan di port 4000
- Check browser console untuk error details
- Pastikan CORS sudah enabled di backend

### Upload foto tidak berfungsi
- Pastikan folder `uploads-brispot` ada dan writable
- Check file size limits di Multer config
- Pastikan file type yang diupload adalah image

---

**Status**: ✅ **SEMUA FITUR TERINTEGRASI DENGAN BERHASIL**

Frontend dan backend sudah terintegrasi penuh dengan semua CRUD operations, file upload, search, pagination, dan error handling yang proper.

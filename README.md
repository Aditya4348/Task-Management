# Task Management

Aplikasi manajemen tugas berbasis React dan Laravel. Project ini memiliki antarmuka untuk autentikasi sederhana, pengelolaan tugas, pencarian, filter, dan ringkasan status tugas.

## Fitur

- Registrasi dan login pengguna pada frontend
- Menambah, melihat, mengubah, dan menghapus tugas
- Menandai tugas sebagai selesai atau tertunda
- Prioritas tugas: rendah, sedang, dan tinggi
- Kategori: pekerjaan, pribadi, belanja, belajar, dan lainnya
- Tenggat waktu dan indikator tugas terlambat
- Pencarian serta filter berdasarkan status, prioritas, dan kategori
- Ringkasan jumlah seluruh tugas, tugas selesai, tertunda, dan terlambat
- Pemisahan data tugas berdasarkan pengguna
- Tampilan responsif

## Teknologi

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Motion
- Lucide React

### Backend

- PHP 8.2+
- Laravel 12
- Laravel Sanctum
- Database SQL yang didukung Laravel

## Struktur Project

```text
Task-Management/
├── FRONTEND/   # Aplikasi React
└── BACKEND/    # REST API Laravel dan migration database
```

## Menjalankan Frontend

Pastikan Node.js dan npm sudah terpasang.

```bash
cd FRONTEND
npm install
npm run dev
```

Frontend berjalan pada `http://localhost:3000`.

## Menjalankan Backend

Pastikan PHP 8.2+, Composer, dan database sudah tersedia.

```bash
cd BACKEND
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

Sebelum menjalankan migrasi, atur koneksi database pada file `BACKEND/.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_management
DB_USERNAME=root
DB_PASSWORD=
```

Backend berjalan pada `http://127.0.0.1:8000`.

## Akun Demo

Frontend menyediakan akun percobaan berikut:

```text
Email    : user@example.com
Password : password123
```

## Struktur Data Tugas

Setiap tugas memiliki data berikut:

- Pengguna pemilik tugas
- Judul dan deskripsi
- Status selesai
- Prioritas
- Kategori
- Tenggat waktu
- Waktu pembuatan dan pembaruan

Migration tabel `tasks` tersedia di `BACKEND/database/migrations` dan memiliki relasi foreign key ke tabel `users`.

## Status Pengembangan

Antarmuka frontend saat ini menyimpan autentikasi dan tugas menggunakan `localStorage`. Backend Laravel dan migration database telah disiapkan, tetapi integrasi API CRUD tugas dari frontend ke backend masih perlu dilanjutkan.

## Catatan

Project ini dibuat sebagai bahan technical test. Kandidat dapat melanjutkan implementasi model, controller, validasi, route API, autentikasi Sanctum, serta integrasi frontend dengan backend.

## Lisensi

Project ini dapat digunakan untuk kebutuhan pembelajaran dan technical assessment.

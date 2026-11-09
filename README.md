# FieldNote Backend

REST API backend untuk aplikasi FieldNote, dibangun menggunakan Node.js, Express, dan MySQL. Backend ini menyediakan autentikasi JWT, pengelolaan user dasar, serta task yang dapat ditugaskan kepada field worker.

> **Status:** pengembangan. Dokumentasi ini menjelaskan endpoint yang tersedia saat ini; fitur yang belum diimplementasikan ditandai secara eksplisit.

## Teknologi

- Node.js dengan ES Modules
- Express 5
- MySQL melalui `mysql2`
- JWT untuk autentikasi
- bcrypt untuk hashing dan verifikasi password

## Menjalankan secara lokal

### Prasyarat

- Node.js dan npm
- MySQL
- Database dengan tabel `users` dan `tasks` yang sesuai dengan kolom yang digunakan aplikasi

### Setup

1. Install dependency:

   ```bash
   npm install
   ```

2. Salin `.env.example` menjadi `.env`, lalu isi konfigurasi database dan secret JWT:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=fieldnote
   JWT_SECRET=replace_with_a_long_random_secret
   PORT=3000
   ```

   `PORT` bersifat opsional dan default-nya `3000`. Jangan commit file `.env` atau secret ke repository.

3. Pastikan database dan tabel sudah dibuat. Repository saat ini belum menyediakan migration atau SQL schema.

4. Jalankan server:

   ```bash
   npm start
   ```

Base URL lokal: `http://localhost:3000/api/v1`.

## Autentikasi dan format response

Login menggunakan `POST /auth/login`. Endpoint yang membutuhkan autentikasi menggunakan header:

```http
Authorization: Bearer <access_token>
```

Token berlaku selama satu hari. Role yang digunakan adalah `admin`, `supervisor`, dan `field_worker`.

Response API menggunakan format umum:

```json
{
  "status": 200,
  "message": "Request successful",
  "data": {}
}
```

Untuk error, `data` bernilai `null`. Error umum: `400` untuk input tidak valid, `401` untuk autentikasi gagal, `403` untuk akses ditolak, `404` untuk resource atau URL tidak ditemukan, dan `500` untuk error server. Endpoint yang belum diimplementasikan merespons `501`.

## Endpoint

Semua path di bawah menggunakan prefix `/api/v1`.

### Authentication

| Method | Path | Akses | Deskripsi |
|---|---|---|---|
| `POST` | `/auth/login` | Publik | Login dan memperoleh access token |

Contoh body:

```json
{
  "email": "worker@example.com",
  "password": "your-password"
}
```

### Users

| Method | Path | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/users` | Admin | Mengambil semua user |
| `POST` | `/users` | Admin | Membuat user |
| `GET` | `/users/assignable-workers` | Admin, supervisor | Mengambil field worker aktif |
| `PATCH` | `/users/me/password` | User login | Mengubah password sendiri |
| `GET` | `/users/:id` | Admin | Mengambil detail user |
| `PATCH` | `/users/:id/status` | Admin | Mengubah status user |
| `PATCH` | `/users/:id` | Admin | Belum diimplementasikan (`501`) |
| `POST` | `/users/:id/password` | Admin | Reset password belum diimplementasikan (`501`) |

Body untuk membuat user:

```json
{
  "name": "Field Worker",
  "email": "worker@example.com",
  "password": "your-password",
  "role": "field_worker"
}
```

Role yang dapat dibuat: `admin`, `supervisor`, `field_worker`. Untuk mengubah status user, gunakan body `{"status":"active"}` atau `{"status":"inactive"}`. Body ubah password sendiri menggunakan `currentPass` dan `newPass`.

### Tasks

| Method | Path | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/task` | Admin | Mengambil semua task |
| `POST` | `/task` | Admin, supervisor | Membuat task |
| `GET` | `/task/user` | User login | Mengambil task yang ditugaskan kepada user dari token |
| `GET` | `/task/:id` | Admin, field worker | Mengambil detail task; field worker hanya dapat melihat task yang ditugaskan kepadanya |
| `PATCH` | `/task/:id/status` | Admin, supervisor, field worker | Mengubah status task |
| `PUT` | `/task/:id` | Admin | Update task belum diimplementasikan (`501`) |

Body untuk membuat task:

```json
{
  "title": "Pemeriksaan instalasi listrik",
  "description": "Periksa kabel dan panel listrik.",
  "location": "Gedung B, Lantai 2",
  "assigned_to": 3,
  "due_date": "2026-12-01",
  "priority": "high"
}
```

`title`, `location`, `assigned_to`, dan `due_date` wajib. `priority` opsional, default `medium`; nilai yang diterima `low`, `medium`, atau `high`. Assignee harus merupakan field worker dengan status aktif. Status task saat dibuat ditetapkan menjadi `assigned`, dan `created_by` diambil dari user yang login.

Untuk mengubah status, kirim body seperti `{"status":"on progress"}` ke `PATCH /task/:id/status`. Field worker hanya dapat mengubah status task miliknya ke `on progress` atau `submitted`. Admin dan supervisor dapat memilih status valid: `draft`, `assigned`, `on progress`, `submitted`, `completed`, atau `cancelled`.

Hasil query baca task menyertakan `created_by` dan `assigned_to` sebagai ID, serta `created_by_name` dan `assigned_to_name` sebagai nama. Field tanggal pada hasil query baca task menggunakan format `YYYY-MM-DD`.

### Reports

Router report belum memiliki endpoint. Request ke `/report` saat ini tidak menyediakan fitur report dan akan berakhir dengan response `404`.

## Catatan saat ini

- Field worker dapat melihat detail task melalui `/task/:id` hanya jika task tersebut ditugaskan kepadanya. Task yang tidak ditemukan atau bukan milik worker akan menghasilkan `404`.
- Task checklist, submit/review report, dan upload foto belum diimplementasikan.
- Update task, update profil user, dan reset password admin belum diimplementasikan.
- Pagination, filtering, dokumentasi OpenAPI, migration database, dan automated tests belum disediakan.
- Script `npm test` belum dikonfigurasi untuk menjalankan test.

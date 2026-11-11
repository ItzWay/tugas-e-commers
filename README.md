# J2M E-commerce — Next.js + TypeScript

Versi migrasi penuh dari aplikasi Laravel J2M ke Next.js App Router dan TypeScript.

## Fitur

- Katalog, pencarian, filter kategori, dan detail produk
- Registrasi, login, logout, serta sesi cookie yang ditandatangani
- Keranjang, validasi stok, checkout simulasi, dan riwayat pesanan
- Permintaan jok custom berdasarkan tipe motor dan catatan pelanggan
- Dashboard admin, CRUD produk/kategori, dan perubahan status pesanan
- Prisma ORM dan database SQLite yang langsung dapat digunakan

## Menjalankan aplikasi

1. Pastikan Node.js 20.9 atau lebih baru sudah terpasang.
2. Ekstrak ZIP, buka terminal pada folder proyek, lalu jalankan:

```bash
npm install
```

3. Salin `.env.example` menjadi `.env`, lalu ganti `SESSION_SECRET` dengan teks acak minimal 32 karakter.
4. Siapkan database dan data contoh:

```bash
npm run setup
```

5. Jalankan aplikasi:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Akun admin awal

- Email: nilai `ADMIN_EMAIL` di `.env` (default `admin@j2m.local`)
- Password: nilai `ADMIN_PASSWORD` di `.env` (default `AdminJ2M123!`)

Ganti kredensial default sebelum aplikasi digunakan di luar komputer lokal.

## Catatan database

Konfigurasi bawaan memakai SQLite agar proyek bisa langsung dicoba. Untuk MySQL, ubah `provider` pada `prisma/schema.prisma` menjadi `mysql`, isi `DATABASE_URL` MySQL, lalu jalankan migrasi Prisma kembali.

## Produksi

```bash
npm run build
npm start
```

Checkout, pembayaran, dan pengiriman pada proyek ini tetap merupakan simulasi seperti aplikasi Laravel asal.
"# tugas-e-commers" 

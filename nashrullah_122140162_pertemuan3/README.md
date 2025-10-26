# Aplikasi Manajemen Buku Pribadi

Dashboard React untuk mengelola koleksi buku pribadi—baik yang sudah dimiliki, sedang dibaca, maupun masih dalam wishlist. Data tersimpan di `localStorage` sehingga tetap aman walau halaman ditutup.

## Cara Menjalankan
1. Masuk ke folder proyek: `cd nashrullah_122140162_pertemuan3`
2. Install dependencies: `npm install`
3. Jalankan aplikasi: `npm run dev`
4. Buka URL yang muncul di terminal (default `http://localhost:5173`)

### Menjalankan Testing
- `npm run test` menjalankan 5 unit test dengan Vitest + React Testing Library.

## Fitur Utama
- **CRUD buku**: tambah, edit, hapus dengan validasi form dan pesan kesalahan.
- **Filter & pencarian**: saring berdasarkan status (milik/baca/wishlist) dan cari judul atau penulis.
- **Statistik koleksi**: halaman khusus yang menampilkan ringkasan total buku, status, dan penulis favorit.
- **Wishlist & bacaan aktif**: daftar khusus untuk memantau progres membaca dan rencana pembelian.
- **Penyimpanan lokal**: seluruh data buku disimpan otomatis di `localStorage`.

## Implementasi React & ES6+
- **Hooks bawaan**: `useState` untuk state form/filter, `useEffect` di custom hook `useLocalStorage` untuk sinkronisasi data.
- **React Router**: navigasi multi-halaman (`/` dan `/stats`).
- **Context API**: `BookProvider` menyimpan data buku, filter, serta aksi CRUD agar komponen tetap ringan.
- **Custom hooks**:
  - `useLocalStorage` – abstraksi penyimpanan persisten dengan sinkronisasi antar-tab.
  - `useBookStats` – perhitungan statistik koleksi berbasis memoization.
- **Komponen reusable**: `BookForm`, `BookFilter`, `BookList`, `BookCard`, `SearchBar`, `EmptyState`, `StatsSummary`.
- **Template literals & arrow function** digunakan secara konsisten untuk rendering dinamis dan deklarasi fungsi.

## Struktur Direktori Singkat
```
src/
├── App.jsx
├── components/
│   ├── BookForm/
│   ├── BookList/
│   ├── BookFilter/
│   ├── BookCard/
│   ├── EmptyState/
│   ├── Layout/
│   ├── SearchBar/
│   └── StatsSummary/
├── context/BookContext.jsx
├── hooks/
│   ├── useBookStats.js
│   └── useLocalStorage.js
├── pages/
│   ├── Home/
│   └── Stats/
└── __tests__/bookApp.test.jsx
```

## Screenshot Antarmuka
- Halaman beranda & form: `screenshots/fitur-1.png`
- Filter & pencarian: `screenshots/fitur-2.png`
- Statistik koleksi: `screenshots/fitur-3.png`
- Laporan testing: `screenshots/tests-result.png`

## Catatan Testing
Semua 5 unit test yang memverifikasi alur CRUD, filter, pencarian, dan statistik lulus melalui `npm run test`. Hasil ringkas dapat dilihat pada `screenshots/tests-result.png`.

Selamat mencoba, semoga membantu kamu merapikan koleksi bacaan!

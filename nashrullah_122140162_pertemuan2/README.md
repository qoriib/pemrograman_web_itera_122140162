# Personal Dashboard Mahasiswa

Aplikasi dashboard personal berbasis web untuk merangkum aktivitas penting seperti jadwal, tugas, dan catatan prioritas. Data disimpan di `localStorage`, sehingga tetap tersedia walau halaman ditutup.

## Cara Menjalankan
- Buka `index.html` secara langsung di peramban modern (Chrome, Edge, Firefox, Safari).
- Tidak memerlukan server tambahan maupun proses build.

## Fitur Utama
- Tambah, edit, dan hapus item dashboard dengan kategori berbeda (Jadwal, Tugas, Catatan, Prioritas).
- Filter daftar berdasarkan kategori dan pantau statistik jumlah item serta kategori aktif.
- Pesan motivasi harian yang diperbarui otomatis menggunakan API publik dengan fallback lokal.
- Desain responsif yang nyaman digunakan pada desktop dan perangkat bergerak.

## Penggunaan localStorage
- Semua data item disimpan sebagai array objek di key `personal_dashboard_entries_v1`.
- Perubahan (tambah, edit, hapus, bersihkan semua) langsung disinkronkan ke `localStorage`.
- Status pembaruan motivasi dicatat pada key `personal_dashboard_motivation_timestamp` untuk menghindari permintaan API berlebihan.

## Implementasi Fitur ES6+
- `let` dan `const` digunakan sesuai kebutuhan variabel yang dapat/mungkin berubah.
- **Arrow functions**: `formatDate`, `randomFromList`, `generateId`, serta berbagai handler (`handleSubmit`, `deleteEntry`, dll.).
- **Template literals**: digunakan untuk render dinamis (mis. `\`<p>${message}</p>\``) dan menampilkan detail item (`Tanggal: ${formatDate(entry.date)}`).
- **Async/Await**: fungsi `loadMotivationMessage` mengambil data motivasi dari API `quotable.io` dengan fallback lokal.
- **Class**: `DashboardApp` mengatur seluruh state, event handler, render UI, dan interaksi data.

## Screenshot
![Dashboard Overview](screenshots/dashboard-overview.png)

## Struktur File
- `index.html` – struktur halaman dan elemen UI dashboard.
- `styles.css` – styling utama dan layout responsif.
- `script.js` – logika aplikasi, pengelolaan data, interaksi UI, serta integrasi motivasi.
- `screenshots/` – dokumentasi visual aplikasi.

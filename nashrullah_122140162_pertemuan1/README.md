# Aplikasi Manajemen Tugas Mahasiswa

Aplikasi web sederhana untuk membantu mahasiswa mengelola tugas akademik sehari-hari. Seluruh data disimpan secara lokal di browser melalui `localStorage`, sehingga tugas tetap tersimpan meskipun halaman ditutup.

## Cara Menjalankan
- Buka file `index.html` langsung di peramban modern (Chrome, Edge, Firefox, Safari).
- Tidak memerlukan server atau proses build tambahan.

## Fitur yang Diimplementasikan
- Menambah tugas baru dengan informasi nama tugas, mata kuliah, dan deadline.
- Mengedit tugas yang sudah ada tanpa kehilangan data lainnya.
- Menandai tugas sebagai selesai atau belum selesai dengan sekali klik.
- Menghapus tugas secara individual atau menghapus semua tugas yang sudah selesai.
- Filter tugas berdasarkan status (semua, belum selesai, selesai) dan mata kuliah.
- Pencarian cepat menggunakan kata kunci pada nama tugas atau mata kuliah.
- Ringkasan jumlah tugas yang belum selesai tampil pada header aplikasi.
- Validasi form yang memastikan seluruh input penting terisi dan deadline menggunakan tanggal yang valid.
- Antarmuka responsif dengan tampilan yang nyaman digunakan di desktop maupun perangkat bergerak.

## Penjelasan Penyimpanan Data
- Semua tugas disimpan sebagai array objek di `localStorage` dengan key `student_tasks`.
- Data otomatis dimuat saat halaman dibuka (`loadTasks`) dan setiap perubahan akan memanggil `saveTasks` untuk memperbarui `localStorage`.
- Struktur data setiap tugas:
  ```json
  {
    "id": "uuid",
    "name": "Nama tugas",
    "course": "Nama mata kuliah",
    "deadline": "YYYY-MM-DD",
    "completed": false,
    "createdAt": 1700000000000
  }
  ```
- Pendekatan ini memastikan tidak ada kebutuhan backend dan data tersimpan secara persisten di perangkat pengguna.

## Penjelasan Validasi Form
- **Nama tugas** dan **mata kuliah** wajib diisi (tidak boleh hanya spasi).
- **Deadline** wajib terisi dan harus berupa tanggal yang valid (akan ditolak jika format tidak dikenali oleh objek `Date`).
- Validasi dijalankan sebelum data disimpan; jika ada input yang tidak valid, pesan error akan tampil di bawah form dan proses penyimpanan dibatalkan.

## Screenshot Aplikasi
![Dashboard tugas aktif](screenshots/screenshot-dashboard.png)
![Filter status dan mata kuliah](screenshots/screenshot-filter.png)
![Validasi form saat input tidak lengkap](screenshots/screenshot-validasi.png)

## Struktur Proyek
- `index.html` – struktur halaman dan komponen UI.
- `styles.css` – styling utama aplikasi.
- `script.js` – logika aplikasi, termasuk pengelolaan data, render UI, filter, dan validasi.
- `screenshots/` – dokumentasi visual fitur aplikasi.

## Ide Pengembangan Lanjutan
1. Menambahkan fitur pengingat deadline lewat notifikasi browser.
2. Menyediakan opsi ekspor/impor data tugas dalam format JSON.
3. Menambahkan kategori prioritas untuk setiap tugas.

# Matakuliah API (Pyramid + PostgreSQL)

A simple CRUD API for managing data *Matakuliah* built with Pyramid, SQLAlchemy, Alembic, and PostgreSQL.

## Deskripsi Proyek
API ini menyediakan endpoint untuk membuat, membaca, memperbarui, dan menghapus data matakuliah. Model yang digunakan:

- `id` (Integer, PK, auto increment)
- `kode_mk` (Text, unique, not null)
- `nama_mk` (Text, not null)
- `sks` (Integer, not null)
- `semester` (Integer, not null)

## Prasyarat
- Python 3.8+
- PostgreSQL berjalan di mesin lokal
- `psql` client untuk membuat database (opsional)

## Instalasi
1. Buat dan aktifkan virtual environment
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
2. Instal dependensi dalam editable mode
   ```bash
   pip install --upgrade pip
   pip install -e "./matakuliah_api"
   ```

## Konfigurasi Database
Buat database dan user PostgreSQL (contoh kredensial dapat diubah sesuai kebutuhan):
```sql
CREATE DATABASE matakuliah_db;
CREATE USER pyramid_user WITH ENCRYPTED PASSWORD 'pyramid_pass';
GRANT ALL PRIVILEGES ON DATABASE matakuliah_db TO pyramid_user;
```
Perbarui `sqlalchemy.url` di `matakuliah_api/development.ini` jika Anda menggunakan kredensial atau host berbeda.

## Menjalankan Migrasi
1. Buat tabel menggunakan Alembic
   ```bash
   cd matakuliah_api
   alembic -c development.ini upgrade head
   ```

2. (Opsional) Membuat revision baru jika model berubah
   ```bash
   alembic -c development.ini revision --autogenerate -m "message"
   alembic -c development.ini upgrade head
   ```

## Inisialisasi Data Awal
Tambahkan 3 data matakuliah contoh:
```bash
cd matakuliah_api
python -m matakuliah_api.scripts.initialize_db development.ini
```

## Menjalankan Server
```bash
cd matakuliah_api
pserve development.ini --reload
```
Server berjalan di `http://localhost:6543`.

## API Endpoints
Semua respons dikembalikan dalam JSON.

- `GET /api/matakuliah` — daftar semua matakuliah
- `GET /api/matakuliah/{id}` — detail matakuliah berdasarkan `id`
- `POST /api/matakuliah` — buat matakuliah baru
- `PUT /api/matakuliah/{id}` — perbarui data matakuliah
- `DELETE /api/matakuliah/{id}` — hapus matakuliah

### Contoh Request/Response
**Get All**
```bash
curl -X GET http://localhost:6543/api/matakuliah
```
Respons contoh:
```json
{
  "matakuliah": [
    {
      "id": 1,
      "kode_mk": "IF101",
      "nama_mk": "Algoritma dan Pemrograman",
      "sks": 3,
      "semester": 1
    }
  ]
}
```

**Get Detail**
```bash
curl -X GET http://localhost:6543/api/matakuliah/1
```

**Create**
```bash
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{
    "kode_mk": "IF202",
    "nama_mk": "Pemrograman Lanjut",
    "sks": 3,
    "semester": 4
  }'
```

**Update**
```bash
curl -X PUT http://localhost:6543/api/matakuliah/1 \
  -H "Content-Type: application/json" \
  -d '{"semester": 2, "nama_mk": "Algoritma"}'
```

**Delete**
```bash
curl -X DELETE http://localhost:6543/api/matakuliah/1
```

## Struktur Proyek
```
matakuliah_api/
├── development.ini
├── README.md
├── setup.py
└── matakuliah_api/
    ├── __init__.py
    ├── alembic/
    │   ├── env.py
    │   └── versions/
    │       └── 20240512120000_create_matakuliah.py
    ├── models/
    │   ├── __init__.py
    │   ├── matakuliah.py
    │   └── meta.py
    ├── routes.py
    ├── scripts/
    │   └── initialize_db.py
    └── views/
        ├── __init__.py
        └── matakuliah.py
```

## Testing Cepat dengan curl
Pastikan server berjalan, lalu jalankan perintah berikut:
```bash
curl -X GET http://localhost:6543/api/matakuliah
curl -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF303","nama_mk":"Jaringan Komputer","sks":3,"semester":5}'
curl -X PUT http://localhost:6543/api/matakuliah/2 -H "Content-Type: application/json" \
  -d '{"semester":6}'
curl -X DELETE http://localhost:6543/api/matakuliah/3
```

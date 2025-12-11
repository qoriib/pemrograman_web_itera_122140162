# DATA AWAL MAHASISWA
mahasiswa_list = [
    {"nama": "Andi", "nim": "123140001", "uts": 85, "uas": 80, "tugas": 90},
    {"nama": "Budi", "nim": "123140002", "uts": 70, "uas": 75, "tugas": 68},
    {"nama": "Cici", "nim": "123140003", "uts": 60, "uas": 65, "tugas": 58},
    {"nama": "Dewi", "nim": "123140004", "uts": 50, "uas": 55, "tugas": 60},
    {"nama": "Eka", "nim": "123140005", "uts": 40, "uas": 45, "tugas": 50},
]

# Fungsi Hitung Nilai Akhir
def hitung_nilai_akhir(uts, uas, tugas):
    return 0.3 * uts + 0.4 * uas + 0.3 * tugas


# Fungsi Menentukan Grade
def tentukan_grade(nilai):
    if nilai >= 80:
        return "A"
    elif nilai >= 70:
        return "B"
    elif nilai >= 60:
        return "C"
    elif nilai >= 50:
        return "D"
    else:
        return "E"

# Fungsi Tampilkan Data dalam Format Tabel
def tampilkan_data(mahasiswa_list):
    print("\n===== TABEL DATA MAHASISWA =====")
    print("Nama\t\tNIM\t\tUTS\tUAS\tTugas\tAkhir\tGrade")
    print("-" * 70)

    for m in mahasiswa_list:
        nilai_akhir = hitung_nilai_akhir(m["uts"], m["uas"], m["tugas"])
        grade = tentukan_grade(nilai_akhir)

        print(f"{m['nama']}\t\t{m['nim']}\t{m['uts']}\t{m['uas']}\t{m['tugas']}\t{nilai_akhir:.2f}\t{grade}")

    print("-" * 70)

# Fungsi Cari Mahasiswa Nilai Tertinggi
def nilai_tertinggi(mahasiswa_list):
    return max(mahasiswa_list, key=lambda m: hitung_nilai_akhir(m["uts"], m["uas"], m["tugas"]))

# Fungsi Cari Mahasiswa Nilai Terendah
def nilai_terendah(mahasiswa_list):
    return min(mahasiswa_list, key=lambda m: hitung_nilai_akhir(m["uts"], m["uas"], m["tugas"]))

# Fungsi Tambah Mahasiswa Baru
def tambah_mahasiswa():
    print("\n=== Tambah Data Mahasiswa Baru ===")
    nama = input("Nama: ")
    nim = input("NIM: ")
    uts = float(input("Nilai UTS: "))
    uas = float(input("Nilai UAS: "))
    tugas = float(input("Nilai Tugas: "))

    mahasiswa_list.append({
        "nama": nama,
        "nim": nim,
        "uts": uts,
        "uas": uas,
        "tugas": tugas
    })
    print("Data berhasil ditambahkan!\n")

# Fungsi Filter Mahasiswa Berdasarkan Grade
def filter_grade(target_grade):
    hasil = []
    for m in mahasiswa_list:
        akhir = hitung_nilai_akhir(m["uts"], m["uas"], m["tugas"])
        if tentukan_grade(akhir) == target_grade:
            hasil.append(m)
    return hasil

# Fungsi Hitung Rata-Rata Nilai Kelas
def rata_rata_kelas():
    total = 0
    for m in mahasiswa_list:
        total += hitung_nilai_akhir(m["uts"], m["uas"], m["tugas"])
    return total / len(mahasiswa_list)

# MENU UTAMA
def menu():
    while True:
        print("\n========== MENU ==========")
        print("1. Tampilkan semua data mahasiswa")
        print("2. Tambah mahasiswa baru")
        print("3. Cari nilai tertinggi")
        print("4. Cari nilai terendah")
        print("5. Filter mahasiswa berdasarkan grade")
        print("6. Hitung rata-rata nilai kelas")
        print("7. Keluar")
        print("==========================")

        pilihan = input("Pilih menu (1-7): ")

        if pilihan == "1":
            tampilkan_data(mahasiswa_list)

        elif pilihan == "2":
            tambah_mahasiswa()

        elif pilihan == "3":
            m = nilai_tertinggi(mahasiswa_list)
            akhir = hitung_nilai_akhir(m["uts"], m["uas"], m["tugas"])
            print(f"\nMahasiswa nilai tertinggi: {m['nama']} ({m['nim']}) — {akhir:.2f}")

        elif pilihan == "4":
            m = nilai_terendah(mahasiswa_list)
            akhir = hitung_nilai_akhir(m["uts"], m["uas"], m["tugas"])
            print(f"\nMahasiswa nilai terendah: {m['nama']} ({m['nim']}) — {akhir:.2f}")

        elif pilihan == "5":
            grade = input("Masukkan grade (A/B/C/D/E): ").upper()
            hasil = filter_grade(grade)
            tampilkan_data(hasil)

        elif pilihan == "6":
            print(f"\nRata-rata nilai kelas: {rata_rata_kelas():.2f}")

        elif pilihan == "7":
            print("Program selesai. Terima kasih!")
            break

        else:
            print("Pilihan tidak valid!")


menu()
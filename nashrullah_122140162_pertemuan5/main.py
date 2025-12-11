from abc import ABC, abstractmethod

# ABSTRACT CLASS: LibraryItem
# Blueprint untuk semua item perpustakaan
class LibraryItem(ABC):
    def __init__(self, item_id, title):
        # Protected attribute (hanya bisa diakses oleh class & subclass)
        self._item_id = item_id
        
        # Private attribute (hanya class ini yang boleh akses)
        self.__title = title

    # Property decorator untuk encapsulation
    @property
    def title(self):
        """Getter untuk judul item"""
        return self.__title
    
    @title.setter
    def title(self, new_title):
        """Setter untuk judul item"""
        if len(new_title) < 3:
            raise ValueError("Judul terlalu pendek!")
        self.__title = new_title

    @property
    def item_id(self):
        """Getter item ID"""
        return self._item_id

    @abstractmethod
    def show_info(self):
        """Abstract method wajib di-override oleh subclass"""
        pass

# SUBCLASS: Book
class Book(LibraryItem):
    def __init__(self, item_id, title, author, year):
        super().__init__(item_id, title)
        self.author = author
        self.year = year

    def show_info(self):
        """Polymorphism: implementasi khusus untuk Book"""
        print(f"[BOOK] ID: {self.item_id} | Judul: {self.title} | "
              f"Penulis: {self.author} | Tahun: {self.year}")

# SUBCLASS: Magazine
class Magazine(LibraryItem):
    def __init__(self, item_id, title, issue_number):
        super().__init__(item_id, title)
        self.issue_number = issue_number

    def show_info(self):
        """Polymorphism: implementasi khusus untuk Magazine"""
        print(f"[MAGAZINE] ID: {self.item_id} | Judul: {self.title} | "
              f"Issue: {self.issue_number}")

# CLASS: Library
# Menyimpan dan mengelola koleksi item perpustakaan
class Library:
    def __init__(self):
        # Menyimpan semua item
        self._items = []

    def add_item(self, item):
        """Menambahkan item ke perpustakaan"""
        self._items.append(item)
        print(f"Item '{item.title}' berhasil ditambahkan!\n")

    def show_all_items(self):
        """Menampilkan semua item di perpustakaan"""
        print("\n===== DAFTAR ITEM PERPUSTAKAAN =====")
        if not self._items:
            print("Tidak ada item di perpustakaan.")
            return
        for item in self._items:
            item.show_info()
        print("======================================\n")

    def search_item(self, keyword):
        """Mencari item berdasarkan ID atau Judul"""
        print(f"\nHasil pencarian untuk: '{keyword}'")
        found = False
        for item in self._items:
            if keyword.lower() in item.title.lower() or keyword == item.item_id:
                item.show_info()
                found = True
        
        if not found:
            print("Item tidak ditemukan.\n")

# MENU PROGRAM
def main():
    library = Library()

    while True:
        print("""
============ MENU PERPUSTAKAAN ============

1. Tambah Buku
2. Tambah Majalah
3. Tampilkan Semua Item
4. Cari Item
5. Keluar
""")

        pilihan = input("Pilih menu (1-5): ")

        if pilihan == "1":
            print("\n=== Tambah Buku ===")
            item_id = input("ID Buku: ")
            title = input("Judul: ")
            author = input("Penulis: ")
            year = input("Tahun: ")
            book = Book(item_id, title, author, year)
            library.add_item(book)

        elif pilihan == "2":
            print("\n=== Tambah Majalah ===")
            item_id = input("ID Majalah: ")
            title = input("Judul: ")
            issue = input("Issue Number: ")
            mag = Magazine(item_id, title, issue)
            library.add_item(mag)

        elif pilihan == "3":
            library.show_all_items()

        elif pilihan == "4":
            search = input("Masukkan ID atau Judul: ")
            library.search_item(search)

        elif pilihan == "5":
            print("Terima kasih telah menggunakan sistem ini!")
            break

        else:
            print("Pilihan tidak valid!\n")

# JALANKAN PROGRAM
if __name__ == "__main__":
    main()
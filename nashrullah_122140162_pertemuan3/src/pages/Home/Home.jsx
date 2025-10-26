import { useMemo, useState } from "react";
import { BookForm } from "../../components/BookForm/BookForm.jsx";
import { BookFilter } from "../../components/BookFilter/BookFilter.jsx";
import { BookList } from "../../components/BookList/BookList.jsx";
import { useBooks } from "../../context/BookContext.jsx";

export function Home() {
  const {
    books,
    addBook,
    updateBook,
    removeBook,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    resetFilters,
  } = useBooks();
  const [editingBook, setEditingBook] = useState(null);

  // Gunakan memo untuk menghindari filter ulang saat state lain tidak berubah.
  const filteredBooks = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    return books.filter((book) => {
      const matchStatus =
        statusFilter === "all" ? true : book.status === statusFilter;
      const combined = `${book.title} ${book.author}`.toLowerCase();
      const matchQuery =
        normalizedQuery.length === 0 || combined.includes(normalizedQuery);
      return matchStatus && matchQuery;
    });
  }, [books, searchTerm, statusFilter]);

  const handleSubmit = (formData) => {
    if (editingBook) {
      updateBook(editingBook.id, formData);
    } else {
      addBook(formData);
    }
    setEditingBook(null);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  return (
    <section className="page">
      <div className="panel">
        <div className="panel__header">
          <h2>{editingBook ? "Perbarui Buku" : "Tambah Buku Baru"}</h2>
        </div>
        <BookForm
          initialValues={editingBook}
          isEditing={Boolean(editingBook)}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2>Daftar Buku</h2>
          <BookFilter
            status={statusFilter}
            onStatusChange={setStatusFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onReset={() => {
              setEditingBook(null);
              resetFilters();
            }}
          />
        </div>
        <BookList
          books={filteredBooks}
          onEdit={handleEdit}
          onDelete={removeBook}
        />
      </div>
    </section>
  );
}

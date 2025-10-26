import PropTypes from "prop-types";
import { BookCard } from "../BookCard/BookCard.jsx";
import { EmptyState } from "../EmptyState/EmptyState.jsx";
import "./BookList.css";

export function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return (
      <EmptyState
        title="Belum ada buku sesuai filter"
        description="Tambah buku baru atau ubah filter pencarian."
      />
    );
  }

  return (
    <div className="book-list" data-testid="book-list">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

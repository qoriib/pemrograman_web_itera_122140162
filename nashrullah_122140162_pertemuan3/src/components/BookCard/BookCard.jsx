import PropTypes from "prop-types";
import "./BookCard.css";

const STATUS_BADGE = {
  owned: { label: "Dimiliki", tone: "badge--owned" },
  reading: { label: "Sedang Dibaca", tone: "badge--reading" },
  wishlist: { label: "Ingin Dibeli", tone: "badge--wishlist" },
};

export function BookCard({ book, onEdit, onDelete }) {
  const badge = STATUS_BADGE[book.status];

  return (
    <article className="book-card" data-testid="book-card">
      <header className="book-card__header">
        <div>
          <h3>{book.title}</h3>
          <p className="book-card__author">oleh {book.author}</p>
        </div>
        <span className={`badge ${badge?.tone ?? ""}`}>{badge?.label}</span>
      </header>
      <footer className="book-card__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => onEdit(book)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--danger"
          onClick={() => onDelete(book.id)}
        >
          Hapus
        </button>
      </footer>
    </article>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

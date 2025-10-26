import PropTypes from "prop-types";
import { BOOK_STATUS_OPTIONS } from "../../context/BookContext.jsx";
import { SearchBar } from "../SearchBar/SearchBar.jsx";
import "./BookFilter.css";

export function BookFilter({
  status,
  onStatusChange,
  searchTerm,
  onSearchChange,
  onReset,
}) {
  return (
    <div className="book-filter">
      <label className="book-filter__field">
        <span>Status</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="all">Semua status</option>
          {BOOK_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <SearchBar value={searchTerm} onChange={onSearchChange} />
      <button type="button" className="btn btn--ghost" onClick={onReset}>
        Reset Filter
      </button>
    </div>
  );
}

BookFilter.propTypes = {
  status: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

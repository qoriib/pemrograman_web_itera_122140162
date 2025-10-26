import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BOOK_STATUS_OPTIONS } from "../../context/BookContext.jsx";
import "./BookForm.css";

const EMPTY_FORM = {
  title: "",
  author: "",
  status: "owned",
};

export function BookForm({ initialValues, onSubmit, onCancel, isEditing }) {
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormState({
        title: initialValues.title ?? "",
        author: initialValues.author ?? "",
        status: initialValues.status ?? "owned",
      });
    } else {
      setFormState(EMPTY_FORM);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formState.title.trim()) {
      newErrors.title = "Judul wajib diisi.";
    }
    if (!formState.author.trim()) {
      newErrors.author = "Nama penulis wajib diisi.";
    }
    if (!formState.status) {
      newErrors.status = "Pilih status buku.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    onSubmit(formState);
    setFormState(EMPTY_FORM);
    setErrors({});
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="book-form__grid">
        <label className="book-form__field">
          <span>Judul *</span>
          <input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            placeholder="Contoh: Atomic Habits"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title ? (
            <span className="book-form__error">{errors.title}</span>
          ) : null}
        </label>

        <label className="book-form__field">
          <span>Penulis *</span>
          <input
            type="text"
            name="author"
            value={formState.author}
            onChange={handleChange}
            placeholder="Contoh: James Clear"
            aria-invalid={Boolean(errors.author)}
          />
          {errors.author ? (
            <span className="book-form__error">{errors.author}</span>
          ) : null}
        </label>

        <label className="book-form__field">
          <span>Status *</span>
          <select
            name="status"
            value={formState.status}
            onChange={handleChange}
            aria-invalid={Boolean(errors.status)}
          >
            {BOOK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status ? (
            <span className="book-form__error">{errors.status}</span>
          ) : null}
        </label>
      </div>

      <div className="book-form__actions">
        <button type="submit" className="btn btn--primary">
          {isEditing ? "Perbarui Buku" : "Tambahkan Buku"}
        </button>
        {isEditing ? (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Batalkan
          </button>
        ) : null}
      </div>
    </form>
  );
}

BookForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  isEditing: PropTypes.bool,
};

BookForm.defaultProps = {
  initialValues: null,
  onCancel: () => {},
  isEditing: false,
};

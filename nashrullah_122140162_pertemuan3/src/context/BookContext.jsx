import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useLocalStorage } from "../hooks/useLocalStorage";

const BookContext = createContext(undefined);

export const BOOK_STATUS_OPTIONS = [
  { value: "owned", label: "Dimiliki" },
  { value: "reading", label: "Sedang Dibaca" },
  { value: "wishlist", label: "Ingin Dibeli" },
];

const generateId = () =>
  window.crypto?.randomUUID
    ? crypto.randomUUID()
    : `book-${Math.random().toString(36).slice(2, 9)}`;

export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage("personal_books", []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const addBook = (book) => {
    setBooks((prev) => [...prev, { ...book, id: generateId() }]);
  };

  const updateBook = (id, updates) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === id ? { ...book, ...updates } : book))
    );
  };

  const removeBook = (id) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const value = useMemo(
    () => ({
      books,
      addBook,
      updateBook,
      removeBook,
      searchTerm,
      setSearchTerm,
      statusFilter,
      setStatusFilter,
      resetFilters,
    }),
    [books, searchTerm, statusFilter]
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks harus dipanggil di dalam BookProvider");
  }
  return context;
}

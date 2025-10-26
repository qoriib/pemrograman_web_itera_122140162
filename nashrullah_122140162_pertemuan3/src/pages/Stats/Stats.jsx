import { StatsSummary } from "../../components/StatsSummary/StatsSummary.jsx";
import { EmptyState } from "../../components/EmptyState/EmptyState.jsx";
import { useBookStats } from "../../hooks/useBookStats.js";
import { useBooks } from "../../context/BookContext.jsx";

export function Stats() {
  const stats = useBookStats();
  const { books } = useBooks();

  const readingList = books.filter((book) => book.status === "reading");
  const wishlist = books.filter((book) => book.status === "wishlist");

  return (
    <section className="page">
      <div className="panel">
        <div className="panel__header">
          <h2>Ringkasan Koleksi Buku</h2>
        </div>
        <StatsSummary stats={stats} />
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2>Daftar Bacaan Aktif</h2>
          <span className="muted">
            Buku yang sedang Anda baca untuk dituntaskan.
          </span>
        </div>
        {readingList.length === 0 ? (
          <EmptyState
            title="Belum ada bacaan aktif"
            description="Pilih salah satu buku untuk mulai dibaca."
          />
        ) : (
          <ul className="grid">
            {readingList.map((book) => (
              <li key={book.id}>{`${book.title} — ${book.author}`}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2>Wishlist Buku</h2>
          <span className="muted">
            Koleksi ide bacaan berikutnya agar tidak terlupa.
          </span>
        </div>
        {wishlist.length === 0 ? (
          <EmptyState
            title="Wishlist masih kosong"
            description="Tambahkan buku yang ingin dibeli dari halaman beranda."
          />
        ) : (
          <ul className="grid">
            {wishlist.map((book) => (
              <li key={book.id}>{`${book.title} — ${book.author}`}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

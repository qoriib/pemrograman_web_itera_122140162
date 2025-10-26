import PropTypes from "prop-types";

const STAT_LABELS = [
  { key: "total", label: "Total Buku" },
  { key: "owned", label: "Dimiliki" },
  { key: "reading", label: "Sedang Dibaca" },
  { key: "wishlist", label: "Wishlist" },
];

export function StatsSummary({ stats }) {
  return (
    <div className="stat-grid">
      {STAT_LABELS.map((item) => (
        <div key={item.key} className="stat-card">
          <span className="stat-card__label">{item.label}</span>
          <span className="stat-card__value">{stats[item.key]}</span>
        </div>
      ))}
      <div className="stat-card">
        <span className="stat-card__label">Penulis Terbanyak</span>
        <span className="stat-card__value">{stats.mostCollectedAuthor}</span>
      </div>
    </div>
  );
}

StatsSummary.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    owned: PropTypes.number.isRequired,
    reading: PropTypes.number.isRequired,
    wishlist: PropTypes.number.isRequired,
    mostCollectedAuthor: PropTypes.string.isRequired,
  }).isRequired,
};

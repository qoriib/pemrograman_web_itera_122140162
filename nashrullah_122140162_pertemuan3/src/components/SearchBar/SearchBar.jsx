import PropTypes from "prop-types";
import "./SearchBar.css";

export function SearchBar({ value, onChange, placeholder }) {
  return (
    <label className="search-bar">
      <span className="search-bar__label">Pencarian</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

SearchBar.defaultProps = {
  placeholder: "Cari berdasarkan judul atau penulis",
};

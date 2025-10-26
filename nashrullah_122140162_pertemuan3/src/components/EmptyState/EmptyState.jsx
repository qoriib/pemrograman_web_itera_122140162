import PropTypes from "prop-types";
import "./EmptyState.css";

export function EmptyState({ title, description }) {
  return (
    <div className="empty-state" role="status">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

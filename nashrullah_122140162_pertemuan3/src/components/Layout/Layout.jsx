import { NavLink, Outlet } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Beranda" },
  { to: "/stats", label: "Statistik" },
];

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-shell__brand">
        <div>
          <h1>Manajemen Buku Pribadi</h1>
          <p className="muted">
            Catat buku yang dimiliki, sedang dibaca, atau masuk wishlist Anda.
          </p>
        </div>
        <nav className="app-shell__nav">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link--active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

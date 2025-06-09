import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Kino
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Filmy
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user">
                    Moje rezerwacje
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Logowanie
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Rejestracja
                  </Link>
                </li>
              </>
            )}
            {token && role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/panel">
                    Statystyki (admin)
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/movies">
                    Filmy (admin)
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/halls">
                    Sale (admin)
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/shows">
                    Seanse (admin)
                  </Link>
                </li>
              </>
            )}
            {token && (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={handleLogout}
                >
                  Wyloguj
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

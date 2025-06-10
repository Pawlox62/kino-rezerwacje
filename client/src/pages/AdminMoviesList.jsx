import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function AdminMoviesList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    api
      .get("/movies")
      .then(({ data }) => setMovies(data))
      .catch(() => setMovies([]));
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/movies/${id}`);
    setMovies(movies.filter((m) => m._id !== id));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Lista filmów</h2>
      </div>
      <Link to="/admin/movies/new" className="btn btn-primary mb-3">
        Dodaj film
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>Tytuł</th>
            <th>Opis</th>
            <th>Czas trwania</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id}>
              <td>{movie.title}</td>
              <td>{movie.description}</td>
              <td>{movie.duration} min</td>
              <td>
                <Link
                  to={`/admin/movies/edit/${movie._id}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Edytuj
                </Link>
                <button
                  onClick={() => handleDelete(movie._id)}
                  className="btn btn-sm btn-danger"
                >
                  Usuń
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

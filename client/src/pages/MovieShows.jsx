import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function MovieShows() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/movies/${movieId}`)
      .then(({ data }) => setMovie(data))
      .catch(() => navigate("/"));
    api
      .get(`/shows/movie/${movieId}`)
      .then(({ data }) => setShows(data))
      .catch(() => setShows([]));
  }, [movieId, navigate]);

  const handleBook = (showId) => {
    navigate(`/booking/${showId}`);
  };

  if (!movie) return null;

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-4">
          <img
            src={movie.imageUrl || "/placeholder.png"}
            alt={movie.title}
            className="img-fluid"
          />
        </div>
        <div className="col-md-8">
          <h2>{movie.title}</h2>
          <p>
            <strong>Czas trwania:</strong> {movie.duration} min
          </p>
          <p>{movie.description}</p>
        </div>
      </div>
      <h3>Seanse</h3>
      {shows.length === 0 && <p>Brak dostępnych seansów.</p>}
      {shows.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Godzina</th>
              <th>Format</th>
              <th>Sala</th>
              <th>Język</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => (
              <tr key={show._id}>
                <td>{new Date(show.date).toLocaleDateString("pl-PL")}</td>
                <td>
                  {new Date(show.date).toLocaleTimeString("pl-PL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>{show.format.toUpperCase()}</td>
                <td>{show.hall.number}</td>
                <td>{show.language === "napisy" ? "Napisy" : "Dubbing"}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleBook(show._id)}
                  >
                    Rezerwuj
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

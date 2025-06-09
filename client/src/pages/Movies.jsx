import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    api
      .get("/movies")
      .then((r) => setMovies(r.data))
      .catch(() => setMovies([]));
  }, []);

  return (
    <div>
      <h3>Repertuar</h3>
      <div className="row">
        {movies.map((m) => (
          <div key={m._id} className="col-md-4 mb-3">
            <div className="card h-100">
              <img
                src={m.imageUrl || "/placeholder.png"}
                className="card-img-top"
                alt={m.title}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{m.title}</h5>
                <Link
                  to={`/movie/${m._id}/shows`}
                  className="btn btn-primary mt-auto"
                >
                  Sprawdź
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

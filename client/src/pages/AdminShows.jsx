import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function AdminShows() {
  const { showId } = useParams();
  const isEdit = Boolean(showId);
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [movieId, setMovieId] = useState("");
  const [hallId, setHallId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [format, setFormat] = useState("2d");
  const [language, setLanguage] = useState("napisy");
  const [occurred, setOccurred] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/movies").then((r) => setMovies(r.data));
    api.get("/halls/rooms").then((r) => setHalls(r.data));
    if (isEdit) {
      api
        .get(`/shows/${showId}`)
        .then(({ data }) => {
          setMovieId(data.movie._id);
          setHallId(data.hall._id);
          const dt = new Date(data.date);
          setDate(dt.toISOString().slice(0, 10));
          setTime(dt.toISOString().slice(11, 16));
          setBasePrice(data.basePrice.toString());
          setFormat(data.format);
          setLanguage(data.language);
          setOccurred(Boolean(data.occurred));
        })
        .catch(() => navigate("/admin/shows"));
    }
  }, [isEdit, showId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const datetime = new Date(`${date}T${time}`);
    const payload = {
      movie: movieId,
      hall: hallId,
      date: datetime.toISOString(),
      basePrice: basePrice ? parseFloat(basePrice) : undefined,
      format,
      language,
      occurred,
    };
    try {
      if (isEdit) {
        await api.put(`/shows/${showId}`, payload);
        setMsg("Seans zaktualizowany");
      } else {
        await api.post("/shows", payload);
        setMsg("Seans dodany pomyślnie");
      }
      setTimeout(() => navigate("/admin/shows"), 1000);
    } catch (err) {
      setMsg("Błąd: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>{isEdit ? "Edytuj seans" : "Dodaj seans"}</h2>
      </div>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Film</label>
          <select
            required
            className="form-select"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
          >
            <option value="">-- wybierz --</option>
            {movies.map((m) => (
              <option key={m._id} value={m._id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Sala</label>
          <select
            required
            className="form-select"
            value={hallId}
            onChange={(e) => setHallId(e.target.value)}
          >
            <option value="">-- wybierz --</option>
            {halls.map((h) => (
              <option key={h._id} value={h._id}>
                Sala {h.number}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Data</label>
          <input
            required
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Godzina</label>
          <input
            required
            type="time"
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cena bazowa (PLN)</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="domyślnie 28.90"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Format</label>
          <select
            className="form-select"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="2d">2D</option>
            <option value="3d">3D</option>
            <option value="4dx">4DX</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Język</label>
          <select
            className="form-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="napisy">napisy</option>
            <option value="dubbing">dubbing</option>
          </select>
        </div>
        {isEdit && (
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="occurred"
              checked={occurred}
              onChange={(e) => setOccurred(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="occurred">
              Seans odbył się
            </label>
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          {isEdit ? "Zapisz zmiany" : "Utwórz seans"}
        </button>
      </form>
    </div>
  );
}

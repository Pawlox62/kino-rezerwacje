import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function AdminMovies() {
  const { movieId } = useParams();
  const isEdit = Boolean(movieId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      api
        .get(`/movies/${movieId}`)
        .then(({ data }) => {
          setTitle(data.title);
          setDescription(data.description);
          setDuration(data.duration);
          setImageUrl(data.imageUrl || "");
        })
        .catch(() => navigate("/admin/movies"));
    }
  }, [isEdit, movieId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const payload = {
        title,
        description,
        duration: parseInt(duration),
        imageUrl: imageUrl.trim() || undefined,
      };
      if (isEdit) {
        await api.put(`/movies/${movieId}`, payload);
        setMsg("Film zaktualizowany");
      } else {
        await api.post("/movies", payload);
        setMsg("Film dodany");
      }
      setTimeout(() => navigate("/admin/movies"), 1000);
    } catch (err) {
      setMsg("Błąd: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>{isEdit ? "Edytuj film" : "Dodaj film"}</h2>
      </div>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tytuł</label>
          <input
            required
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Opis</label>
          <textarea
            required
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Czas trwania (min)</label>
          <input
            required
            type="number"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">URL obrazka</label>
          <input
            type="url"
            className="form-control"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {isEdit ? "Zapisz" : "Utwórz"}
        </button>
      </form>
    </div>
  );
}

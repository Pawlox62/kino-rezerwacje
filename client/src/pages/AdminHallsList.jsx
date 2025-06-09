import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function AdminHallsList() {
  const [halls, setHalls] = useState([]);

  useEffect(() => {
    api
      .get("/halls/rooms")
      .then(({ data }) => setHalls(data))
      .catch(() => setHalls([]));
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/halls/${id}`);
    setHalls(halls.filter((h) => h._id !== id));
  };

  return (
    <div className="container mt-4">
      <h2>Lista sal</h2>
      <Link to="/admin/halls/new" className="btn btn-primary mb-3">
        Dodaj salę
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>Numer sali</th>
            <th>Rzędy × miejsca</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {halls.map((hall) => (
            <tr key={hall._id}>
              <td>{hall.number}</td>
              <td>
                {hall.layout.length} ×{" "}
                {Math.max(...hall.layout.map((r) => r.seats.length))}
              </td>
              <td>
                <Link
                  to={`/admin/halls/edit/${hall._id}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Edytuj
                </Link>
                <button
                  onClick={() => handleDelete(hall._id)}
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

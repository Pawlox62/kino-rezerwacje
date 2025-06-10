import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function UserPanel() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api
      .get("/bookings/user")
      .then(({ data }) => setBookings(data))
      .catch(() => setBookings([]));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Moje rezerwacje</h2>
      {bookings.length === 0 && <p>Brak rezerwacji.</p>}
      {bookings.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Film</th>
              <th>Sala</th>
              <th>Data i godzina</th>
              <th>Miejsca</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const movieTitle = b.show?.movie?.title || "(usunięty)";
              const hallNumber = b.show?.hall?.number || "-";
              return (
                <tr key={b._id}>
                  <td>{movieTitle}</td>
                  <td>{hallNumber}</td>
                  <td>
                    {new Date(b.show.date).toLocaleDateString("pl-PL")}{" "}
                    {new Date(b.show.date).toLocaleTimeString("pl-PL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    {b.seats
                      .map((s) => `${String.fromCharCode(64 + s.row)}${s.number}`)
                      .join(", ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

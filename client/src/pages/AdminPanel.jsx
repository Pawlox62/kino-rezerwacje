import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminPanel() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api
      .get("/admin/stats/occupancy")
      .then(({ data }) => setStats(data))
      .catch(() => setStats([]));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Statystyki sprzedaży</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Film</th>
            <th>Data</th>
            <th>Zajęte/Łącznie</th>
            <th>Przychód (PLN)</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s) => (
            <tr key={s.showId}>
              <td>{s.title}</td>
              <td>
                {new Date(s.date).toLocaleString("pl-PL", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </td>
              <td>
                {s.bookedCount}/{s.totalSeats}
              </td>
              <td>{s.revenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

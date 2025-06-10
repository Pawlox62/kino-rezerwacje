import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { io } from "socket.io-client";
import api from "../api/axios";
import SeatMap from "../components/SeatMap";

export default function Booking() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [layout, setLayout] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    api
      .get(`/shows/${showId}`)
      .then(({ data }) => {
        setShow(data);
        setLayout(data.hall.layout);
        setBookedSeats(data.bookedSeats || []);
      })
      .catch(() => navigate("/"));
  }, [showId, navigate]);

  useEffect(() => {
    const socket = io("http://localhost:4000");
    socketRef.current = socket;
    socket.emit("joinShow", showId);

    socket.on("seatLocked", (sid) => {
      setLockedSeats((ls) => Array.from(new Set([...ls, sid])));
    });
    socket.on("seatUnlocked", (sid) => {
      setLockedSeats((ls) => ls.filter((x) => x !== sid));
    });
    socket.on("seatBooked", (sid) => {
      setBookedSeats((bs) => Array.from(new Set([...bs, sid])));
      setLockedSeats((ls) => ls.filter((x) => x !== sid));
    });

    return () => {
      socket.emit("leaveShow", showId);
      socket.disconnect();
    };
  }, [showId]);

  if (!show) return null;

  const base = show.basePrice ?? 28.9;
  const prices = {
    promo: parseFloat((base - 9).toFixed(2)),
    standard: parseFloat(base.toFixed(2)),
    vip: parseFloat((base + 6).toFixed(2)),
  };

  const handleSelect = ({ row, number }) => {
    const key = `${row}-${number}`;
    setSelected((sel) =>
      sel.includes(key) ? sel.filter((x) => x !== key) : [...sel, key]
    );
    if (socketRef.current) {
      socketRef.current.emit(
        selected.includes(key) ? "unlockSeat" : "lockSeat",
        { showId, sid: key }
      );
    }
  };

  const summary = selected.reduce((acc, sid) => {
    const [r] = sid.split("-").map(Number);
    const type = layout.find((rw) => rw.row === r).type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const total = Object.entries(summary)
    .reduce((sum, [type, cnt]) => sum + cnt * prices[type], 0)
    .toFixed(2);

  const handleBook = async () => {
    if (!selected.length) return;
    const seats = selected.map((s) => {
      const [r, n] = s.split("-").map(Number);
      return { row: r, number: n };
    });
    try {
      await api.post("/bookings", { showId, seats });
      navigate("/user");
    } catch (err) {
      alert(err.response?.data?.msg || "Błąd rezerwacji");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Rezerwacja: {show.movie.title}</h2>
        <BackButton label="Anuluj" />
      </div>
      <p>
        {new Date(show.date).toLocaleDateString("pl-PL")}{" "}
        {new Date(show.date).toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <SeatMap
        layout={layout}
        bookedSeats={bookedSeats}
        lockedSeats={lockedSeats}
        selected={selected}
        onSelect={handleSelect}
        hideInactive={true}
      />

      <div className="mt-4">
        <h5>Podsumowanie:</h5>
        {!selected.length && <p>Brak zaznaczonych miejsc.</p>}
        {Object.entries(summary).map(([type, cnt]) => (
          <p key={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}: {cnt} ×{" "}
            {prices[type].toFixed(2)} zł = {(cnt * prices[type]).toFixed(2)} zł
          </p>
        ))}
        {selected.length > 0 && (
          <p>
            <strong>Łącznie: {total} zł</strong>
          </p>
        )}
        <button
          disabled={!selected.length}
          className="btn btn-success"
          onClick={handleBook}
        >
          Zarezerwuj ({selected.length})
        </button>
      </div>
    </div>
  );
}

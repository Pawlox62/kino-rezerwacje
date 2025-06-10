import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { showId, seats } = req.body;
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ msg: "Seans nie istnieje" });
    const now = new Date();
    if (show.occurred || new Date(show.date) < now)
      return res.status(400).json({ msg: "Seans już się odbył" });
    const existing = await Booking.find({ show: showId });
    const taken = new Set(
      existing.flatMap((b) => b.seats.map((s) => `${s.row}-${s.number}`))
    );
    for (const s of seats) {
      const key = `${s.row}-${s.number}`;
      if (taken.has(key)) {
        return res
          .status(400)
          .json({ msg: `Miejsce ${key} już zarezerwowane` });
      }
    }
    const booking = await Booking.create({ user: userId, show: showId, seats });
    const io = req.app.get("io");
    seats.forEach((s) => {
      const sid = `${s.row}-${s.number}`;
      io.to(showId).emit("seatBooked", sid);
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: "Błąd serwera przy rezerwacji" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const all = await Booking.find({ user: userId }).populate({
      path: "show",
      populate: ["movie", "hall"],
    });
    const now = new Date();
    const active = all.filter(
      (b) =>
        b.show &&
        b.show.movie &&
        b.show.hall &&
        new Date(b.show.date) > now &&
        !b.show.occurred
    );
    res.json(active);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

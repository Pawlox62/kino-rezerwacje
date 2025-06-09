import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

export const getOccupancyStats = async (req, res) => {
  try {
    const shows = await Show.find().populate("movie").populate("hall");
    const stats = await Promise.all(
      shows.map(async (show) => {
        const layout = show.hall.layout;
        const totalSeats = layout.reduce(
          (sum, row) => sum + row.seats.filter((s) => s.active).length,
          0
        );
        const bookings = await Booking.find({ show: show._id });
        let bookedCount = 0;
        let revenue = 0;
        const base = show.basePrice;
        bookings.forEach((b) => {
          b.seats.forEach(({ row }) => {
            const rowDef = layout.find((r) => r.row === row);
            const type = rowDef.type;
            let price = base;
            if (type === "promo") price = base - 9;
            else if (type === "vip") price = base + 6;
            revenue += price;
            bookedCount++;
          });
        });
        return {
          showId: show._id,
          title: show.movie.title,
          date: show.date,
          totalSeats,
          bookedCount,
          revenue: +revenue.toFixed(2),
        };
      })
    );
    res.json(stats);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

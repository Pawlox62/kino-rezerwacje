import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movie.js";
import hallRoomRoutes from "./routes/hallRooms.js";
import showRoutes from "./routes/shows.js";
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";
import cleanupExpiredBookings from "./utils/cleanup.js";

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/halls", hallRoomRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

const httpServer = createServer(app);
const io = new IOServer(httpServer, { cors: { origin: "*" } });
// locks structure: { [showId]: { [seatId]: socketId } }
const locks = {};

function releaseSeats(socket, showId) {
  const map = locks[showId];
  if (!map) return;
  for (const [sid, owner] of Object.entries(map)) {
    if (owner === socket.id) {
      delete map[sid];
      socket.to(showId).emit("seatUnlocked", sid);
    }
  }
  if (Object.keys(map).length === 0) delete locks[showId];
}

io.on("connection", (socket) => {
  socket.on("joinShow", (showId) => {
    socket.join(showId);
    const map = locks[showId] || {};
    socket.emit("seatLockedInit", Object.keys(map));
    socket.showId = showId;
  });

  socket.on("leaveShow", (showId) => {
    releaseSeats(socket, showId);
    socket.leave(showId);
    if (socket.showId === showId) socket.showId = null;
  });

  socket.on("lockSeat", ({ showId, sid }) => {
    locks[showId] = locks[showId] || {};
    locks[showId][sid] = socket.id;
    socket.to(showId).emit("seatLocked", sid); // emit to others only
  });

  socket.on("unlockSeat", ({ showId, sid }) => {
    if (locks[showId] && locks[showId][sid] === socket.id) {
      delete locks[showId][sid];
      socket.to(showId).emit("seatUnlocked", sid); // emit to others only
    }
  });

  socket.on("disconnect", () => {
    if (socket.showId) {
      releaseSeats(socket, socket.showId);
    }
  });
});

app.set("io", io);
mongoose.connect(process.env.MONGO_URI).then(() => {
  cleanupExpiredBookings();
  setInterval(cleanupExpiredBookings, 60 * 60 * 1000);
  httpServer.listen(process.env.PORT || 4000);
});

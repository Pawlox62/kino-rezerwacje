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
const locks = {};

io.on("connection", (socket) => {
  socket.on("joinShow", (showId) => {
    socket.join(showId);
    const set = locks[showId] || new Set();
    socket.emit("seatLockedInit", Array.from(set));
    socket.showId = showId;
  });

  socket.on("leaveShow", (showId) => {
    socket.leave(showId);
  });

  socket.on("lockSeat", ({ showId, sid }) => {
    locks[showId] = locks[showId] || new Set();
    locks[showId].add(sid);
    socket.to(showId).emit("seatLocked", sid); // emit to others only
  });

  socket.on("unlockSeat", ({ showId, sid }) => {
    if (locks[showId]) {
      locks[showId].delete(sid);
      socket.to(showId).emit("seatUnlocked", sid); // emit to others only
    }
  });
});

app.set("io", io);
mongoose.connect(process.env.MONGO_URI).then(() => {
  httpServer.listen(process.env.PORT || 4000);
});

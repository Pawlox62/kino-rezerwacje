import { Router } from "express";
import { verifyToken } from "../utils/auth.js";
import {
  createBooking,
  getUserBookings,
} from "../controllers/bookingController.js";

const router = Router();

router.post("/", verifyToken, createBooking);
router.get("/user", verifyToken, getUserBookings);

export default router;

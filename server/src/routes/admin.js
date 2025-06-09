import { Router } from "express";
import { verifyToken, verifyAdmin } from "../utils/auth.js";
import { getOccupancyStats } from "../controllers/adminController.js";

const router = Router();
router.get("/stats/occupancy", verifyToken, verifyAdmin, getOccupancyStats);
export default router;

import { Router } from "express";
import { verifyToken, verifyAdmin } from "../utils/auth.js";
import {
  getAllHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
} from "../controllers/hallRoomController.js";

const router = Router();

router.get("/rooms", getAllHalls);
router.get("/:id", getHallById);
router.post("/", verifyToken, verifyAdmin, createHall);
router.put("/:id", verifyToken, verifyAdmin, updateHall);
router.delete("/:id", verifyToken, verifyAdmin, deleteHall);

export default router;

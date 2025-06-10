import { Router } from "express";
import { verifyToken, verifyAdmin } from "../utils/auth.js";
import {
  getAllShows,
  getShowById,
  getShowsByMovie,
  createShow,
  updateShow,
  deleteShow,
} from "../controllers/showController.js";

const router = Router();

router.get("/", getAllShows);
router.get("/movie/:movieId", getShowsByMovie);
router.get("/:id", getShowById);
router.post("/", verifyToken, verifyAdmin, createShow);
router.put("/:id", verifyToken, verifyAdmin, updateShow);
router.delete("/:id", verifyToken, verifyAdmin, deleteShow);

export default router;

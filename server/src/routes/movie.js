import { Router } from "express";
import { verifyToken, verifyAdmin } from "../utils/auth.js";
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

const router = Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.post("/", verifyToken, verifyAdmin, createMovie);
router.put("/:id", verifyToken, verifyAdmin, updateMovie);
router.delete("/:id", verifyToken, verifyAdmin, deleteMovie);

export default router;

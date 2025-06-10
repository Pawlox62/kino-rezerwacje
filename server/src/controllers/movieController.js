import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: "Nie znaleziono filmu" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const createMovie = async (req, res) => {
  try {
    const { title, description, duration, imageUrl } = req.body;
    const movie = await Movie.create({
      title,
      description,
      duration,
      imageUrl,
    });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { title, description, duration, imageUrl } = req.body;
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, description, duration, imageUrl },
      { new: true }
    );
    if (!movie) return res.status(404).json({ msg: "Nie znaleziono filmu" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: "Nie znaleziono filmu" });

    const shows = await Show.find({ movie: movie._id });
    await Booking.deleteMany({ show: { $in: shows.map((s) => s._id) } });
    await Show.deleteMany({ movie: movie._id });

    await movie.deleteOne();

    res.json({ msg: "Usunięto film" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

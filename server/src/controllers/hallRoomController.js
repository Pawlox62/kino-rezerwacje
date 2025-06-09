import HallRoom from "../models/HallRoom.js";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

export const getAllHalls = async (req, res) => {
  try {
    const halls = await HallRoom.find();
    res.json(halls);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getHallById = async (req, res) => {
  try {
    const hall = await HallRoom.findById(req.params.id);
    if (!hall) return res.status(404).json({ msg: "Nie znaleziono sali" });
    res.json(hall);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const createHall = async (req, res) => {
  try {
    const { number, layout } = req.body;
    const hall = await HallRoom.create({ number, layout });
    res.json(hall);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateHall = async (req, res) => {
  try {
    const { number, layout } = req.body;
    const hall = await HallRoom.findByIdAndUpdate(
      req.params.id,
      { number, layout },
      { new: true }
    );
    if (!hall) return res.status(404).json({ msg: "Nie znaleziono sali" });
    res.json(hall);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteHall = async (req, res) => {
  try {
    const hall = await HallRoom.findByIdAndDelete(req.params.id);
    if (!hall) return res.status(404).json({ msg: "Nie znaleziono sali" });
    // usuń powiązane seansy i rezerwacje
    const shows = await Show.find({ hall: hall._id });
    await Booking.deleteMany({ show: { $in: shows.map((s) => s._id) } });
    await Show.deleteMany({ hall: hall._id });
    res.json({ msg: "Usunięto salę" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

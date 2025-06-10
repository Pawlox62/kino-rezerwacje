import Show from '../models/Show.js'
import Booking from '../models/Booking.js'

export const getAllShows = async (req, res) => {
  try {
    const now = new Date()
    const shows = await Show.find({ finished: { $ne: true }, date: { $gt: now } })
      .populate('movie')
      .populate('hall')
    res.json(shows)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie').populate('hall')
    if (!show || show.finished || new Date(show.date) <= new Date())
      return res.status(404).json({ msg: 'Nie znaleziono seansu' })
    const bookings = await Booking.find({ show: show._id })
    const bookedSeats = bookings.flatMap(b => b.seats).map(s => `${s.row}-${s.number}`)
    res.json({ ...show.toObject(), bookedSeats })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const getShowsByMovie = async (req, res) => {
  try {
    const now = new Date()
    const shows = await Show.find({
      movie: req.params.movieId,
      date: { $gte: now },
      occurred: false,
    })
      .populate('movie')
      .populate('hall')
    res.json(shows)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const createShow = async (req, res) => {
  try {
    const { movie, hall, date, basePrice, format, language, occurred } = req.body
    const price = basePrice !== undefined ? basePrice : 28.9
    const show = await Show.create({ movie, hall, date, basePrice: price, format, language, occurred })
    const populated = await Show.findById(show._id).populate('movie').populate('hall')
    res.json(populated)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const updateShow = async (req, res) => {
  try {
    const { movie, hall, date, basePrice, format, language, occurred } = req.body
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      { movie, hall, date, basePrice, format, language, occurred },
      { new: true }
    )
    if (!show) return res.status(404).json({ msg: 'Nie znaleziono seansu' })
    const populated = await Show.findById(show._id).populate('movie').populate('hall')
    res.json(populated)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id)
    if (!show) return res.status(404).json({ msg: 'Nie znaleziono seansu' })
    await Booking.deleteMany({ show: show._id })
    res.json({ msg: 'Usunięto seans' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

import Show from '../models/Show.js'
import Booking from '../models/Booking.js'

export default async function cleanupExpiredBookings() {
  try {
    const now = new Date()
    const shows = await Show.find({ date: { $lt: now } }, '_id')
    if (shows.length > 0) {
      await Booking.deleteMany({ show: { $in: shows.map(s => s._id) } })
    }
  } catch (err) {
    console.error('Failed to cleanup bookings', err)
  }
}

import Show from '../models/Show.js'
import Booking from '../models/Booking.js'

export default async function cleanupExpiredBookings() {
  try {
    const now = new Date()
    const shows = await Show.find({ date: { $lt: now }, finished: { $ne: true } })
    if (shows.length > 0) {
      const ids = shows.map(s => s._id)
      await Booking.deleteMany({ show: { $in: ids } })
      await Show.updateMany({ _id: { $in: ids } }, { $set: { finished: true } })
    }
  } catch (err) {
    console.error('Failed to cleanup bookings', err)
  }
}

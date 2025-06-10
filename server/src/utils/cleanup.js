import Show from '../models/Show.js'
import Booking from '../models/Booking.js'

export default async function cleanupExpiredBookings() {
  try {
    const now = new Date()
    const shows = await Show.find({
      $or: [{ finished: false }, { occurred: false }],
    }).populate('movie')

    const finishedIds = new Set()
    const occurredIds = new Set()

    for (const show of shows) {
      const start = new Date(show.date)
      if (start < now && !show.finished) finishedIds.add(show._id)
      const end = start.getTime() + show.movie.duration * 60000
      if (end < now && !show.occurred) occurredIds.add(show._id)
    }

    const finArr = Array.from(finishedIds)
    if (finArr.length) {
      await Booking.deleteMany({ show: { $in: finArr } })
      await Show.updateMany({ _id: { $in: finArr } }, { $set: { finished: true } })
    }

    const occArr = Array.from(occurredIds)
    if (occArr.length) {
      await Show.updateMany({ _id: { $in: occArr } }, { $set: { occurred: true } })
    }
  } catch (err) {
    console.error('Failed to cleanup bookings', err)
  }
}

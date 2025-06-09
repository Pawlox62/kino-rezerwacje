import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    seats: [
      {
        row: { type: Number, required: true },
        number: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Booking", bookingSchema);

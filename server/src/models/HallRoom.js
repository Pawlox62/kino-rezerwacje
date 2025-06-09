import mongoose from "mongoose";
const seatSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { _id: false }
);
const rowSchema = new mongoose.Schema(
  {
    row: { type: Number, required: true },
    type: {
      type: String,
      enum: ["promo", "standard", "vip"],
      default: "standard",
    },
    seats: [seatSchema],
  },
  { _id: false }
);
const hallRoomSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true },
    layout: [rowSchema],
  },
  { timestamps: true }
);
export default mongoose.model("HallRoom", hallRoomSchema);

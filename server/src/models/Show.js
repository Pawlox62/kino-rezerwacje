import mongoose from "mongoose";
const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HallRoom",
      required: true,
    },
    date: { type: Date, required: true },
    basePrice: { type: Number, required: true, default: 28.9 },
    format: {
      type: String,
      enum: ["2d", "3d", "4dx"],
      required: true,
      default: "2d",
    },
    language: {
      type: String,
      enum: ["napisy", "dubbing"],
      required: true,
      default: "napisy",
    },
  },
  { timestamps: true }
);
export default mongoose.model("Show", showSchema);

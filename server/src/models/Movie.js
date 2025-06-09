import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    imageUrl: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);

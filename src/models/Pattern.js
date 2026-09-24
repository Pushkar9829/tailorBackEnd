import mongoose from "mongoose";

const PatternSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    version: { type: Number, required: true },
    definition: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

const PatternModel = mongoose.models.Pattern || mongoose.model("Pattern", PatternSchema);

export { PatternModel };

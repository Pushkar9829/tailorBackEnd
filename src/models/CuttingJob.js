import mongoose from "mongoose";

const CuttingJobSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    customerLabel: { type: String, default: "" },
    patternId: { type: String, required: true },
    patternVersion: { type: Number, required: true },
    order: { type: mongoose.Schema.Types.Mixed, default: null },
    unit: { type: String, required: true },
    measurementSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },
    gcode: { type: String, default: "" },
    measurementsMm: { type: mongoose.Schema.Types.Mixed, required: true },
    geometry: { type: mongoose.Schema.Types.Mixed, required: true },
    svg: { type: String, required: true },
  },
  { timestamps: true },
);

const CuttingJobModel = mongoose.models.CuttingJob || mongoose.model("CuttingJob", CuttingJobSchema);

export { CuttingJobModel };

import mongoose from "mongoose";

const sampleSchema = new mongoose.Schema({
  _name: {
    type: String,
    required: true,
  },
  body: [{ type: Object }],
  updatedAt: String,
  createdAt: String,
});

export default mongoose.model("Samples", sampleSchema);

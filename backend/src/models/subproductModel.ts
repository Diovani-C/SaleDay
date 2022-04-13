import mongoose from "mongoose";

const subproductSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
  },
});

export default mongoose.model("Subproduct", subproductSchema);

import mongoose from "mongoose";
import { barcodeRegx } from "../helpers/regex";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  barcode: {
    type: String,
    match: [barcodeRegx, "Codigo de barra invalido"],
  },
  price: {
    type: Number,
    min: 0,
  },
});

export default mongoose.model("Product", productSchema);

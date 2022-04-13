import mongoose from "mongoose";
import { saleSchema } from "./saleModel";
import { barcodeRegx } from "../helpers/regex";

const salesGroupSchema = new mongoose.Schema(
  {
    productsInfo: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        max: {
          type: Number,
          required: true,
        },
        subproductTags: [
          {
            tag: {
              type: Number,
              required: true,
            },
            subproductId: {
              type: String,
              match: [barcodeRegx, "Codigo de barra invalido"],
            },
            barcode: {
              type: String,
              match: [barcodeRegx, "Codigo de barra invalido"],
            },
            price: {
              type: Number,
              min: 0,
            },
            sold: {
              type: Boolean,
            },
          },
        ],
      },
    ],
    sales: [saleSchema],
  },
  { timestamps: true }
);

export default mongoose.model("SalesGroup", salesGroupSchema);

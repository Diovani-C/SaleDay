import mongoose from "mongoose";

export const saleSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        tags: {
          type: [Number],
        },
      },
    ],
  },
  { timestamps: true }
);

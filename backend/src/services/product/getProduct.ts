import Product from "../../models/productModel";

export async function get() {
  return await Product.find({}).exec();
}

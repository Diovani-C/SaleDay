import Product from "../../models/productModel";

export async function remove(data: ProductRequest["data"]) {
  const mongooseDocument = await Product.findById(data._id).exec();

  mongooseDocument.name = "Deleted";
  mongooseDocument.barcode = "";
  mongooseDocument.price = 0;

  return mongooseDocument.save();
}

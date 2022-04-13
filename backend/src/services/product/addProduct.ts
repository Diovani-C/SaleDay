import Product from "../../models/productModel";
import { capitalizeTheFirstLetterOfEachWord } from "../../helpers/common";

export async function add(data: ProductRequest["data"]) {
  const { _id, ...newProduct } = data;
  newProduct.name = capitalizeTheFirstLetterOfEachWord(newProduct.name);
  const mongooseDocument = new Product(newProduct);

  return mongooseDocument.save();
}

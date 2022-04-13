import Product from "../../models/productModel";
import { capitalizeTheFirstLetterOfEachWord } from "../../helpers/common";

export async function edit(data: ProductRequest["data"]) {
  const mongooseDocument = await Product.findById(data._id).exec();

  data.name = capitalizeTheFirstLetterOfEachWord(data.name);

  for (const [key, value] of Object.entries(data)) {
    if (value != undefined) {
      mongooseDocument[key] = value;
    }
  }

  return mongooseDocument.save();
}

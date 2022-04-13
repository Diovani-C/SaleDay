import subproduct from "../../models/subproductModel";
import { capitalizeTheFirstLetterOfEachWord } from "../../helpers/common";

export async function remove(data: SubproductRequest["data"]) {
  const mongooseDocument = await subproduct.findById(data._id).exec();

  mongooseDocument.name = "Deleted";
  mongooseDocument.price = 0;

  return mongooseDocument.save();
}

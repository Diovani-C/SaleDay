import subproduct from "../../models/subproductModel";
import { capitalizeTheFirstLetterOfEachWord } from "../../helpers/common";

export async function add(data: SubproductRequest["data"]) {
  data.name = capitalizeTheFirstLetterOfEachWord(data.name);
  const mongooseDocument = new subproduct(data);

  return mongooseDocument.save();
}

import subproduct from "../../models/subproductModel";
import { capitalizeTheFirstLetterOfEachWord } from "../../helpers/common";

export async function edit(data: SubproductRequest["data"]) {
  const mongooseDocument = await subproduct.findById(data._id).exec();

  data.name = capitalizeTheFirstLetterOfEachWord(data.name);

  for (const [key, value] of Object.entries(data)) {
    if (value != undefined) {
      mongooseDocument[key] = value;
    }
  }

  return mongooseDocument.save();
}

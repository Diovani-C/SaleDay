import Customer from "../../models/customerModel";
import { capitalizeTheFirstLetterOfEachWord } from "../../helpers/common";

export async function edit(data: CustomerRequest["data"]) {
  const mongooseDocument = await Customer.findById(data._id).exec();

  data.name = capitalizeTheFirstLetterOfEachWord(data.name);

  for (const [key, value] of Object.entries(data)) {
    if (value != undefined) {
      mongooseDocument[key] = value;
    }
  }

  return mongooseDocument.save();
}

import Customer from "../../models/customerModel";
import { capitalizeTheFirstLetterOfEachWord } from "../../helpers/common";

export async function add(data: CustomerRequest["data"]) {
  const { _id, ...newCustomer } = data;
  newCustomer.email = newCustomer.email?.toLowerCase();
  newCustomer.name = capitalizeTheFirstLetterOfEachWord(newCustomer.name);
  const mongooseDocument = new Customer(newCustomer);

  return mongooseDocument.save();
}

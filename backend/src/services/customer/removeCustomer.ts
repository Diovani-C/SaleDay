import Customer from "../../models/customerModel";

export async function remove(data: CustomerRequest["data"]) {
  const mongooseDocument = await Customer.findById(data._id).exec();

  mongooseDocument.name = "Deleted";
  mongooseDocument.cellphone = "";
  mongooseDocument.phone = "";
  mongooseDocument.email = "";

  return mongooseDocument.save();
}
